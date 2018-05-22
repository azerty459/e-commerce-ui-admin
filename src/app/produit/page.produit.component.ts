import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProduitBusiness } from '../../../e-commerce-ui-common/business/produit.business';
import { Produit } from '../../../e-commerce-ui-common/models/Produit';
import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import {Router} from "@angular/router";


@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public produits: Observable<Produit[]>;
  public nombreDeProduit: number;

  public ajoutRef: String;
  public ajoutNom: String;
  public ajoutDescription: String;
  public ajoutPrixHT: number;

  constructor(
    private modal: Modal,
    private produitBusiness: ProduitBusiness,
    private _router: Router
  ) {}

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }

  supprimer(produit:Produit) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de '+produit.nom+' - '+produit.ref)
      .body('Comfirmez vous la supression de '+produit.nom+' - '+produit.ref+'?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(() => this.produitBusiness.deleteProduit(produit.ref).subscribe(() => this.rafraichirListeProduit())  )
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
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }

  updateRedirection(ref: String){
    this._router.navigate(['/admin/produit/detail', ref]);
  }

  addRedirection(){
    this._router.navigate(['/admin/produit/detail', "nouveau"]);
  }
}
