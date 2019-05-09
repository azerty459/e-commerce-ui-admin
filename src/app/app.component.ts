import {filter, map, mergeMap} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import {AuthDataService} from '../business/auth-data.service';
import {Token} from '../../e-commerce-ui-common/models/Token';
import {AuthInterceptor} from '../../e-commerce-ui-common/utilitaires/AuthInterceptor';
import {Modal} from 'ngx-modialog/plugins/bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public token: Token = this.authData.token;

  constructor(
    private modal: Modal,
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

  public goHome() {

    this.router.navigate(['/admin']);
  }

  public logout() {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Deconnexion')
      .body('Etes vous certain de vouloir vous deconnecter?')
      .okBtn('Se deconnecter')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Rester connecter')
      .open();
    dialogRef.result.then(async () => {
      this.authData.logout();
    }).catch(() => null); // Pour éviter l'erreur de promise dans console.log)
  }

}
