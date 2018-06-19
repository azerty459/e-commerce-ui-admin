import { Component, OnInit } from '@angular/core';
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {Produit} from "../../../e-commerce-ui-common/models/Produit";
import {ProduitBusiness} from "../../../e-commerce-ui-common/business/produit.service";
import {PaginationService} from "../../../e-commerce-ui-common/business/pagination.service";
import {UtilisateurService} from "../../../e-commerce-ui-common/business/utilisateur.service";
import {Utilisateur} from "../../../e-commerce-ui-common/models/Utilisateur";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {


  // Pagination
  public messagesParPage = 5;
  private pageActuelURL;

  constructor(private modal: Modal,
              public paginationService: PaginationService,
              public utilisateurService: UtilisateurService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
        // radix à 10 pour un décimal
        this.pageActuelURL = parseInt(params.page, 10);
      },
      error => {
        console.log('Erreur gestion de page ', error);
      },
    );
  }


  async display() {
    this.paginationService.paginationUtilisateur(this.pageActuelURL, this.messagesParPage);
    console.log(await this.paginationService.getArray().length);
    this.paginationService.redirection('/admin/utilisateur');
  }

  ngOnInit() {
    this.display();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.display();
  }

  paging(value: String) {
    if (value === 'precedent') {
      console.log(this.pageActuelURL > this.paginationService.getMaxPage());
      if (this.pageActuelURL > this.paginationService.getMinPage()) {
        this.pageActuelURL = this.pageActuelURL - 1;
        console.log(this.pageActuelURL);
      }
    } else {
      if (this.pageActuelURL < this.paginationService.getMaxPage()) {
        this.pageActuelURL = this.pageActuelURL + 1;
      }
    }
    this.paginationService.refreshURL('/admin/utilisateurs/page/' + this.pageActuelURL);
    this.display();
  }


  deleteUser(utilisateur: Utilisateur) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de ' + utilisateur.email + ' - ' + utilisateur.id)
      .body('Comfirmez vous la supression de ' + utilisateur.email + ' - ' + utilisateur.id + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(async() => {
        const supprimer = await this.utilisateurService.delete(utilisateur);
        if (supprimer) {
          this.display();
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }
}
