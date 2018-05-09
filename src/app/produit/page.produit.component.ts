import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProduitBusiness } from '../../../e-commerce-ui-common/business/produit.business';
import { Produit } from '../../../e-commerce-ui-common/models/Produit';
import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';

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
    private produitBusiness: ProduitBusiness
  ) {}

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }

  supprimer(ref: String) {
    // if (confirm('Êtes-vous certain(e) de vouloir supprimer ce produit?')) {
    //   this.produitBusiness.deleteProduit(ref).subscribe(() => this.rafraichirListeProduit());
    // }
    const dialogRef = this.modal.alert()
      .size('lg')
      .showClose(true)
      .title('A simple Alert style modal window')
      .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
      .open();

    dialogRef.result
      .then( result => alert(`The result is: ${result}`) );
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
}
