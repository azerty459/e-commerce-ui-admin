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
//Modal bootstrap
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ModalModule.forRoot(),// Modal boostrap
    BootstrapModalModule,// Modal boostrap
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
