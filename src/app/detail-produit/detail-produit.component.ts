import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';
import {ProduitComponent} from '../produit/page.produit.component';


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {

  p: Produit;

  message: string;

  ajout: boolean;

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
      this.p = new Produit(null,null,null,null)
    } else {
      this.ajout = false;
      this.produitBusiness.getProduitByRef(refProduit).subscribe(produit => {
        this.p = produit[0];
        console.log(this.p);
      });
    }

    console.log(this.p); // UNDEFINED
    // console.log(this.ajout);
  }

  supprimer(ref: String) {
    if(confirm('Êtes-vous certain(e) de vouloir supprimer ce produit?')) {
      this.produitBusiness.deleteProduit(ref).subscribe(() => this.message = "Le produit a été supprimé.");
    }
  }

  modifier() {
    this.produitBusiness.updateProduit(this.p.ref, this.p.nom, this.p.description, this.p.prixHT).subscribe(() => this.message = "Le produit a été mis à jour");
  }

  ajouter() {
    this.produitBusiness.addProduit(this.p.ref, this.p.nom, this.p.description, this.p.prixHT).subscribe(() => this.message = "Le produit a été ajouté.");
  }

  goBack(): void {
    this.location.back();
  }

}
