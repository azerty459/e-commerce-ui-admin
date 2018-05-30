import {Component, OnInit} from '@angular/core';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  // Pagination
  public produits: Array<Produit>;
  public nombreDeProduit;

  public pageActuelURL: number;
  public pageMax: number;
  public pageMin: number = 1;
  public messagesParPage: number = 5;

  constructor(private modal: Modal,
              private produitBusiness: ProduitBusiness,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = parseInt(params.page);
      },
      error => {
        console.log("Erreur gestion de page ", error)
      },
    );
  }

  ngOnInit() {
    this.affichage();
  }

  async affichage() {
    let page = await this.produitBusiness.getProduitByPagination(this.pageActuelURL, this.messagesParPage);
    if(page != null && page != undefined){
      this.pageActuelURL = page.pageActuelle;
      this.nombreDeProduit = page.total;
      this.produits = page.tableau;
      this.pageMax = page.pageMax;
    }else{
      console.log("Erreur getProduitByPagination");
    }
    this.redirection();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.affichage();
  }

  async redirection() {
    if (this.pageActuelURL <= 0)
      this.router.navigate(['/admin/produit', this.pageMin]);
    else if (this.pageActuelURL > this.pageMax) {
      this.router.navigate(['/admin/produit', this.pageMax]);
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
    this.router.navigate(['/admin/produit', this.pageActuelURL]);
  }

  supprimer(produit: Produit) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de ' + produit.nom + ' - ' + produit.ref)
      .body('Comfirmez vous la supression de ' + produit.nom + ' - ' + produit.ref + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(async() => {
        let supprimer = await this.produitBusiness.deleteProduit(produit);
        if(supprimer){
          this.rafraichirListeProduit();
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  rafraichirListeProduit() {
    this.affichage();
  }
}
