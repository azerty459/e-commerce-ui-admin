import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {CategoriesComponent} from '../categories/categories.component';
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
   * Nom de la catégorie parente d'une catégorie
   */
  nomcategorieParente: string;

  /**
   * Message à afficher après une action
   */
  message: string;

  /**
   * Indique si on ajoute une catégorie enfant d'une autre catégorie
   */
  enfant: boolean;

  /**
   * Liste des noms des sous-catégories de la catégorie en cours sur la page de détail.
   */
  sousCategories: Observable<Categorie[]>;

  constructor(
    private route: ActivatedRoute,
    private categorieBusiness: CategorieBusinessService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCategorie();
  }

  /**
   * Initialise la page de détail d'une catégorie.
   */
  getCategorie(): void {

    const url = this.route.snapshot.routeConfig.path;
    this.nomNouvelleCategorie = '';

    // Ajout du nom de la catégorie parent si on ajoute une catégorie enfant.
    if(url === 'admin/categories/detailcategorie/nouveauparent') {
      // On ajoute une catégorie parent
      this.nomcategorieParente = 'Aucune';
      this.enfant = false;
    }
    else {
      // cas où on ajoute une catégorie enfant à une catégorie père de référence 'id'
      const refCategorie = this.route.snapshot.paramMap.get('id');
      this.nomcategorieParente = refCategorie;
      this.enfant = true;

      // Aller chercher les sous-catégories de la catégorie examinée dans la page de détail
      this.sousCategories = this.categorieBusiness.sousCategories(this.nomcategorieParente);
      // console.log(this.sousCategories);

      const test = this.sousCategories.subscribe( val => {
        console.log(val);
      });



    }


  }

  ajouterParent(): void {
    this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(() => this.message = 'La catégorie parent a été ajoutée.');
  }

  ajouterEnfant(nomPere: string): void {
    this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, nomPere).subscribe(
      () => this.message = 'La catégorie enfant a été ajoutée.');
  }



  goBack(): void {
    this.location.back();
  }
}
