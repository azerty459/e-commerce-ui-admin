import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Observable} from 'rxjs/Rx';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {CategorieBusinessService} from "../../../e-commerce-ui-common/business/categorie.service";
import {UploadImgComponent} from "../utilitaires/upload-img/upload-img.component";
import {PreviousRouteBusiness} from "../../../e-commerce-ui-common/business/previous-route.service";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {FormEditService} from "../../../e-commerce-ui-common/business/form-edit.service";

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
  urlPrecedenteAttendue = "/admin/produit";
  positionBeforeTooltip = 'before';
  positionAfterTooltip = 'after';
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  message: string;
  ajout: boolean;
  public observableProduit: Observable<Produit>;
  public produit: Produit;
  public produitModifie: Produit;
  public disabledAjoutCategorie: boolean;

  /**
   * Boolean permettant de savoir si le bouton d'annulation dans la toolbar doit être cacher ou non
   * @type {boolean}
   */
  public cacherBoutonAnnulation: boolean = true;

  /**
   * Observable d'un tableau d'objets de categories
   */
  public categoriesObservable: Observable<Categorie[]>;

  /**
   * Tableau contenant toutes les catégories
   */
  public categories: Categorie[];

  /**
   * Form contrôle permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixCategorieFormControl: FormControl = new FormControl();

  /**
   * Boolean permettant de cacher l'alerte
   * @type {boolean}
   */
  cacherAlert: boolean = true;

  /**
   * Boolean permettant de cacher l'erreur
   * @type {boolean}
   */
  cacherErreur: boolean = true;

  @ViewChild('categorieInput') fruitInput: ElementRef;

  constructor(private uploadImg: UploadImgComponent,
              private modal: Modal,
              private formEditService: FormEditService,
              private previousRouteBusiness: PreviousRouteBusiness,
              private route: ActivatedRoute,
              private produitBusiness: ProduitBusiness,
              private categorieBusiness: CategorieBusinessService,
              private router: Router) {
  }

  ngOnInit() {
    this.formEditService.clear();
    this.getProduit();
  }

  async getProduit() {
    const url = this.route.snapshot.routeConfig.path;
    if (url === 'admin/produit/ajouter') {
      this.ajout = true;
      this.produitModifie = new Produit(null, null, null, null, []);
      this.produit = new Produit(null, null, null, null, []);
      this.disabledAjoutCategorie = true;
    } else {
      this.ajout = false;
      this.disabledAjoutCategorie = false;
      const refProduit = this.route.snapshot.paramMap.get('id');
      let retourAPI = await this.produitBusiness.getProduitByRef(refProduit);

      if (!(retourAPI.valueOf() instanceof Produit)) {
        this.router.navigate(['page-404'], {skipLocationChange: true});
      }
      this.produit = retourAPI;

      let localStorageProduitModifier = localStorage.getItem("produitModifier");
      if(localStorageProduitModifier != undefined && localStorageProduitModifier != null){
        this.produitModifie = JSON.parse(localStorageProduitModifier);
        localStorage.clear();
      }else{
        this.produitModifie = JSON.parse(JSON.stringify(retourAPI));
      }
      this.categories = await this.categorieBusiness.getAllCategories();
      if (this.categories != undefined) {
        // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
        this.categoriesObservable = this.choixCategorieFormControl.valueChanges.pipe(
          startWith(''),
          map(val => this.categories.filter(categorie => categorie.nomCat.toLowerCase().indexOf(val) === 0))
        );
      }
    }
  }

  async sauvegarderModification(produit: Produit) {
    this.modifier();
  }

  compareProduitAvecProduitModif() {
    if (JSON.stringify(this.produit) != JSON.stringify(this.produitModifie)) {
      this.cacherBoutonAnnulation = false;
      this.formEditService.setDirty(true);
    }
  }

  annulerModification(produit: Produit) {
    this.produitModifie = JSON.parse(JSON.stringify(produit));
    this.cacherBoutonAnnulation = true;
    this.formEditService.setDirty(false);
  }

  supprimer(produit: Produit) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de ' + produit.nom + ' - ' + produit.ref)
      .body('Comfirmez vous la supression de ' + produit.nom + ' - ' + produit.ref + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(async () => {
        let supprimer = await this.produitBusiness.deleteProduit(this.produit);
        if (supprimer) {
          this.message = "Le produit a été supprimé.";
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  async modifier() {
    let retourAPI = await this.produitBusiness.updateProduit(this.produitModifie);
    if (retourAPI != null && retourAPI != undefined) {
      if (retourAPI.valueOf() instanceof Produit) {
        this.produit = retourAPI;
        this.produitModifie = JSON.parse(JSON.stringify(retourAPI));
        this.cacherErreur = true;
        this.cacherAlert = false;
        this.message = "Le produit a été mis à jour";
        this.cacherBoutonAnnulation = true;
        this.formEditService.setDirty(false);
      } else {
        this.cacherErreur = false;
        this.cacherAlert = true;
        this.message = "Votre produit ne peut être modifié, vous devez renseigner au minimum la référence, le nom et le prix HT.";
      }
    }
  }

  async ajouter() {
    let retourAPI = await this.produitBusiness.addProduit(this.produitModifie);
    if (retourAPI.valueOf() instanceof Produit) {
      this.cacherErreur = true;
      this.cacherAlert = false;
      this.disabledAjoutCategorie = false;
      this.ajout = false;
      this.produit = retourAPI;
      // Permet de copier la variable produit dans produitModifier
      if (this.produit != null && this.produit != undefined) {
        this.produitModifie = JSON.parse(JSON.stringify(retourAPI));
      }
      this.message = "Votre produit a été correctement ajouté";
      this.disabledAjoutCategorie = false;
    } else {
      this.cacherErreur = false;
      this.cacherAlert = true;
      this.message = "Votre produit ne peut être ajouté, vous devez renseigner au minimum la référence, le nom et le prix HT.";
    }
  }

  async ajouterCategorie(event: MatAutocompleteSelectedEvent) {
    let retourCategorie = event.option.value;
    this.fruitInput.nativeElement.value = '';
    this.choixCategorieFormControl.setValue(null);
    let categories = this.produitModifie.arrayCategorie;
    let trouver = false;
    for(let categorie of categories){
      if(categorie.nomCat == retourCategorie.nomCat){
        trouver = true;
        break;
      }
    }
    if(trouver == false){
      this.cacherErreur = true;
      this.produitModifie.arrayCategorie.push(retourCategorie);
    }else{
      this.cacherErreur = false;
      this.message = "Cette catégorie est déjà ajoutée.";
    }
    this.compareProduitAvecProduitModif();
  }

  goBack(): void {
    this.router.navigate(['/admin/produit']);
  }

  supprimerCategorie(categorie: any) {
    let index = this.produitModifie.arrayCategorie.indexOf(categorie);
    if (index >= 0) {
      this.produitModifie.arrayCategorie.splice(index, 1);
      this.compareProduitAvecProduitModif();
    }
  }
}
