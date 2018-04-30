import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ProduitBusiness} from "../../../e-commerce-ui-common/business/produit.business";
import {Produit} from "../../../e-commerce-ui-common/models/Produit";

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
    private produitBusiness: ProduitBusiness
  ) {}

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }

  // supprimer(ref: String) {
  //   this.produitBusiness.deleteProduit(ref).subscribe(() => this.rafraichirListeProduit());
  //   this.rafraichirListeProduit();
  // }

  supprimer(ref: String) {
    if(confirm('Êtes-vous certain(e) de vouloir supprimer ce produit?')) {
      this.produitBusiness.deleteProduit(ref).subscribe(() => this.rafraichirListeProduit());
    }
  }

  rafraichirAjout(){
    this.rafraichirListeProduit();
    this.ajoutRef="";
    this.ajoutNom="";
    this.ajoutDescription="";
    this.ajoutPrixHT=null;
  }

  rafraichirListeProduit(){
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }
}
