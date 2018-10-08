import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {CategorieBusinessService} from '../../../e-commerce-ui-common/business/categorie.service';
import {UploadImgComponent} from '../../utilitaires/upload-img/upload-img.component';
import {PreviousRouteBusiness} from '../../../e-commerce-ui-common/business/previous-route.service';
import {map, startWith} from 'rxjs/operators';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {FormEditService} from '../../../e-commerce-ui-common/business/form-edit.service';
import {Photo} from '../../../e-commerce-ui-common/models/Photo';
import {environment} from '../../environments/environment';
import {Caracteristique} from '../../../e-commerce-ui-common/models/Caracteristique';
import {CaracteristiqueDataService} from '../../../e-commerce-ui-common/business/data/caracteristique-data.service';

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.scss']
})
export class DetailProduitComponent implements OnInit {
  @ViewChild('photo') public photo;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public environment = environment;
  public positionBeforeTooltip = 'before';
  public positionAfterTooltip = 'after';
  // Enter, comma
  public separatorKeysCodes = [ENTER, COMMA];
  public message: string;
  public ajout: boolean;
  public produit: Produit;
  public produitModifie: Produit;
  public disabledSecondaryPanels: boolean;

  /**
   * Boolean permettant de savoir si le bouton d'annulation dans la toolbar doit être cacher ou non
   * @type {boolean}
   */
  public cacherBoutonAnnulation = true;

  /**
   * Observable d'un tableau d'objets de categories
   */
  public categoriesObservable: Observable<Categorie[]>;

  /**
   * Tableau contenant toutes les catégories
   */
  public categories: Categorie[];

  /**
   * Objet caractéristique selectionné dans le select du field Caractéristiques
   */
  public caracSelected: Caracteristique;

  /**
   * Tableau contenant toutes les caracteristiques
   */
  public caracteristiques: Caracteristique[];

  /**
   * FormControl permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixCategorieFormControl: FormControl = new FormControl();

  /**
   * FormControl du select du field caractéristiques
   */
  public choixCaracteristiqueFormControl: FormControl = new FormControl();

  /**
   * FormControl du select du field caractéristiques
   */
  public inputCaracteristiqueFormControl: FormControl = new FormControl()

  public addCaracIsValid: boolean = true;

  /**
   * Boolean permettant de cacher l'alerte de succès
   * @type {boolean}
   */
  cacherAlert = true;

  /**
   * Boolean permettant de cacher l'alerte d'erreur
   * @type {boolean}
   */
  cacherErreur = true;

  /**
   * indique que la toolbar est en position fixed
   * @type {boolean}
   */
  toolNotFixed = true;

  ancienPrixHTModifier: number;

  public photoEnAttenteAjout = [];
  public photoEnAttenteSupression = [];
  @ViewChild('categorieInput') categorieInput: ElementRef;
  @ViewChild('spacer', {read: ElementRef}) spacer: ElementRef;

