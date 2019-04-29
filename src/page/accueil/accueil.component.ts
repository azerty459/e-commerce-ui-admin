import {Component, OnInit} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { noUndefined } from '@angular/compiler/src/util';

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

export class AccueilComponent implements OnInit{
  displayedColumns: string[] = ['name', 'nombreLigne'];
  dataSource = ELEMENT_DATA;

  barChartOptions: ChartOptions = {responsive: true};
  barChartLabels: Label[] = ['un', 'deux', 'trois', 'quatre'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [ {data: [8,24,16,32], label: 'test', backgroundColor: 'rgba(66,83,244,0.18)', borderWidth: 1,borderColor: 'rgba(15,15,15,1)'}];

  constructor(){

  }

  ngOnInit(){

  }
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */