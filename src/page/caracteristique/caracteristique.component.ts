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
  ) {
  }

  /**
   * Liste des caractéristiques
   */
  public caracteristiques: Caracteristique[] = [];

  /**
   * Liste des caractéristiques modifiées
   */
  public caracteristiquesModifiees: Caracteristique[] = [];

  /**
   * FormControl lié à l'input qui permet d'ajouter une nouvelle caractéristique
   */
  public inputNewCaracteristiqueFormControl: FormControl = new FormControl();

  ngOnInit() {
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
    this.caracteristiquesModifiees = this.caracteristiques.slice();

    // TODO décommenter la partie du bas + supprimer la partie du haut lorsque le service caracteristiqueDataService sera implémenté correctement
    /*
    this.caracteristiqueDataService.getAllCaracteristiques()
      .map(carac => this.caracteristiques.push(carac))
      .subscribe();
    */
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
    // TODO à changer, comment générer l'id ?
    newCaracteristique.id = this.caracteristiquesModifiees[this.caracteristiquesModifiees.length - 1].id;
    newCaracteristique.label = newCaracteristiqueLabel;
    if (this.isNewCaracsteristique(newCaracteristique)) {
      this.caracteristiquesModifiees.push(newCaracteristique);

      // TODO supprimer cela et envoyer la reqûete au backend uniquement quand on clique sur sauvegarder
      this.caracteristiqueDataService.addCaracteristique(newCaracteristique)
        .subscribe(
          onSuccess => console.log('ca marche !'),
          onError => console.log('ca marche pas :(')
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
    this.caracteristiquesModifiees.forEach(
      k => caracLabels.push(k.label)
    );
    return !caracLabels.includes(newCaracteristique.label);
  }

  public removeCaracteristique(carac: Caracteristique) {
    this.caracteristiquesModifiees = this.caracteristiquesModifiees.filter(item => item !== carac);
  }

  public updateCaracteristiques() {
    // TODO décommenter lorsque le service sera implémenté
    /*
    this.caracteristiqueDataService.updateCaracteristiques(this.caracteristiquesModified)
      .subscribe(
        onSuccess => this.caracteristiques = this.caracteristiquesModifiees.slice(),
        onError => console.log(onError.message)
     );
     */
  }

  public resetCaracteristiques() {
    this.caracteristiquesModifiees = this.caracteristiques.slice();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2500
    });
  }

}
