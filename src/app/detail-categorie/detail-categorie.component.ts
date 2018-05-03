import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private categorieBusiness: CategorieBusinessService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCategorie();
  }

  getCategorie(): void {


    const nomCategorie = this.route.snapshot.paramMap.get('id');

    if(nomCategorie === 'nouveauparent') {
      this.nomNouvelleCategorie = '';
      this.nomcategorieParente = 'Aucune';
    } else if(nomCategorie === 'nouvelenfant') {
      this.nomNouvelleCategorie = '';

    }
  }

  ajouter(): void {
    this.categorieBusiness.ajouterCategorieParent(this.nomNouvelleCategorie).subscribe(() => this.message = 'La catégorie a été ajoutée.');
  }


  goBack(): void {
    this.location.back();
  }

}
