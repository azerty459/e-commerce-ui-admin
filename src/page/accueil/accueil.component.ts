import {Component, OnInit} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, defaultColors } from 'ng2-charts';
import { Statistique } from '../../../e-commerce-ui-common/models/Statistique';
import { StatistiqueBusiness } from '../../../e-commerce-ui-common/business/statistique.service'

export interface PeriodicElement {
  name: string;
  nombreLigne: number;
}

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent implements OnInit{

  public promiseStatistique: Promise<Statistique>;
  public statistique: Statistique;
  public arrayNbProduitCategorie;

  displayedColumns: string[] = ['name', 'nombreLigne'];
  dataSource = null;

  barChartOptions: ChartOptions = {responsive: true};
  barChartLabels: Label[] = null;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [ {data: [8,24,16,32], label: 'Quantité par Catégorie', backgroundColor: 'rgba(0,23,232,0.18)', hoverBackgroundColor: 'rgba(0,23,232,0.6)', borderWidth: 1,borderColor: 'rgba(15,15,15,1)', hoverBorderColor: 'rgba(15,15,15,1)'}];

  constructor(private statistiqueBusiness: StatistiqueBusiness){

  }

  ngOnInit(){
    this.affichage();
  }

  async affichage(){
    this.promiseStatistique = this.statistiqueBusiness.getStatistique();
    await this.promiseStatistique.then(
      (value) => {
        this.statistique = value;

        let dataTab = [] 
        dataTab.push({name: 'Utilisateurs', nombreLigne: this.statistique.nbUtilisateur})
        dataTab.push({name: 'Produits', nombreLigne: this.statistique.nbProduit})
        dataTab.push({name: 'Catégories', nombreLigne: this.statistique.nbCategorie})
        this.dataSource = dataTab;

        let dataLabels = []
        for(const nb of this.statistique.nbProduitCategorie){
          dataLabels.push(nb.categorie);
        }
        this.barChartLabels = dataLabels;
      });
  }
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */