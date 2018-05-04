import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProduitComponent } from './produit/page.produit.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpModule} from '@angular/http';

import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AlertModule, CollapseModule} from 'ngx-bootstrap';
import {ProduitBusiness} from '../../e-commerce-ui-common/business/produit.business';
import { DetailProduitComponent } from './detail-produit/detail-produit.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategorieBusinessService } from '../../e-commerce-ui-common/business/categorie-business.service';
import {HttpClientModule} from '@angular/common/http';
import { DetailCategorieComponent } from './detail-categorie/detail-categorie.component';

const appRoutes: Routes = [

  {
    path: 'admin/produit',
    redirectTo: 'admin/produit/1',
  },
  {
    path: 'admin/produit/:page',
    component: ProduitComponent,
    data: { title: 'Admin - Produits' }
  },
  {
    path: 'admin',
    component: AccueilComponent,
    data: { title: 'Admin - Accueil' }
  },
  { path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    component: DetailProduitComponent,
    data: { title: 'Détail produit' }
  },
  {
    path: 'admin/categories',
    component: CategoriesComponent,
    data: { title: 'Gestion des catégories' }
  },
  {
    path: 'admin/categories/detailcategorie/modif/:id',
    component: DetailCategorieComponent,
    data: { title: 'Détail de catégorie'}
  },
  {
    path: 'admin/categories/detailcategorie/nouveauparent', // Ajout d'une catégorie parent
    component: DetailCategorieComponent,
    data: { title: 'Ajout de catégorie parent' }
  },
  {
    path: 'admin/categories/detailcategorie/nouvelenfant/:id', // Ajout d'une catégorie enfant
    component: DetailCategorieComponent,
    data: { title: 'Ajout de catégorie enfant'}
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, // Utilisation du module http
    HttpClientModule,
    CollapseModule.forRoot(), // Pour ngx bootstrap
    BsDropdownModule.forRoot(), // Pour ngx bootstrap
    RouterModule.forRoot( // Pour le module routing
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  providers: [ProduitBusiness, CategorieBusinessService],
  bootstrap: [AppComponent]
})
export class AppModule { }
