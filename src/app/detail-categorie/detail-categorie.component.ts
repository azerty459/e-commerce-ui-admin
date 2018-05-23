import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {Observable} from 'rxjs/Observable';

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
   * Nom de la catégorie
   */
  nomCategorie: string;

  /**
   * Message à afficher après une action
   */
  message: string;

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
  enfant: boolean;

  /**
   * Liste des sous-catégories de la catégorie en cours sur la page de détail (Observable)
   */
   sousCategories: Observable<Categorie[]>;

  /**
   * Liste des noms de sous catégories (Tableau de Catégories)
   */
  listSousCategories: Categorie[];

  /**
   * Indique s'il y a des sous-catégories pour une catégorie donnée.
   */
  sousCatPresentes: boolean;

  /**
   * Indique s'il y a eu une erreur lors des modifications des catégories.
   */
  isError: boolean;

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


  constructor(
    private route: ActivatedRoute,
    private categorieBusiness: CategorieBusinessService,
    private location: Location
  ) {}

  ngOnInit() {
    this.isError = false;
    this.alerte = '';
    this.getCategorie();
  }

  /**
   * Initialise la page de détail d'une catégorie.
   */
  getCategorie(): void {

    const url = this.route.snapshot.routeConfig.path;
    this.nomNouvelleCategorie = '';

    // Ajout du nom de la catégorie si on ajoute une catégorie enfant.
    if (url === 'admin/categories/ajouter') {
      // On ajoute une catégorie parent
      this.nomCategorie = 'Aucune';
      this.enfant = false;

    } else {

      // cas où on ajoute une catégorie enfant à une catégorie de référence 'id'
      const refCategorie = this.route.snapshot.paramMap.get('id');
      this.nomCategorie = refCategorie;
      this.enfant = true;

      // Aller chercher les sous-catégories de la catégorie examinée dans la page de détail
      const details = this.categorieBusiness.getDetails(this.nomCategorie);

      // Récupérer le détail de la catégorie parente et des sous-catégories.
      details.subscribe( categories => {

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
              if (estAAjouter && idsDejaAjoutees.indexOf(c1.id) < 0 && c1.nomCat !== this.nomCategorie) {
                idsDejaAjoutees.push(c1.id);
                this.parentsPotentiels.push(c1);
              }
            });
          }
        );
      });
    }
  }


  ajouterParent(): void {
    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;
    } else {
      this.isError = false;
      this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(() => {
          this.message = 'La catégorie parent a été ajoutée.';
        });
    }

  }

  ajouterEnfant(nomPere: string): void {

    // Vérifier que ce qui a été entré n'est pas vide.
    if (this.nomNouvelleCategorie.length === 0) {
      this.message = 'Veuillez renseigner le nom de la catégorie à ajouter';
      this.isError = true;

    } else {

      this.isError = false;
      this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, nomPere).subscribe(
        () => {
          this.message = 'La catégorie enfant a été ajoutée.';
          this.getCategorie();

          // Mettre à jour la liste des sous-catégories
          this.sousCategories = this.categorieBusiness.getDetails(this.nomCategorie);
          this.sousCategories.subscribe( categories => {
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

    this.alerte = "Message d'alerte."

  }


  goBack(): void {
    this.location.back();
  }
}
