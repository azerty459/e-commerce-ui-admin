
import {mergeMap, map, filter} from 'rxjs/operators';




import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {PreviousRouteBusiness} from "../../e-commerce-ui-common/business/previous-route.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private previousRouteBusiness: PreviousRouteBusiness,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
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
}
