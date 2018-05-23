import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.business';
import {Observable} from "rxjs/Observable";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {CategorieBusinessService} from "../../../e-commerce-ui-common/business/categorie-business.service";
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
    private categorieBusiness: CategorieBusinessService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getProduit();
  }

  getProduit(): void {
    const url = this.route.snapshot.routeConfig.path;

    if (url === 'admin/produit/detail/ajouter') {
      this.ajout = true;
      this.produitModifie = new Produit(null,null,null,null, []);
      this.produit = new Produit(null,null,null,null, []);
      this.disabledAjoutCategorie = true;
    } else {
      this.ajout = false;
      this.disabledAjoutCategorie = false;
      const refProduit = this.route.snapshot.paramMap.get('id');
      this.observableProduit = this.produitBusiness.getProduitByRef(refProduit);
      this.observableProduit.subscribe(
        value => {
          this.produit = value;
          this.produitModifie = JSON.parse(JSON.stringify(value));
        }
      )
    }
    console.log(this.ajout);
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
    this.produitBusiness.addProduit(this.produitModifie)
      .subscribe(() => {
        this.cacherAlert = false;
        this.message = "Votre produit a été correctement ajouté";
        this.disabledAjoutCategorie = false;
      },()=>{
        console.log("erreur subscribe ajouter");
      },()=>{
        this.ajout = false;
        this.observableProduit = this.produitBusiness.getProduitByRef(this.produitModifie.ref);
        this.disabledAjoutCategorie = false;
        this.observableProduit.subscribe(
          value => {
            this.produit = value;
            this.produitModifie = JSON.parse(JSON.stringify(value));
          }
        )
      });
  }

  ajouterCategorie(event: MatChipInputEvent): void {
    let input = event.input;
    let nomCat = event.value;
    if ((nomCat || '').trim()) {
      this.categorieBusiness.getCategorieByID(nomCat).subscribe(value => {
        if (value.valueOf() instanceof Categorie) {
          let categorie = value;
          this.produitBusiness.addCategorieProduit(this.produit, categorie).subscribe(value => this.produit.arrayCategorie = value.arrayCategorie);
        } else {
          this.message = value;
        }
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  supprimerCategorie(categorie: any): void {
    let index = this.produit.arrayCategorie.indexOf(categorie);
    if (index >= 0) {
      this.produit.arrayCategorie.splice(index, 1);
      console.log(categorie);
      this.produitBusiness.deleteCategorieProduit(this.produit,categorie).subscribe();
    }
  }
}
