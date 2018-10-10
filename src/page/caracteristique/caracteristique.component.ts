import {Component, OnInit} from '@angular/core';
import {CaracteristiqueDataService} from '../../../e-commerce-ui-common/business/data/caracteristique-data.service';
import {Caracteristique} from '../../../e-commerce-ui-common/models/Caracteristique';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-caracteristique',
  templateUrl: './caracteristique.component.html',
  styleUrls: ['./caracteristique.component.css']
})
export class CaracteristiqueComponent implements OnInit {


  constructor(
    private caracteristiqueDataService: CaracteristiqueDataService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Liste des caractéristiques
   */
  public caracteristiques: Caracteristique[] = [];

  /**
   * FormControl lié à l'input qui permet d'ajouter une nouvelle caractéristique
   */
  public inputNewCaracteristiqueFormControl: FormControl = new FormControl();

  /**
   * Map des catégories : clé => caractéristique, valeur => booléen (correspondant à l'activation ou non des boutons)
   */
  public caracteristiquesActivatedButtons: Map<Caracteristique, boolean> = new Map<Caracteristique, boolean>();

  ngOnInit() {
    this.reload();
  }

  public reload() {
    /*
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
    this.caracteristiquesActivatedButtons.set(c1, false);
    this.caracteristiquesActivatedButtons.set(c2, false);
    this.caracteristiquesActivatedButtons.set(c3, false);
    */


    this.caracteristiqueDataService.getAll()
      .map(carac => {
        console.log('hey');
        console.log(carac);
        this.caracteristiques.push(carac);
        this.caracteristiquesActivatedButtons.set(carac, true);
      })
      .subscribe();

  }

  /**
   * Crée une caractéristique avec le label égal à la valeur de l'input. Cette valeur ne doit pas être nulle et la valeur ne dois pas déjà exister.
   */

  public createCaracteristique(): void {
    const newCaracteristiqueLabel = this.inputNewCaracteristiqueFormControl.value.trim();
    if (newCaracteristiqueLabel === '') {
      return;
    }

    const newCaracteristique: Caracteristique = new Caracteristique();
    newCaracteristique.label = newCaracteristiqueLabel;
    if (this.isNewCaracsteristique(newCaracteristique)) {
      this.caracteristiqueDataService.addCaracteristique(newCaracteristique)
        .subscribe(
          onSuccess => {
            console.log(onSuccess);
            this.reload();
          },
            onError => {
            console.log(onError);
            this.openSnackBar('Une erreur serveur s\'est produite.');
          }
        );
    } else {
      this.openSnackBar('Caractéristique déjà existante !');
    }
  }

  /**
   * Vérifie si la caractéristique existe deja. Renvoie true si c'est le cas, false sinon.
   */

  private isNewCaracsteristique(newCaracteristique: Caracteristique) {
    const caracLabels: string[] = []
    this.caracteristiques.forEach(
      k => caracLabels.push(k.label)
    );
    return !caracLabels.includes(newCaracteristique.label.toLowerCase());
  }

  /**
   * Supprime une caractéristique existante.
   * @param carac
   */

  public removeCaracteristique(carac: Caracteristique) {
    this.caracteristiqueDataService.deleteCaracteristique(carac)
      .subscribe(
        onSuccess => {
          console.log(onSuccess);
          this.reload();
        },
        onError => {
          console.log(onError);
          this.openSnackBar('Une erreur serveur s\'est produite.');
        }
      );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2500
    });
  }

  public activateButtons(carac: Caracteristique) {
    this.caracteristiquesActivatedButtons.set(carac, true);
  }

  public unactivateButtons(carac: Caracteristique) {
    this.caracteristiquesActivatedButtons.set(carac, false);
  }

}
