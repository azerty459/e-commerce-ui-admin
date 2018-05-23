import {OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Component} from "@angular/core";
import {ErreurComponent} from "../erreur/erreur.component";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-detail-categorie',
  templateUrl: './detail-categorie.component.html',
  styleUrls: ['./detail-categorie.component.css']
})
export class DetailCategorieComponent implements OnInit {

  /**
   * Nom de la nouvelle catégorie en cas de création.
   */
  nomNouvelleCategorie: string;

  /**
   * Message à afficher après une action
   */
  public message: string;

  /**
   * Parent direct de la catégorie (sous forme d'objet)
   */
  parentObj: Categorie;

  /**
   * Nom de la catégorie parente directement.
   */
  parent: string;

  /**
   * Indique si on ajoute une catégorie enfant d'une autre catégorie
   */
  public enfant: boolean;

  /**
   * Liste des sous-catégories de la catégorie en cours sur la page de détail (Observable)
   */
  public sousCategories: Observable<Categorie[]>;

  /**
   * Liste des noms de sous catégories (Tableau de Catégories)
   */
  public listSousCategories: Categorie[];

  /**
   * Indique s'il y a des sous-catégories pour une catégorie donnée.
   */
  public sousCatPresentes: boolean;

  /**
   * Indique s'il y a eu une erreur lors des modifications des catégories.
   */
  public isError: boolean;

  /**
   * Positionement des messages de type ToolType
   */
  public positionAvantTooltip = 'before';
  public positionApresTooltip = 'after';

  /**
   * Observable d'un tableau d'objets de categories
   */
  public categoriesObservable: Observable<Categorie[]>;

  /**
   * Tableau contenant toutes les catégories
   */
  public categories: Categorie[];

  /**
   * Boolean permettant de cacher la lsite déroulante
   */
  public cacherChoixParent: boolean;

  /**
   * Stockage du choix de la liste déroulante
   */
  public inputChoixParent: string;

  /**
   * Liste de toutes les catégories
   */
  allCategories: Categorie[];

  /**
   * Parents potentiels d'une catégorie
   */
  parentsPotentiels: Categorie[];

  /**
   * Message affiché en cas de changement de parent d'une catégorie
   */
  alerte: string;

  /**
   * Form contrôle permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixCategorieFormControl: FormControl = new FormControl();

  /**
   * Form group permettant de checker la réponse non à la question par défaut
   */
  public formGroupQuestion: FormGroup;

  /**
   * Categorie
   */
  public categorie: Categorie;

  public categorieModifiable: Categorie;


  constructor(private route: ActivatedRoute,
              private categorieBusiness: CategorieBusinessService,
              private location: Location,
              private _router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isError = false;
    this.alerte = '';
    this.getCategorie();
    // Permets de checker sur non le radio bouton par défaut
    this.formGroupQuestion = this.fb.group({
      choix: ['true']
    });
  }

