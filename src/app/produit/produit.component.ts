import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Produit} from "../../models/Produit";
import {ProduitBusiness} from "../../business/produit.business";

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  public produits: Observable<Produit[]>;
  public nombreDeProduit: number;

  constructor(
    private produitBusiness: ProduitBusiness
  ) {}

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }

  ajouter(ref: String, nom: String, description: String, prixHT: number) {
    this.produitBusiness.addProduit(ref, nom, description, prixHT).subscribe(() => this.rafraichirAjout());
  }

  modifier(ref: String, nom: String, description: String, prixHT: number) {
    this.produitBusiness.updateProduit(ref, nom, description, prixHT).subscribe(() => this.rafraichirListeProduit());
  }

  supprimer(ref: String) {
    this.produitBusiness.deleteProduit(ref).subscribe(() => this.rafraichirListeProduit());
    this.rafraichirListeProduit();
  }

  rafraichirAjout(){
    this.rafraichirListeProduit();
  }

  rafraichirListeProduit(){
    this.produits = this.produitBusiness.getProduit();
    this.produits.subscribe(value => this.nombreDeProduit = value.length);
  }
}
