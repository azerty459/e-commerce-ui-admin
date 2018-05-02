import { Component, OnInit } from '@angular/core';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Observable} from 'rxjs/Observable';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public nombreDeCategories: number;

  public categories: Observable<Categorie[]>;



  constructor(private categorieBusiness: CategorieBusinessService) { }

  ngOnInit() {
    this.categories = this.categorieBusiness.getAllCategories();
    this.categories.subscribe(value => this.nombreDeCategories = value.length);
  }

}