  /**
   * Initialise la page de détail d'une catégorie.
   */
  getCategorie(): void {

    const url = this.route.snapshot.routeConfig.path;

    // Ajout du nom de la catégorie si on ajoute une catégorie enfant.
    if (url === 'admin/categories/detail/ajouter') {
      // On ajoute une catégorie parent
      this.enfant = false;
      this.categoriesObservable = this.categorieBusiness.getAllCategories();
      this.categoriesObservable.subscribe(
        categories => {
          this.categories = categories as Categorie[];
          if (this.categories != undefined) {
            // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
            this.categoriesObservable = this.choixCategorieFormControl.valueChanges.pipe(
              startWith(''),
              map(val => this.categories.filter(categorie => categorie.nomCat.toLowerCase().indexOf(val.toLowerCase()) === 0))
            );
          }
        });
    } else {

      // cas où on ajoute une catégorie enfant à une catégorie de référence 'id'
      const idCategorie = this.route.snapshot.paramMap.get('id');
      this.categorieBusiness.getCategorieByID(idCategorie).subscribe(value => {
        if (value.valueOf() instanceof Categorie) {
          this.categorie = value;
          this.categorieModifiable = JSON.parse(JSON.stringify(this.categorie));
          this.enfant = true;

          // Aller chercher les sous-catégories de la catégorie examinée dans la page de détail
          const details = this.categorieBusiness.getDetails(this.categorie.nomCat);

          // Récupérer le détail de la catégorie parente et des sous-catégories.
          details.subscribe(categories => {

            this.parentObj = categories['parent'];
            this.parent = this.parentObj['nom'];
            this.listSousCategories = categories['sousCategories'];

            // Vérification qu'il y a des sous-catégories
            if (this.listSousCategories[0]) {
              this.sousCatPresentes = true;
            } else {
              this.sousCatPresentes = false;
            }

            // Récupérer toutes les catégories pour la liste déroulante des catégories parentes.
            this.parentsPotentiels = [];
            this.categorieBusiness.getAllCategories().subscribe(
              (cat) => {
                this.allCategories = cat as Categorie[];

                // TODO: enlever aussi les sous-categories des sous-catégories
                // Enlever les sous-catégories de la catégorie dont on examine les détails de la liste des catégories
                // (on ne peut pas les proposer comme parents potentiels)
                const idsDejaAjoutees = [];
                this.allCategories.forEach(c1 => {
                  let estAAjouter = true;
                  this.listSousCategories.forEach(c2 => {
                    if (c1.sontIdentiques(c2)) {
                      estAAjouter = false;
                    }
                  });
                  // On évite de rajouter des catégories en doublon et la catégorie de départ elle-même
                  if (estAAjouter && idsDejaAjoutees.indexOf(c1.id) < 0 && c1.nomCat !== this.categorie.nomCat) {
                    idsDejaAjoutees.push(c1.id);
                    this.parentsPotentiels.push(c1);
                  }
                });
              }
            );
          });
        } else {
          this._router.navigate(['page-404'], {skipLocationChange: true});
        }
      });
    }
  }

  /**
   * Permet d'ajouter une catégorie en fonction du cas
   */
  ajouterCategorie() {
    if (this.cacherChoixParent) {
      this.ajouterParent();
    } else {
      if (this.nomNouvelleCategorie.length === 0) {
        this.message = "Veuillez renseigner le nom de la catégorie à ajouter";
        this.isError = true;
      } else {
        this.isError = false;
        this.categories.forEach(categorie => {
          if (categorie.nomCat === this.inputChoixParent) {
            this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, categorie.id).subscribe(
              (value) => {
                // si la value instancie un objet categorie, on fait une redirection sinon on affiche le message erreur
                if (value.valueOf() instanceof Categorie) {
                  console.log(value);
                  this._router.navigate(['/admin/categories/detail', value.id]);
                } else {
                  this.message = value;
                }
              });
          }
        });
      }
    }
  }

  ajouterParent(): void {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;
    } else {
      this.isError = false;
      this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(value => {
        this._router.navigate(['/admin/categories/detail', value.id]);
      });
    }
  }

  ajouterEnfant(idPere: number): void {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;

    } else {

      this.isError = false;
      this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, idPere).subscribe(
        () => {
          this.message = 'La catégorie enfant a été ajoutée.';
          this.getCategorie();

          // Mettre à jour la liste des sous-catégories
          this.sousCategories = this.categorieBusiness.getDetails(this.categorie.nomCat);
          this.sousCategories.subscribe(categories => {
            this.listSousCategories = categories as Categorie[];

            // Conversion de listSousCategories en tableau pour itérer dessus dans le HTML
            const array = [];
            for (const i in this.listSousCategories) {
              if (this.listSousCategories.hasOwnProperty(i)) {
                array.push(this.listSousCategories[i]);
              }
            }
            this.listSousCategories = array;

            // Vérifier qu'il y a bien des sous-catégories à afficher
            if (this.listSousCategories && this.listSousCategories.length !== 0) {
              this.sousCatPresentes = true;
            } else {
              this.sousCatPresentes = false;
            }
          });
        });

    }
  }

  /**
   * Alerte l'utilisateur sur les risques liés au changement de parent d'une catégorie.
   */
  alerteChangementDeParent(): void {

    this.alerte = "Message d'alerte.";

  }

  goBack(): void {
    this._router.navigate(['/admin/categories']);
  }
}
