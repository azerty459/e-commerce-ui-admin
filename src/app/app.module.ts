import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap';

import { PreviousRouteBusiness } from '../../e-commerce-ui-common/business/previous-route.service';
import { ProduitBusiness } from '../../e-commerce-ui-common/business/produit.service';
import { CategorieBusinessService } from '../../e-commerce-ui-common/business/categorie.service';

import { AccueilComponent } from './accueil/accueil.component';
import { ProduitComponent } from './produit/page.produit.component';
import { RetourComponent } from '../../e-commerce-ui-common/utilitaires/retour/retour.component';
import { CategoriesComponent } from './categories/categories.component';
import { DetailCategorieComponent } from './detail-categorie/detail-categorie.component';
import { ErreurComponent } from './erreur/erreur.component';
import { DetailProduitComponent } from './detail-produit/detail-produit.component';

import {HttpClientModule} from '@angular/common/http';
// angular material
import {
  MatChipsModule, MatIconModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule,
  MatRadioModule, MatButtonModule, MatTreeNodePadding
} from "@angular/material";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material';
//Tool tip angular material
import {MatTooltipModule} from '@angular/material/tooltip';
//Modal bootstrap
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
// Angular material expansion
import {MatExpansionModule} from '@angular/material/expansion';
import {UploadImgComponent} from "./utilitaires/upload-img/upload-img.component";

//Teradata covalent library
import { CovalentFileModule } from '@covalent/core/file';
//Angular card
import {MatCardModule} from '@angular/material/card';
//Angular tree
import {MatTreeModule} from '@angular/material/tree';
import {ArbreCategorieComponent} from './ArbreCategorie/arbreCategorie.component';
import {ArbreService} from "../../e-commerce-ui-common/business/arbre.service";
import {FormEditGuard} from "../../e-commerce-ui-common/business/guard/form-edit.guard";
import {FormEditService} from "../../e-commerce-ui-common/business/form-edit.service";


const appRoutes: Routes = [

  {
    path: 'admin',
    component: AccueilComponent,
    data: { title: 'Admin - Accueil' }
  },
  // produit
  {
    path: 'admin/produit/ajouter',
    component: DetailProduitComponent,
    data: { title: 'Détail produit' }
  },
  {
    path: 'admin/produit/:page',
    component: ProduitComponent,
    data: { title: 'Admin - Produits' }
  },
  {
    path: 'admin/produit/detail/:id',
    component: DetailProduitComponent,
    canDeactivate: [FormEditGuard],
    data: { title: 'Détail produit' }
  },
  {
    path: 'admin/produit',
    redirectTo: 'admin/produit/1'
  },
  // categorie
  {
    path: 'admin/categorie/ajouter',
    component: DetailCategorieComponent,
    data: { title: 'Ajout catégorie' }
  },
  {
    path: 'admin/categorie/:page',
    component: CategoriesComponent,
    data: { title: 'Gestion des catégories' }
  },
  {
    path: 'admin/categorie/detail/:id',
    component: DetailCategorieComponent,
    data: { title: 'Détail catégorie'}
  },
  {
    path: 'admin/categorie',
    redirectTo: 'admin/categorie/1'
  },
  {
    path: 'admin/arbre',
    component: ArbreCategorieComponent
  },

  {
    path: 'page-404',
    component: ErreurComponent
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  {
    path: '**',
    pathMatch: 'full',
    component: ErreurComponent
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ProduitComponent,
    DetailProduitComponent,
    CategoriesComponent,
    DetailCategorieComponent,
    UploadImgComponent,
    RetourComponent,
    ErreurComponent,
    ArbreCategorieComponent,
  ],
  imports: [
    BrowserModule,
    //Teradata covalent library
    CovalentFileModule,
    MatCardModule,
    MatChipsModule, // angular material chips
    MatIconModule, // utilisation des icons de angular material
    BrowserAnimationsModule,// utilisation des animations de angular material
    MatFormFieldModule,//utilisation des formulaires de angular material
    MatAutocompleteModule, // Utilisation des auto complete de angular material
    MatInputModule, // Utilisation des input d'angular material
    MatRadioModule, // Utilisation des radio button
    FormsModule,
    MatButtonModule,// Utilisation des boutons angular material
    ReactiveFormsModule,
    MatTreeModule, // Angular tree
    ModalModule.forRoot(),// Modal boostrap
    BootstrapModalModule,// Modal boostrap
    HttpClientModule, // Utilisation du module http
    MatExpansionModule, // angular material expans
    MatTooltipModule,//Tool tip angular material
    MatGridListModule,
    CollapseModule.forRoot(), // Pour ngx bootstrap
    BsDropdownModule.forRoot(), // Pour ngx bootstrap
    RouterModule.forRoot( // Pour le module routing
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  providers: [
    ProduitBusiness,
    CategorieBusinessService,
    UploadImgComponent,
    PreviousRouteBusiness,
    ArbreService,
    FormEditService,
    FormEditGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(){}
}
