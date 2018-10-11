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

  /**
   * A la naissance du composant :
   * - reload les données
   */
  ngOnInit() {
    this.reload();
  }

  /**
   * Fonction de reload qui permet de clear la data + refaire les appels REST
   */
  public reload() {
    this.caracteristiques = [];
    this.caracteristiquesActivatedButtons.clear();
    this.caracteristiqueDataService.getAll()
      .map(carac => {
        this.caracteristiques.push(carac);
        this.caracteristiquesActivatedButtons.set(carac, false);
      })
      .subscribe();
  }

  /**
   * Crée une caractéristique avec le label égal à la valeur de l'input = le label.
   * Ce label ne doit pas être nul et il ne doit pas déjà exister.
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
            this.reload();
          },
            onError => {
              this.openSnackBar('Une erreur serveur s\'est produite.');
              this.reload();
          });
    } else {
      this.openSnackBar('Caractéristique déjà existante !');
    }
  }

  /**
   * Vérifie si la caractéristique existe deja (non sensible à la casse et aux espaces). Renvoie true si c'est le cas, false sinon.
   */

  private isNewCaracsteristique(newCaracteristique: Caracteristique) {
    const caracLabels: string[] = []
    this.caracteristiques.forEach(
      k => caracLabels.push(k.label.trim().toLowerCase())
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

  /**
   * Affiche un snackbar Angular Material 2
   * @param message Message à afficher dans le snackbar
   */
  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2500
    });
  }

  /**
   * Active les bouttons associés à la caractéristique en paramètre.
   * Méthode appelée lors d'un mouseover sur la caractéristique
   * @param carac la caractéristique associée au bouttons à afficher
   */
  public activateButtons(carac: Caracteristique) {
    this.caracteristiquesActivatedButtons.set(carac, true);
  }

  /**
   * Désactive les bouttons associés à la caractéristique en paramètre.
   * Méthode appelée lors d'un mouseout sur la caractéristique
   * @param carac la caractéristique associée au bouttons à cacher
   */
  public unactivateButtons(carac: Caracteristique) {
    this.caracteristiquesActivatedButtons.set(carac, false);
  }

}
