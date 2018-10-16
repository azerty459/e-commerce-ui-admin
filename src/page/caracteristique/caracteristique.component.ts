import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaracteristiqueDataService} from '../../../e-commerce-ui-common/business/data/caracteristique-data.service';
import {Caracteristique} from '../../../e-commerce-ui-common/models/Caracteristique';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-caracteristique',
  templateUrl: './caracteristique.component.html',
  styleUrls: ['./caracteristique.component.css']
})
export class CaracteristiqueComponent implements OnInit, OnDestroy {

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
   * Map des caractéristiques pour les bouttons d'édition et de supression :
   * clé => caractéristique, valeur => booléen (correspondant à l'activation ou non des boutons)
   */
  public caracteristiquesActivatedButtons: Map<Caracteristique, boolean> = new Map<Caracteristique, boolean>();

  /**
   * Caracteristique à éditer si le mode d'édition est activé.
   * Si le mode d'édition est désactivé, cette variable vaut null
   */
  public caracteristiqueEditMode: Caracteristique = null;

  /**
   * FormControl lié à l'input qui permet de modifier une nouvelle caractéristique
   */
  public inputEditCaracteristiqueFormControl: FormControl = new FormControl();

  public subscriptions: Subscription[] = [];

  /**
   * A la naissance du composant :
   * - reload les données
   */
  ngOnInit() {
    this.reload();
  }

  /**
   * Fonction de reload qui permet de clear la data + refaire les appels graphql
   */
  public reload() {
    this.caracteristiques = [];
    this.caracteristiquesActivatedButtons.clear();
    this.caracteristiqueEditMode = null;
    this.subscriptions = [];

    // get + sort des caractéristiques
    const sub: Subscription = this.caracteristiqueDataService.getAll()
      .toArray()
      .subscribe(caracteristiques => {
        caracteristiques.sort(Caracteristique.comparatorFn);
        this.caracteristiques = caracteristiques;
      });
    this.subscriptions.push(sub);
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
      this.subscriptions.push(
      this.caracteristiqueDataService.addCaracteristique(newCaracteristique)
        .subscribe(
          onSuccess => {
            this.reload();
          },
            onError => {
              this.openSnackBar('Une erreur serveur s\'est produite.');
              this.reload();
          }));
    } else {
      this.openSnackBar('Caractéristique déjà existante !');
    }
  }

  /**
   * Vérifie si la caractéristique existe deja (non sensible à la casse et aux espaces). Renvoie true si c'est le cas, false sinon.
   */

  private isNewCaracsteristique(newCaracteristique: Caracteristique) {
    const caracLabels: string[] = [];
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
        () => {
          this.reload();
        },
        onError => {
          console.log(onError);
          this.openSnackBar('Une erreur serveur s\'est produite.');
        }
      );
  }

  /**
   * Fonction appelée lors d'un click sur un boutton edit d'une caractéristique.
   * Passe en mode édition de caractéristique :
   * - le mat-item se transforme en mat-input
   * - le bouton d'édition disparâit
   * - les boutons de validation et d'annulation apparaîssent
   */
  public switchEditMode(carac: Caracteristique) {
    this.caracteristiqueEditMode = carac;
    this.inputEditCaracteristiqueFormControl = new FormControl();
  }

  /**
   * Modifie une caractéristique existante si la valeur est différente de celle précédente.
   * Affiche un snackbar d'erreur sinon.
   * @param carac
   */
  public updateCaracteristique(carac: Caracteristique) {
    const newLabel = this.inputEditCaracteristiqueFormControl.value.trim();
    if (newLabel === carac.label) {
      this.openSnackBar('La valeur n\'a pas été modifiée');
    }
    carac.label = newLabel;
    this.caracteristiqueDataService.updateCaracteristique(carac)
      .subscribe(
        () => {
          this.reload();
        },
        onError => {
          console.log(onError);
          this.openSnackBar('Une erreur serveur s\'est produite.');
        }
      );
  }

  /**
   * Renvoie true si la caractéristique est en mode édition, false sinon.
   */
  public isInEditMode(carac: Caracteristique) {
    return (carac === this.caracteristiqueEditMode);
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

  public ngOnDestroy() {
    this.subscriptions.map(s => s.unsubscribe());
  }

}
