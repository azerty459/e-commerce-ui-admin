import {Component} from '@angular/core';

export interface PeriodicElement {
  name: string;
  nombreLigne: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen', nombreLigne: 4},
  {name: 'Helium', nombreLigne: 5},
  {name: 'Lithium', nombreLigne: 8}
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  displayedColumns: string[] = ['name', 'nombreLigne'];
  dataSource = ELEMENT_DATA;
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */