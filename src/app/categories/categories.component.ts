import { Component, OnInit } from '@angular/core';
import { CategorieBusinessService } from '../../../e-commerce-ui-common/business/categorie-business.service';
import {Observable} from 'rxjs/Observable';

import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {Produit} from "../../../e-commerce-ui-common/models/Produit";
import {Modal} from "ngx-modialog/plugins/bootstrap";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: Observable<Categorie[]>;

  public message: string;

  constructor(
    private categorieBusiness: CategorieBusinessService,
    private modal: Modal,
  ) {}

  ngOnInit() {
    // Lancement de la récupération des catégories / NB: this.categories = liste d'objets Categorie
    this.categories = this.categorieBusiness.getAllCategories();
    this.message = '';
  }

  supprimer(categorie: Categorie): void {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de la catégorie '+categorie.nomCat+' - id('+categorie.id+')')
      .body('Comfirmez vous la supression de la categorie '+categorie.nomCat+' - id('+categorie.id+')?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(() => this.categorieBusiness.supprimerCategorie(categorie.id).subscribe(() => {
        this.ngOnInit();
        this.message = 'La catégorie a été supprimée';
      }))
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }
}
