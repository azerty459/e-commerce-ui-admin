import {OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie.service';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {Component} from "@angular/core";

@Component({
  selector: 'app-detail-categorie',
  templateUrl: './detail-categorie.component.html',
  styleUrls: ['./detail-categorie.component.css']
})
export class DetailCategorieComponent implements OnInit {

  /**
   * Nom de la nouvelle catégorie en cas de création.
   */
  public nomNouvelleCategorie: string;

  /**
   * Message à afficher après une action
   */
  public message: string;

  /**
   * Parent direct de la catégorie (sous forme d'objet)
   */
  public parentObj: Categorie;

  /**
   * Nom de la catégorie parente directement.
   */
  public parent: string;

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
   * Boolean permettant de cacher la la liste déroulante
   */
  public cacherChoixParent: boolean = true;

  /**
   * Stockage du choix de la liste déroulante
   */
  public inputChoixParent: string;

  /**
   * Parents potentiels d'une catégorie
   */
  public parentsPotentiels: Categorie[];

  /**
   * Message affiché en cas de changement de parent d'une catégorie
   */
  public alerte: string;

  /**
   * Form contrôle permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixCategorieFormControl: FormControl = new FormControl();

  /**
   * Form group permettant de checker la réponse non à la question par défaut
   */
  public formGroupQuestion: FormGroup;

  private idCategorie;

  /**
   * Categorie
   */
  public categorie: Categorie;

  public categorieModifiable: Categorie;


  constructor(private route: ActivatedRoute,
              private categorieBusiness: CategorieBusinessService,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isError = false;
    this.alerte = '';
    this.getCategorie();
  }

  /**
   * Initialise la page de détail d'une catégorie.
   */
  async getCategorie() {

    const url = this.route.snapshot.routeConfig.path;

    // Ajout du nom de la catégorie si on ajoute une catégorie enfant.
    if (url === 'admin/categorie/ajouter') {
      // Permets de checker sur non le radio bouton par défaut
      this.formGroupQuestion = this.fb.group({
        choix: ['true']
      });
      // On ajoute une catégorie parent
      this.enfant = false;
      this.categories = await this.categorieBusiness.getAllCategories();
      if (this.categories != undefined) {
        // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
        this.categoriesObservable = this.choixCategorieFormControl.valueChanges.pipe(
          startWith(''),
          map(val => this.categories.filter(categorie => categorie.nomCat.toLowerCase().indexOf(val.toLowerCase()) === 0))
        );
      }
    } else {
      this.idCategorie = this.route.snapshot.paramMap.get('id');
      this.categorie = await this.categorieBusiness.getCategorieByID(this.idCategorie);
      if (this.categorie.valueOf() instanceof Categorie) {
        this.categories = await this.categorieBusiness.getAllCategories();
        this.categorieModifiable = JSON.parse(JSON.stringify(this.categorie));
        this.enfant = true;

        // Aller chercher les sous-catégories de la catégorie examinée dans la page de détail
        const details = await this.categorieBusiness.getDetails(this.categorie);
        // Récupérer le détail de la catégorie parente et des sous-catégories.
        if (details != null && details != undefined) {
          this.parentObj = details['parent'];
          this.parent = this.parentObj['nom'];
          this.listSousCategories = details['sousCategories'];
          // Vérification qu'il y a des sous-catégories
          if (this.listSousCategories[0]) {
            this.sousCatPresentes = true;
          } else {
            this.sousCatPresentes = false;
          }

          // Récupérer toutes les catégories pour la liste déroulante des catégories parentes.
          this.parentsPotentiels = [];

          // TODO: enlever aussi les sous-categories des sous-catégories
          // Enlever les sous-catégories de la catégorie dont on examine les détails de la liste des catégories
          // (on ne peut pas les proposer comme parents potentiels)
          const idsDejaAjoutees = [];
          this.categories.forEach(c1 => {
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
      } else {
        this.router.navigate(['page-404'], {skipLocationChange: true});
      }
    }
  }

  /**
   * Permet d'ajouter une catégorie en fonction du cas
   */
  async ajouterCategorie() {
    if (this.cacherChoixParent) {
      this.ajouterParent();
    } else {
      if (this.nomNouvelleCategorie === undefined) {
        this.message = "Veuillez renseigner le nom de la catégorie à ajouter";
        this.isError = true;
      } else {
        this.isError = false;
        this.categories.forEach(async(categorie) => {
          if (categorie.nomCat === this.inputChoixParent) {
            let retour = await this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, 1);
            // si la value instancie un objet categorie, on fait une redirection sinon on affiche le message erreur
            if (retour.valueOf() instanceof Categorie) {
              this.router.navigate(['/admin/categorie/detail', retour.id]);
            } else {
              this.message = retour;
            }
          }
        });
      }
    }
  }

  async ajouterParent() {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie === undefined) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;
    } else {
      this.isError = false;
      let retour = await this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie);
      // si le retour instancie un objet de type categorie, on fait une redirection sinon on affiche le message erreur
      if (retour.valueOf() instanceof Categorie) {
        this.router.navigate(['/admin/categorie/detail', retour.id]);
      } else {
        this.message = retour;
      }
    }
  }

  async ajouterEnfant(categoriePere: Categorie) {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie === undefined) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;

    } else {

      this.isError = false;
      let categorie = this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, categoriePere.id);
      if (categorie != null && categorie != undefined) {
        this.message = 'La catégorie enfant a été ajoutée.';

        // Mettre à jour la liste des sous-catégories
        this.sousCategories = await this.categorieBusiness.getDetails(this.categorie);
        if (this.sousCategories != null && this.sousCategories != undefined) {
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
        }
      }
    }
  }

  /**
   * Alerte l'utilisateur sur les risques liés au changement de parent d'une catégorie.
   */
  alerteChangementDeParent(): void {

    this.alerte = "Message d'alerte.";

  }

  goBack(): void {
    this.router.navigate(['/admin/categorie']);
  }

  redirectionEnfant(id: number): void {
    this.router.navigateByUrl('', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/admin/categorie/detail/' + id]));
  }
}
