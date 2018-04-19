import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProduitComponent } from './produit/page.produit.component';
import {RouterModule, Routes} from "@angular/router";
import {HttpModule} from "@angular/http";
import {ProduitBusiness} from "../business/produit.business";

import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AlertModule, CollapseModule} from 'ngx-bootstrap';

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
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ProduitComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, // Utilisation du module http
    CollapseModule.forRoot(), // Pour ngx bootstrap
    BsDropdownModule.forRoot(), // Pour ngx bootstrap
    RouterModule.forRoot( // Pour le module routing
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  providers: [ProduitBusiness],
  bootstrap: [AppComponent]
})
export class AppModule { }
