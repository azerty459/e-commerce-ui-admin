import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {

  p: Produit;

  message: string;

  constructor(
    private route: ActivatedRoute,
    private produitBusiness: ProduitBusiness,
    private location: Location
  ) {}

  ngOnInit() {
    this.getProduit();
  }

  // getProduit(): void {
  //   const refProduit = this.route.snapshot.paramMap.get('id');
  //   this.produitBusiness.getProduitByRef(refProduit).subscribe(produit => { this.p = produit[0]; console.log(produit[0]); console.log(this.p); });
  //   console.log(this.p);
  // }

  getProduit(): void {
    const refProduit = this.route.snapshot.paramMap.get('id');
    this.produitBusiness.getProduitByRef(refProduit).subscribe(produit => {
      this.p = produit[0];
      console.log(this.p);
    });

    console.log(this.p);
  }

  // FONCTION EN DOUBLE (à part le message, mais en fait non)
  supprimer(ref: String) {
    this.produitBusiness.deleteProduit(ref).subscribe(() => this.message = "Le produit a été supprimé.");
  }

  goBack(): void {
    this.location.back();
  }

}
