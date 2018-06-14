import {Component, Input, OnInit} from '@angular/core';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {throwError as observableThrowError} from 'rxjs/index';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.css']
})

export class UploadImgComponent implements OnInit {
  private fileSelectMsg = 'No file selected yet.';
  private fileUploadMsg = 'No file uploaded yet.';
  imgSelected = false;
  constructor(
    private produitBusiness: ProduitBusiness

  ) { }
  @Input() produit: Produit;
  ngOnInit() {
  }

  /**
   * Permet une configuration préupload
   * @param {File} file
   */
  selectEvent(file: File): void {
    this.fileSelectMsg = file.name;
    this.imgSelected = true;
  }



  /**
   * Permet de realiser l'upload du fichier
   * @param {File} file
   */
  async uploadEvent(file: File) {
    this.imgSelected = false;
    this.fileUploadMsg = file.name;
    const dataAEnvoyer = new FormData();
    dataAEnvoyer.append('fichier', file);
    dataAEnvoyer.append('ref', this.produit.ref);
    const resultatUpload = await this.produitBusiness.ajoutPhoto(dataAEnvoyer);
    if (resultatUpload) {
      const produit: Produit = await this.produitBusiness.getProduitByRef(this.produit.ref);
      this.produit.arrayPhoto = produit.arrayPhoto;
    }
  }

  /**
   * Permet d'annuler la selection d'un fichier
   */
  cancelEvent(): void {
    this.fileSelectMsg = 'No file selected yet.';
    this.fileUploadMsg = 'No file uploaded yet.';
    this.imgSelected = false;
  }


}
