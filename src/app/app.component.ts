import {filter, map, mergeMap} from 'rxjs/operators';
import {Component, DoCheck, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import {AuthDataService} from '../business/auth-data.service';
import {Token} from '../../e-commerce-ui-common/models/Token';
import {AuthInterceptor} from '../../e-commerce-ui-common/utilitaires/AuthInterceptor';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Utilisateur} from '../../e-commerce-ui-common/models/Utilisateur';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck {
  public token: Token = this.authData.token;
  public modelRef: BsModalRef;
  public user: Utilisateur;

  constructor(
    private modalService: BsModalService,
    private authInterceptor: AuthInterceptor,
    private authData: AuthDataService,
    private previousRouteBusiness: PreviousRouteBusiness,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
  }

  async ngOnInit() {

    if (!(await this.authData.isLogged())) {
      this.authData.logout();
    }
    // Permet de changer le titre de la page autamatiquement en fonction du data title du rounting dans app.module.ts
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),)
      .subscribe((event) => this.titleService.setTitle(event['title']));
  }

  ngDoCheck() {
    this.getInfoUser();
  }

  public confirmModal(content: TemplateRef<any>) {
    this.modelRef = this.modalService.show(content, {class: 'modal-md'});
  }

  public closeConfirmModal() {
    this.modelRef.hide();
  }

  public goHome() {
    this.router.navigate(['/admin']);
  }

  public logout() {
    this.modelRef.hide();
    this.authData.logout();
  }

  public getInfoUser() {
    if (localStorage.InfoUser != undefined) {
      this.user = JSON.parse(localStorage.InfoUser);
    }
  }

}
