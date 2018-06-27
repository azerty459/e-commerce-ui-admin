import {RouterModule, Routes} from '@angular/router';
import {AccueilComponent} from '../page/accueil/accueil.component';
import {DetailProduitComponent} from '../page/detail-produit/detail-produit.component';
import {ProduitComponent} from '../page/produit/produit.component';
import {FormEditGuard} from '../../e-commerce-ui-common/business/guard/form-edit.guard';
import {DetailCategorieComponent} from '../page/detail-categorie/detail-categorie.component';
import {ArbreCategorieComponent} from '../page/ArbreCategorie/arbreCategorie.component';
import {ErreurComponent} from '../page/erreur/erreur.component';
import {NgModule} from '@angular/core';
import {UtilisateurComponent} from '../page/utilisateur/utilisateur.component';
import {DetailUtilisateurComponent} from '../page/detail-utilisateur/detail-utilisateur.component';

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
    path: 'admin/utilisateur/ajouter',
    component: DetailUtilisateurComponent,
    data: { title: 'Ajout utilisateur' }
  },
  {
    path: 'admin/utilisateurs/page/:page',
    component: UtilisateurComponent,
    data: { title: 'Gestion des utilisateurs' }
  },
  {
    path: 'admin/utilisateur',
    redirectTo: 'admin/utilisateurs/page/1'
  },
  // arbre
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
  imports: [
    RouterModule.forRoot( // Pour le module routing
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  exports: [
    RouterModule
  ],
})

export class RoutingModule {
    constructor() {}
}
