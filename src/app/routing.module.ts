import {RouterModule, Routes} from "@angular/router";
import {AccueilComponent} from "./accueil/accueil.component";
import {DetailProduitComponent} from "./detail-produit/detail-produit.component";
import {ProduitComponent} from "./produit/page.produit.component";
import {FormEditGuard} from "../../e-commerce-ui-common/business/guard/form-edit.guard";
import {DetailCategorieComponent} from "./detail-categorie/detail-categorie.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ArbreCategorieComponent} from "./ArbreCategorie/arbreCategorie.component";
import {ErreurComponent} from "./erreur/erreur.component";
import {NgModule} from "@angular/core";

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
