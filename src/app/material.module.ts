import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatChipsModule, MatExpansionModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule, MatInputModule, MatRadioModule, MatTooltipModule, MatTreeModule, MatListModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const angularMaterial = [
  MatCardModule,
  MatListModule, // angular list
  MatChipsModule, // angular material chips
  MatIconModule, // utilisation des icons de angular material
  MatFormFieldModule, // utilisation des formulaires de angular material
  MatAutocompleteModule,  // Utilisation des auto complete de angular material
  MatInputModule, // Utilisation des input d'angular material
  MatRadioModule, // Utilisation des radio butto
  MatButtonModule, // Utilisation des boutons angular material
  MatTreeModule, // Angular tree
  MatGridListModule,
  MatExpansionModule, // angular material expans
  MatTooltipModule, // Tool tip angular material
  BrowserAnimationsModule, // utilisation des animations de angular material
];

@NgModule({
  imports: [
    angularMaterial
  ],
  exports: [
    angularMaterial
  ],
})

export class MaterialModule {
    constructor() {}
}
