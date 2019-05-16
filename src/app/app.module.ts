import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ModalModule} from 'ngx-modialog';
import {BootstrapModalModule} from 'ngx-modialog/plugins/bootstrap';
import {CovalentFileModule} from '@covalent/core/file';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap';
import {BsModalService, ModalBackdropComponent, ModalContainerComponent} from 'ngx-bootstrap/modal';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import {ProduitBusiness} from '../../e-commerce-ui-common/business/produit.service';
import {CategorieBusinessService} from '../../e-commerce-ui-common/business/categorie.service';
import {ArbreService} from '../../e-commerce-ui-common/business/arbre.service';
import {FormEditGuard} from '../../e-commerce-ui-common/business/guard/form-edit.guard';
import {FormEditService} from '../../e-commerce-ui-common/business/form-edit.service';
import {AppComponent} from './app.component';
import {AccueilComponent} from '../page/accueil/accueil.component';
import {ProduitComponent} from '../page/produit/produit.component';
import {ErreurComponent} from '../page/erreur/erreur.component';
import {DetailProduitComponent} from '../page/detail-produit/detail-produit.component';
import {ArbreCategorieComponent} from '../page/ArbreCategorie/arbreCategorie.component';
import {UploadImgComponent} from '../utilitaires/upload-img/upload-img.component';
import {MaterialModule} from './material.module';
import {RoutingModule} from './routing.module';
import {NgDragDropModule} from 'ng-drag-drop';
import {UtilisateurComponent} from '../page/utilisateur/utilisateur.component';
import {PaginationService} from '../../e-commerce-ui-common/business/pagination.service';
import {UtilisateurService} from '../../e-commerce-ui-common/business/utilisateur.service';
import {DetailUtilisateurComponent} from '../page/detail-utilisateur/detail-utilisateur.component';
import {RoleService} from '../../e-commerce-ui-common/business/role.service';
import {AlerteSnackBarComponent} from '../utilitaires/alerteSnackBar/alerteSnackBar.component';
import {LoginComponent} from '../page/login/login.component';
import {AuthDataService} from '../business/auth-data.service';
import {AuthInterceptor} from '../utilitaires/AuthInterceptor';
import {FiltreService} from '../../e-commerce-ui-common/business/filtre.service';
import {ProduiDataService} from '../../e-commerce-ui-common/business/data/produit-data.service';
import {ChartsModule} from 'ng2-charts';
import {MatTableModule} from '@angular/material/table';
import {StatistiqueBusiness} from '../../e-commerce-ui-common/business/statistique.service';
import {CompteUtilisateurComponent} from '../page/compte-utilisateur/compte-utilisateur.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    ProduitComponent,
    DetailProduitComponent,
    UploadImgComponent,
    ErreurComponent,
    ArbreCategorieComponent,
    UtilisateurComponent,
    DetailUtilisateurComponent,
    AlerteSnackBarComponent,
    ModalBackdropComponent,
    ModalContainerComponent,
    CompteUtilisateurComponent
  ],
  imports: [
    // AlertModule.forRoot(),
    RoutingModule, // Utilisation de routing
    MaterialModule, // Utilisation d'angular Material
    BrowserModule,
    CovalentFileModule, // Teradata covalent library
    FormsModule,
    NgDragDropModule.forRoot(), // Drag & drop module
    ReactiveFormsModule,
    ModalModule.forRoot(), // Modal boostrap
    BootstrapModalModule, // Modal boostrap
    HttpClientModule, // Utilisation du module http
    CollapseModule.forRoot(), // Pour ngx bootstrap
    BsDropdownModule.forRoot(), // Pour ngx bootstrap
    MatTableModule,
    ChartsModule
  ],
  providers: [
    StatistiqueBusiness,
    ProduitBusiness,
    ProduiDataService,
    CategorieBusinessService,
    UploadImgComponent,
    PreviousRouteBusiness,
    ArbreService,
    FormEditService,
    FormEditGuard,
    PaginationService,
    UtilisateurService,
    RoleService,
    AuthDataService,
    FiltreService,
    AuthInterceptor,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    BsModalService
  ],
  entryComponents: [AlerteSnackBarComponent, ModalBackdropComponent, ModalContainerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
