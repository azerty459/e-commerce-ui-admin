import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';
import {Observable} from "rxjs/Observable";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {UploadImgComponent} from "../utilitaires/upload-img/upload-img.component";
import {PreviousRouteBusiness} from "../../../e-commerce-ui-common/business/previous-route.business";

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  @ViewChild('photo') photo;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  urlPrecedenteAttendue ="/admin/produit";
  positionBeforeTooltip = 'before';
  positionAfterTooltip = 'after';
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  message: string;
  ajout: boolean;
  cacherAlert: boolean = true;
  public observableProduit: Observable<Produit>;
  public produit: Produit;
  public produitModifie: Produit;
  public disabledAjoutCategorie: boolean;

  constructor(
    private uploadImg: UploadImgComponent,
    private modal: Modal,
    private previousRouteBusiness : PreviousRouteBusiness,
    private route: ActivatedRoute,
    private produitBusiness: ProduitBusiness,
) {}

  ngOnInit() {
    this.getProduit();
  }

  getProduit(): void {
    const refProduit = this.route.snapshot.paramMap.get('id');
    if(refProduit === 'nouveau') {
      this.ajout = true;
      this.produit = new Produit(null,null,null,null, null);
      this.disabledAjoutCategorie = true;
    } else {
      this.ajout = false;
      this.observableProduit = this.produitBusiness.getProduitByRef(refProduit);
      this.disabledAjoutCategorie = false;
      this.observableProduit.subscribe(
        value => {
          this.produit = value;
          this.produitModifie = JSON.parse(JSON.stringify(this.produit));
        }
      )
    }

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
      .then(() => this.produitBusiness.deleteProduit(this.produit.ref).subscribe(() => this.message = "Le produit a été supprimé.")  )
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  modifier() {
    this.produitBusiness.updateProduit(this.produitModifie.ref, this.produitModifie.nom, this.produitModifie.description, this.produitModifie.prixHT)
      .subscribe(() => {
        this.cacherAlert = false;
        this.message = "Le produit a été mis à jour";
        this.produit = JSON.parse(JSON.stringify(this.produitModifie));
      });
  }

  ajouter() {
    this.produitBusiness.addProduit(this.produitModifie.ref, this.produitModifie.nom, this.produitModifie.description, this.produitModifie.prixHT)
      .subscribe(() => {
        this.cacherAlert = false;
        this.message = "Votre produit a été correctement ajouté";
        this.disabledAjoutCategorie = false;
      });
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let nomCat = event.value;

    if ((nomCat || '').trim()) {
      let categorie = new Categorie(null, nomCat, null, null);
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


