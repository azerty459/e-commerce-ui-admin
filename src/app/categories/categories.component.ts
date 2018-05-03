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

  constructor(private categorieBusiness: CategorieBusinessService) {

  }

  ngOnInit() {
    // Lancement de la récupération des catégories
    this.categories = this.categorieBusiness.getAllCategories(); // this.categories = liste d'objets Categorie
  }






}