  constructor(private uploadImg: UploadImgComponent,
              private modal: Modal,
              private formEditService: FormEditService,
              private previousRouteBusiness: PreviousRouteBusiness,
              private route: ActivatedRoute,
              private produitBusiness: ProduitBusiness,
              private categorieBusiness: CategorieBusinessService,
              private caracteristiqueDataService: CaracteristiqueDataService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  scroll = (): void => {
    if (this.getCurrentOffsetTop(this.spacer) !== 0 && this.toolNotFixed) {
      this.toolNotFixed = false;
    } else if (this.getCurrentOffsetTop(this.spacer) === 0 && !this.toolNotFixed) {
      this.toolNotFixed = true;
    }
  };

  getCurrentOffsetTop(element) {
    const rect = element.nativeElement.getBoundingClientRect();
    return rect.top + window.pageYOffset - document.documentElement.clientTop;
  }

  ngOnInit() {
    this.formEditService.clear();
    this.getProduit();
    window.addEventListener('scroll', this.scroll, true); // third parameter
  }

  async getProduit() {
    this.categories = await this.categorieBusiness.getAllCategories();

    // TODO tableau des caracteristiques à vider avant le subscribe, juste pour le test
    const c1 = new Caracteristique();
    const c2 = new Caracteristique();
    const c3 = new Caracteristique();
    c1.id = 1;
    c1.label = 'Editeur';
    c2.id = 2;
    c2.label = 'Langue';
    c3.id = 3;
    c3.label = 'Dimensions du produit';
    this.caracteristiques = [c1, c2, c3];
    this.choixCaracteristiqueFormControl.setValue(c1);
    // TODO fin du mock

    /*this.caracteristiqueDataService.getAllCaracteristiques().subscribe(
      carac => this.caracteristiques.push(carac),
      error => console.log(error.message)
    );*/

    this.caracteristiques = [c1, c2, c3];


    if (this.categories !== undefined) {
      // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
      this.categoriesObservable = this.choixCategorieFormControl.valueChanges.pipe(
        startWith(''),
        map(val => this.categories.filter(categorie => categorie.nomCat.toLowerCase().indexOf(val.toLowerCase()) === 0))
      );
    }
    const url = this.route.snapshot.routeConfig.path;
    if (url === 'admin/produit/ajouter') {
      this.ajout = true;
      this.produitModifie = new Produit(null, null, null, null, []);
      this.produit = new Produit(null, null, null, null, []);
      this.disabledSecondaryPanels = true;
    } else {
      this.ajout = false;
      this.disabledSecondaryPanels = false;
      const refProduit = this.route.snapshot.paramMap.get('id');
      const retourAPI = await this.produitBusiness.getProduitByRef(refProduit);

      if (!(retourAPI.valueOf() instanceof Produit)) {
        this.router.navigate(['page-404'], {skipLocationChange: true});
      }
      this.produit = retourAPI;
      console.log(this.produit);
      // gestion dimension photo
      for (const index in this.produit.arrayPhoto) {
        const img = await this.getDataImg(this.produit.arrayPhoto[index].url + '_1080x1024');
        this.produit.arrayPhoto[index].imgHeight = img.height;
        this.produit.arrayPhoto[index].imgWidth = img.width;
      }
      this.produitModifie = Object.assign({}, this.produit);
    }
  }

  public async getDataImg(url): Promise<any> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }


  comparedProductWithProductModif() {
    // Si produit modifier est différent de produit
    if (JSON.stringify(this.produit) !== JSON.stringify(this.produitModifie)) {
      this.cacherBoutonAnnulation = false;
      // Permets d'afficher la pop-up "en cours d'édition"
      this.formEditService.setDirty(true);
    } else {
      this.cacherBoutonAnnulation = true;
      // Permets d'afficher la pop-up "en cours d'édition"
      this.formEditService.setDirty(false);
    }
  }

  async cancelModification(produit: Produit) {
    // Permet de copier la variable produit dans produitModifier
    for (const index in this.produit.arrayPhoto) {
      let img = await this.getDataImg(this.produit.arrayPhoto[index].url + '_1080x1024');
      this.produit.arrayPhoto[index].imgHeight = img.height;
      this.produit.arrayPhoto[index].imgWidth = img.width;
    }
    this.produitModifie = Object.assign({}, this.produit);
    // Permets de cacher le bouton d'annulation des modifications
    this.cacherBoutonAnnulation = true;
    //  Permets de désactiver la pop-up "en cours d'édition"
    this.formEditService.setDirty(false);
    this.photoEnAttenteAjout = [];
    this.photoEnAttenteSupression = [];
  }

  public saveModification(): void {
    this.updateProduct();
  }

