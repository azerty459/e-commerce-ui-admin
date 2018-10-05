import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {Caracteristique} from '../../../e-commerce-ui-common/models/Caracteristique';

export const uniqueCaracValidator = (produitModifie: Produit): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } => {
    if (produitModifie != null) {
      const caracProduit: Caracteristique[] = Array.from(produitModifie.mapCaracteristique.keys());
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

      console.log(caracProduit.includes(control.value));
      if (control.value !== undefined && caracProduit.includes(control.value)) {
        console.log('SALUT');
        return { 'unique': true };
      }
      return null;
    } else {
      return null;
    }

  };
}
