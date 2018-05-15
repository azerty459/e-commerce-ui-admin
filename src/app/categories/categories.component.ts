import { Component, OnInit } from '@angular/core';
import { CategorieBusinessService } from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Observable} from 'rxjs/Observable';

import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: Observable<Categorie[]>;

  public message: string;

  constructor(private categorieBusiness: CategorieBusinessService) {

  }

  ngOnInit() {
    // Lancement de la récupération des catégories
    this.categories = this.categorieBusiness.getAllCategories(); // this.categories = liste d'objets Categorie
    this.message = '';
  }

  supprimer(nomCat: string): void {
    if (confirm('Êtes-vous certain(e) de vouloir supprimer cette catégorie?')) {
      this.categorieBusiness.supprimerCategorie(nomCat).subscribe(() => {
        this.ngOnInit();
        this.message = 'La catégorie a été supprimée';
      });
    }
  }
}