  public async updateProduct() {
    if (this.photoEnAttenteSupression !== undefined) {
      for (const photo of this.photoEnAttenteSupression) {
        await this.produitBusiness.removePhoto(photo);
        if (photo.id === this.produitModifie.photoPrincipale.id) {
          (<Photo>this.produitModifie.photoPrincipale).id = 0;
          (<Photo>this.produit.photoPrincipale).id = 0;
        }
      }
      this.photoEnAttenteSupression = [];
    }
    if (this.photoEnAttenteAjout !== undefined) {
      for (const photo of this.photoEnAttenteAjout) {
        const dataAEnvoyer = new FormData();
        dataAEnvoyer.append('fichier', photo);
        dataAEnvoyer.append('ref', this.produitModifie.ref);
        const resultatUpload = await this.produitBusiness.ajoutPhoto(dataAEnvoyer);
        if (resultatUpload) {
          const produit: Produit = await this.produitBusiness.getProduitByRef(this.produit.ref);
          this.produit.arrayPhoto = produit.arrayPhoto;
          this.produitModifie.arrayPhoto = produit.arrayPhoto;
          this.photoEnAttenteAjout = [];
        }
      }
    }
    const retourAPI = await this.produitBusiness.updateProduit(this.produitModifie);
    if (retourAPI != null && retourAPI !== undefined) {
      if (retourAPI.valueOf() instanceof Produit) {
        // Mets à jour la variable produit et produit modifiée
        this.produit = retourAPI;
        for (const index in this.produit.arrayPhoto) {
          let img = await this.getDataImg(this.produit.arrayPhoto[index].url + '_1080x1024');
          this.produit.arrayPhoto[index].imgHeight = img.height;
          this.produit.arrayPhoto[index].imgWidth = img.width;
        }
        this.produitModifie = Object.assign({}, retourAPI);
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = true;
        this.cacherAlert = false;
        this.message = 'Le produit a été mis à jour.';
        this.cacherBoutonAnnulation = true;
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.formEditService.setDirty(false);
      } else {
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = false;
        this.cacherAlert = true;
        this.message = 'Votre produit n\'a pas pu être modifié, vous devez renseigner au minimum les champs de la référence,' +
          ' le nom et le prix HT.';
      }
    }


  }

  public async addProduct() {
    const retourAPI = await this.produitBusiness.addProduit(this.produitModifie);
    if (retourAPI.valueOf() instanceof Produit) {
      this.cacherErreur = true;
      this.cacherAlert = false;
      this.disabledSecondaryPanels = false;
      this.ajout = false;
      this.produit = retourAPI;
      // Permet de copier la variable produit dans produitModifier
      if (this.produit != null && this.produit !== undefined) {
        for (const index in this.produit.arrayPhoto) {
          let img = await this.getDataImg(this.produit.arrayPhoto[index].url + '_1080x1024');
          this.produit.arrayPhoto[index].imgHeight = img.height;
          this.produit.arrayPhoto[index].imgWidth = img.width;
        }
        this.produitModifie = Object.assign({}, retourAPI);
      }
      this.message = 'Votre produit a été correctement ajouté';
      this.disabledSecondaryPanels = false;
    } else {
      this.cacherErreur = false;
      this.cacherAlert = true;
      this.message = 'Votre produit n\'a pas pu être ajouté, vous devez renseigner au minimum les champs de la référence,' +
        ' le nom et le prix HT.';
    }
  }

