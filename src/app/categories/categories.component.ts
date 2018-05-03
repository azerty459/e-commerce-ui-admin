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

  public nombreDeCategories: number;

  public categories: Observable<Categorie[]>;

  constructor(private categorieBusiness: CategorieBusinessService) {

  }

  ngOnInit() {
    // Lancement de la récupération des catégories
    this.categories = this.categorieBusiness.getAllCategories();

    // On mappe l'objet résultat (Observable contenant un tableau de Categorie)
    this.categories.map(value => {
      // Pour chaque categorie non nulle
      if(value != null) {
        const categoriesList = value['categories'];
        this.nombreDeCategories = categoriesList.length;
      }
    });
  }




}
