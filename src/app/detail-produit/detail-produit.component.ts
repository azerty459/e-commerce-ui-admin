import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {Observable} from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {CategorieBusinessService} from "../../../e-commerce-ui-common/business/categorie.service";
import {UploadImgComponent} from "../utilitaires/upload-img/upload-img.component";
import {PreviousRouteBusiness} from "../../../e-commerce-ui-common/business/previous-route.service";

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
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProduit();
  }

  async getProduit() {
    const url = this.route.snapshot.routeConfig.path;

    if (url === 'admin/produit/ajouter') {
      this.ajout = true;
      this.produitModifie = new Produit(null,null,null,null, []);
      this.produit = new Produit(null,null,null,null, []);
      this.disabledAjoutCategorie = true;
    } else {
      this.ajout = false;
      this.disabledAjoutCategorie = false;
      const refProduit = this.route.snapshot.paramMap.get('id');
      let retourAPI = await this.produitBusiness.getProduitByRef(refProduit);
      if (retourAPI.valueOf() instanceof Produit) {
        this.produit = retourAPI;
        this.produitModifie = JSON.parse(JSON.stringify(retourAPI));
      } else {
        this.router.navigate(['page-404'], {skipLocationChange: true});
      }
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
      .then(async() => {
        let supprimer = await this.produitBusiness.deleteProduit(this.produit);
        if(supprimer){
          this.message = "Le produit a été supprimé.";
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  modifier() {
    let produit = this.produitBusiness.updateProduit(this.produitModifie);
    if (produit != null && produit != undefined) {
      this.cacherAlert = false;
      this.message = "Le produit a été mis à jour";
      this.produit = JSON.parse(JSON.stringify(this.produitModifie));
    } else {
      this.cacherAlert = false;
      this.message = "Votre produit ne peut être modifié, vous devez renseigner la référence, le nom et le prix HT.";
    }
  }

  async ajouter() {
    let retourAPI = await this.produitBusiness.addProduit(this.produitModifie);
    if (retourAPI.valueOf() instanceof Produit) {
      this.cacherAlert = false;
      this.message = "Votre produit a été correctement ajouté";
      this.disabledAjoutCategorie = false;
      this.ajout = false;
      this.produit = retourAPI;
      console.log(this.produit.arrayCategorie);
      if(this.produit != null && this.produit != undefined){
        this.produitModifie = JSON.parse(JSON.stringify(retourAPI));
      }
      this.disabledAjoutCategorie = false;
    } else {
      this.cacherAlert = false;
      this.message = "Votre produit ne peut être ajouté, vous devez renseigner la référence, le nom et le prix HT.";
    }
  }

  async ajouterCategorie(event: MatChipInputEvent) {
    let input = event.input;
    let nomCat = event.value;
    if ((nomCat || '').trim()) {
      let retourAPI = await this.categorieBusiness.getCategorieByID(nomCat);
      if (retourAPI != null && retourAPI != undefined) {
        if (retourAPI.valueOf() instanceof Categorie) {
          let produit = await this.produitBusiness.addCategorieProduit(this.produit, retourAPI);
          if(produit != null && produit != undefined){
            this.produit = produit;
          }
        } else {
          this.message = retourAPI;
        }
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  }

  async supprimerCategorie(categorie: Categorie) {
    this.produit = await this.produitBusiness.deleteCategorieProduit(this.produit,categorie);
  }
}
