import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Produit} from "../../models/Produit";
import {ProduitBusiness} from "../../business/produit.business";

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

  ajouter() {
    console.log("AjoutRef: "+this.ajoutRef);
    this.produitBusiness.addProduit(this.ajoutRef, this.ajoutNom, this.ajoutDescription, this.ajoutPrixHT).subscribe(() => this.rafraichirAjout());
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
