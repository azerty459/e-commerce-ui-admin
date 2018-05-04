import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {Location} from '@angular/common';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {CategoriesComponent} from '../categories/categories.component';

@Component({
  selector: 'app-detail-categorie',
  templateUrl: './detail-categorie.component.html',
  styleUrls: ['./detail-categorie.component.css']
})
export class DetailCategorieComponent implements OnInit {

  nomNouvelleCategorie: string;

  nomcategorieParente: string;

  message: string;

  enfant: boolean;

  constructor(
    private route: ActivatedRoute,
    private categorieBusiness: CategorieBusinessService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCategorie();
  }

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
    }
  }

  ajouterParent(): void {
    this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(() => this.message = 'La catégorie parent a été ajoutée.');
  }

  ajouterEnfant(nomPere: string): void {
    this.categorieBusiness.ajouterCategorieEnfant(this.nomNouvelleCategorie, nomPere).subscribe(() => this.message = 'La catégorie enfant a été ajoutée.');
  }



  goBack(): void {
    this.location.back();
  }
}
