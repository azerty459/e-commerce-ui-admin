import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {Overlay} from 'ngx-modialog';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {ActivatedRoute, Router} from "@angular/router";
import {Pagination} from "../../../e-commerce-ui-common/models/Pagination";


@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public ajoutRef: String;
  public ajoutNom: String;
  public ajoutDescription: String;
  public ajoutPrixHT: number;

  // Pagination
  public page: Observable<Pagination>;
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
    this.page = this.produitBusiness.getProduitByPagination(this.pageActuelURL, this.messagesParPage);
    this.page.subscribe(value => {
        this.pageActuelURL = value.pageActuelle;
        this.nombreDeProduit = value.total;
        this.produits = value.tableau;
      },
      error2 => {
        console.log("Erreur getProduitByPagination", error2)
      });
    this.pageMax = await this.getPageMax();
    this.redirection();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.affichage();
  }

  getPageMax(): Promise<number> {
    return new Promise(resolve => this.page.subscribe(value => resolve(value.pageMax)));
  }

  async redirection() {
    console.log(this.pageActuelURL);
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
      .then(() => this.produitBusiness.deleteProduit(produit.ref).subscribe(() => this.rafraichirListeProduit()))
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  rafraichirAjout() {
    this.rafraichirListeProduit();
    this.ajoutRef = '';
    this.ajoutNom = '';
    this.ajoutDescription = '';
    this.ajoutPrixHT = null;
  }

  rafraichirListeProduit() {
    this.affichage();
  }
}
