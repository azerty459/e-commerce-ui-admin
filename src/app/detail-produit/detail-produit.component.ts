import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';
import {Observable} from "rxjs/Observable";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  //test
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  message: string;
  ajout: boolean;

  public observableProduit: Observable<Produit>;
  public produit: Produit;

  constructor(
    private route: ActivatedRoute,
    private produitBusiness: ProduitBusiness,
    private location: Location
  ) {}

  ngOnInit() {
    this.getProduit();
  }

  getProduit(): void {
    const refProduit = this.route.snapshot.paramMap.get('id');
    if(refProduit === 'nouveau') {
      this.ajout = true;
      this.produit = new Produit(null,null,null,null)
    } else {
      this.ajout = false;
      this.observableProduit = this.produitBusiness.getProduitByRef(refProduit);
      this.observableProduit.subscribe(
        value => this.produit = value
      )

    }

    console.log(this.produit); // UNDEFINED
    // console.log(this.ajout);
  }

  supprimer(ref: String) {
    if(confirm('Êtes-vous certain(e) de vouloir supprimer ce produit?')) {
      this.produitBusiness.deleteProduit(ref).subscribe(() => this.message = "Le produit a été supprimé.");
    }
  }

  modifier() {
    this.produitBusiness.updateProduit(this.produit.ref, this.produit.nom, this.produit.description, this.produit.prixHT).subscribe(() => this.message = "Le produit a été mis à jour");
  }

  ajouter() {
    this.produitBusiness.addProduit(this.produit.ref, this.produit.nom, this.produit.description, this.produit.prixHT).subscribe(() => this.message = "Le produit a été ajouté.");
  }

  goBack(): void {
    this.location.back();
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let nomCat = event.value;

    if ((nomCat || '').trim()) {
      let categorie = new Categorie(nomCat);
      this.produitBusiness.addCategorieProduit(this.produit, categorie).subscribe(value => this.produit.arrayCategorie = value.arrayCategorie);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(categorie: any): void {
    let index = this.produit.arrayCategorie.indexOf(categorie);
    if (index >= 0) {
      this.produit.arrayCategorie.splice(index, 1);
      this.produitBusiness.deleteCategorieProduit(this.produit,categorie).subscribe();
    }
  }
}
