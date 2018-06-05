import {Component, OnInit} from '@angular/core';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie.service';
import {Observable} from 'rxjs';

import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public message: string;

  // Pagination
  public categories: Array<Categorie>;
  public nombreDeCategorie;

  public pageActuelURL: number;
  public pageMax: number;
  public pageMin: number = 1;
  public messagesParPage: number = 5;

  constructor(private categorieBusiness: CategorieBusinessService,
              private modal: Modal,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = parseInt(params.page);
      },
      error => {
        console.log("Erreur gestion de page ", error)
      },
    );
  }

  ngOnInit() {
    // // Lancement de la récupération des catégories / NB: this.categories = liste d'objets Categorie
    // this.categories = this.categorieBusiness.getAllCategories();
    this.message = '';
    this.categorieBusiness.getTree();
    this.affichage();
  }

  async affichage() {
    let page = await this.categorieBusiness.getCategorieByPagination(this.pageActuelURL, this.messagesParPage);
    if(page != undefined && page != null){
      this.pageActuelURL = page.pageActuelle;
      this.nombreDeCategorie = page.total;
      this.categories = page.tableau;
      this.pageMax = page.pageMax;
    }else{
      console.log("Erreur getCategorieByPagination");
    }
    this.redirection();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.affichage();
  }

  async redirection() {
    if (this.pageActuelURL <= 0)
      this.router.navigate(['/admin/categorie', this.pageMin]);
    else if (this.pageActuelURL > this.pageMax) {
      this.router.navigate(['/admin/categorie', this.pageMax]);
    }
  }

  pagination(value: String) {
    if (value === "precedent") {
      if (this.pageActuelURL > this.pageMin) {
        this.pageActuelURL = this.pageActuelURL - 1;
      }
    } else {
      if (this.pageActuelURL < this.pageMax) {
        this.pageActuelURL = this.pageActuelURL + 1;
      }
    }
    this.affichage();
    this.router.navigate(['/admin/categorie', this.pageActuelURL]);
  }

  async supprimer(categorie: Categorie) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de la catégorie ' + categorie.nomCat + ' - id(' + categorie.id + ')')
      .body('Comfirmez vous la supression de la categorie ' + categorie.nomCat + ' - id(' + categorie.id + ')?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(async() => {
        let suppresion = await this.categorieBusiness.supprimerCategorie(categorie);
        if(suppresion != null && suppresion != undefined){
          this.ngOnInit();
          this.message = 'La catégorie a été supprimée';
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }
}