  public deleteProduct(produit: Produit) {
    // Pop-up gérant la suppression d'un produit
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppression de ' + produit.nom + ' - ' + produit.ref)
      .body('Comfirmez vous la suppression de ' + produit.nom + ' - ' + produit.ref + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la suppression')
      .open();
    dialogRef.result
      .then(async () => {
        const supprimer = await this.produitBusiness.deleteProduit(this.produit);
        // Si le produit a été supprimé, on affiche le message
        if (supprimer) {
          this.cacherErreur = false;
          this.cacherAlert = true;
          this.message = 'Le produit a été supprimé.';
        }
      })
      // Pour éviter l'erreur de promise dans console.log
      .catch(() => null);
  }

  public deleteCategory(categorie: any): void {
    const index = this.produitModifie.arrayCategorie.indexOf(categorie);
    if (index >= 0) {
      this.produitModifie.arrayCategorie.splice(index, 1);
      this.comparedProductWithProductModif();
    }
  }

  public addCategory(event: MatAutocompleteSelectedEvent): void {
    const retourCategorie = event.option.value;
    this.categorieInput.nativeElement.value = '';
    this.choixCategorieFormControl.setValue(null);
    const categories = this.produitModifie.arrayCategorie;
    let trouver = false;
    for (const categorie of categories) {
      if (categorie.id === retourCategorie.id) {
        trouver = true;
        break;
      }
    }
    if (trouver === false) {
      this.produitModifie.arrayCategorie.push(retourCategorie);
      this.comparedProductWithProductModif();
    } else {
      this.cacherAlert = true;
      this.cacherErreur = false;
      this.message = 'Cette catégorie est déjà ajoutée.';
    }
  }

  numberToCommaSeperate(event) {
    const pattern = /^[0-9,]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  public clearInputChips(): void {
    this.categorieInput.nativeElement.value = '';
  }

  public goBack(): void {
    this.router.navigate(['/admin/produit']);
    this.comparedProductWithProductModif();
  }


  /**
   * Methode permettant d'initialisé la suppression d'une photo qui se fera lors de la sauvegarde
   * @param {Photo} photo
   */
  public removePhoto(photo: Photo): void {
    if (photo.file !== undefined) {
      this.photoEnAttenteAjout.splice(this.photoEnAttenteAjout.indexOf(photo.file), 1);
    }
    this.produitModifie.arrayPhoto.indexOf(photo);
    this.produitModifie.arrayPhoto.splice(this.produitModifie.arrayPhoto.indexOf(photo), 1);
    this.photoEnAttenteSupression.push(photo);
  }

  /**
   * Methode permettant de transformer la photo en photo principale du produit
   * @param {Photo} photo la photo qui va devenir principale
   */
  public favPhoto(photo: Photo): void {
    (<Photo>this.produitModifie.photoPrincipale).id = photo.id;
    (<Photo>this.produitModifie.photoPrincipale).url = photo.url;
    (<Photo>this.produitModifie.photoPrincipale).nom = photo.nom;
    this.comparedProductWithProductModif();
  }

  /**
   * Renvoie un tableau des clés d'une map.
   * @param map la map dont on veut extraire les clés.
   */
  public getCaracteristiquesUpdated() {
    return Array.from(this.produitModifie.mapCaracteristique.keys());
  }

  /**
   * Ajoute une caractéristique au produit modifié uniquement si la caractéristique est inexistante.
   */
  public addCaracteristiqueToProduit() {
    const caracChose: Caracteristique = this.choixCaracteristiqueFormControl.value;
    const valueCaracChose: string = this.inputCaracteristiqueFormControl.value;
    if (valueCaracChose === '' || valueCaracChose === undefined || valueCaracChose === null) {
      this.openSnackBar('Valeur incorrecte !');
    }
    else if (this.produitModifie.mapCaracteristique.get(caracChose) === undefined) {
      this.produitModifie.mapCaracteristique.set(caracChose, valueCaracChose);
      this.addCaracIsValid = true;
    } else {
      this.addCaracIsValid = false;
      this.openSnackBar('Caractéristique déjà existante pour ce produit !');
    }
  }

  /**
   * Supprime une caractéristique au produit modifié uniquement si la caractéristique est existante.
   */
  public deleteCaracteristiqueToProduit(carac: Caracteristique) {
    this.produitModifie.mapCaracteristique.delete(carac);
  }

  /**
   * Affiche le snackbar qui affiche un message d'erreur si l'ajout d'une caractéristique est impossible
   */


  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2500
    });
  }

}

