import {OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
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
   * Nom de la catégorie parente d'une catégorie
   */
  public nomcategorieParente: string;

  /**
   * Message à afficher après une action
   */
  public message: string;

  /**
   * Indique si on ajoute une catégorie enfant d'une autre catégorie
   */
  public enfant: boolean;

  /**
   * Liste des noms des sous-catégories de la catégorie en cours sur la page de détail (Observable)
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
  positionAvantTooltip = 'before';
  positionApresTooltip = 'after';

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
  public cacherChoixParent: boolean = true;

  /**
   * Stockage du choix de la liste déroulante
   */
  public inputChoixParent: string;

  /**
   * Form contrôle permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixCategorieFormControl: FormControl = new FormControl();

  /**
   * Form group permettant de checker la réponse non à la question par défaut
   */
  public formGroupQuestion: FormGroup;

  constructor(private route: ActivatedRoute,
              private categorieBusiness: CategorieBusinessService,
              private location: Location,
              private _router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isError = false;
    this.getCategorie();
    // Permets de checker sur non le radio bouton par défaut
    this.formGroupQuestion = this.fb.group({
      choix: ['true']
    })
  }

  /**
   * Initialise la page de détail d'une catégorie.
   */
  getCategorie(): void {

    const url = this.route.snapshot.routeConfig.path;
    this.nomNouvelleCategorie = '';
    // Ajout du nom de la catégorie parent si on ajoute une catégorie enfant.
    if (url === 'admin/categories/detail/ajouter') {
      // On ajoute une catégorie parent
      this.enfant = false;
      this.categoriesObservable = this.categorieBusiness.getAllCategories();
      this.categoriesObservable.subscribe(
        categories => {
          this.categories = categories as Categorie[];
          if(this.categories != undefined){
            // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
            this.categoriesObservable = this.choixCategorieFormControl.valueChanges.pipe(
              startWith(''),
              map(val => this.categories.filter(categorie => categorie.nomCat.toLowerCase().indexOf(val.toLowerCase()) === 0))
            );
          }
        })
    } else {
      // cas où on ajoute une catégorie enfant à une catégorie père de référence 'id'
      const refCategorie = this.route.snapshot.paramMap.get('id');
      this.nomcategorieParente = refCategorie;
      this.enfant = true;

      // Aller chercher les sous-catégories de la catégorie examinée dans la page de détail
      this.sousCategories = this.categorieBusiness.sousCategories(this.nomcategorieParente);

      // Récupérer une liste de Categorie
      this.sousCategories.subscribe(categories => {
        this.listSousCategories = categories as Categorie[];

        // Vérifier qu'il y a bien des sous-catégories à afficher
        if (this.listSousCategories && this.listSousCategories.length !== 0) {
          this.sousCatPresentes = true;
        } else {
          this.sousCatPresentes = false;
        }
      });
    }
  }

  /**
   * Permet d'ajouter une catégorie en fonction du cas
   */
  ajouterCategorie(){
    if(this.cacherChoixParent){
      this.ajouterParent();
    }else{
      if (this.nomNouvelleCategorie.length === 0) {
        this.message = "Veuillez renseigner le nom de la catégorie à ajouter";
        this.isError = true;
      } else {
        this.isError = false;
        this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, this.inputChoixParent).subscribe(
          (value) => {
            console.log(value.valueOf());
            // si la value instancie un objet categorie, on fait une redirection sinon on affiche le message erreur
            if(value.valueOf() instanceof Categorie){
              this._router.navigate(['/admin/categories/detail', this.nomNouvelleCategorie]);
            }else{
              this.message = value;
            }
          });
      }
    }
  }

  ajouterParent(): void {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = "Veuillez renseigner le nom de la catégorie à ajouter";
      this.isError = true;
    } else {
      this.isError = false;
      this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(() => {
        this._router.navigate(['/admin/categories/detail', this.nomNouvelleCategorie]);
      });
    }
  }

  ajouterEnfant(nomPere: string): void {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = "Veuillez renseigner le nom de la catégorie à ajouter";
      this.isError = true;
    } else {
      this.isError = false;
      this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, nomPere).subscribe(
        () => {
          this.message = 'La catégorie enfant a été ajoutée au père: '+nomPere;
          // Mettre à jour la liste des sous-catégories
          this.sousCategories = this.categorieBusiness.sousCategories(this.nomcategorieParente);
          this.sousCategories.subscribe(categories => {
            this.listSousCategories = categories as Categorie[];
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


  goBack(): void {
    this._router.navigate(['/admin/categories']);
  }
}
