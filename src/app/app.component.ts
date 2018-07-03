import {mergeMap, map, filter} from 'rxjs/operators';
import {Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {PreviousRouteBusiness} from "../../e-commerce-ui-common/business/previous-route.service";
import {AuthDataService} from "../../e-commerce-ui-common/business/data/auth-data.service";
import {Token} from "../../e-commerce-ui-common/models/Token";
import {AuthInterceptor} from "../../e-commerce-ui-common/utilitaires/AuthInterceptor";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public token: Token = this.authData.token;
  constructor(
    private authInterceptor: AuthInterceptor,
    private authData: AuthDataService,
    private previousRouteBusiness: PreviousRouteBusiness,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  async ngOnInit() {
    if (this.token.token === undefined) {
      this.router.navigate(['/admin/login']);
    } else if (!(await this.authData.isLogged())) {
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
  public goHome() {
    this.router.navigate(['/admin']);
  }
  public logout() {
    this.authData.logout();
  }
}
