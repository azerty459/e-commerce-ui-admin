import {Component, Input, OnInit} from '@angular/core';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {Photo} from "../../../e-commerce-ui-common/models/Photo";
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
  @Input() photoEnAttente;
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
    this.addPhoto(file);
    this.imgSelected = false;
    this.fileUploadMsg = file.name;
    console.log(file);
    const photo = new Photo(0, '././assets/img/1024px-Emblem-question.svg.png', file.name);
    photo.file = file;
    // On ajoute la photo dans la l'arrayPhoto du produit
    if (this.produit.arrayPhoto.length !== 0) {
      this.produit.arrayPhoto.push(photo)
    } else {
      this.produit.arrayPhoto = [photo]
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

  /**
   * Methode permetant d'ajouter une photo dans la liste des photo en attente du component parent
   * @param {File} file
   */
  public addPhoto(file: File): void {
    this.photoEnAttente.push(file);
  }

}
