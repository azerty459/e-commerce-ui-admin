import {Component, OnInit} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, defaultColors } from 'ng2-charts';
import { Statistique } from '../../../e-commerce-ui-common/models/Statistique';
import { StatistiqueBusiness } from '../../../e-commerce-ui-common/business/statistique.service'

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent implements OnInit{

  public promiseStatistique: Promise<Statistique>;
  public statistique: Statistique;

  displayedColumns: string[] = ['name', 'nombreLigne'];
  dataArray = null;

  barChartOptions: ChartOptions = {responsive: true};
  barChartLabels: Label[] = null;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [ {data: [], label: 'Quantité par Catégorie', backgroundColor: 'rgba(0,23,232,0.18)', hoverBackgroundColor: 'rgba(0,23,232,0.6)', borderWidth: 1,borderColor: 'rgba(15,15,15,1)', hoverBorderColor: 'rgba(15,15,15,1)'}];

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
        let data = [] 
        data.push({name: 'Utilisateurs', nombreLigne: this.statistique.nbUtilisateur})
        data.push({name: 'Produits', nombreLigne: this.statistique.nbProduit})
        data.push({name: 'Catégories', nombreLigne: this.statistique.nbCategorie})
        this.dataArray = data;

        let dataLabels = []
        let dataNumberProduit = []
        for(const nb of this.statistique.nbProduitCategorie){
          dataLabels.push(nb.categorie);
          dataNumberProduit.push(nb.nb);
        }
        this.barChartLabels = dataLabels;
        this.barChartData[0].data = dataNumberProduit;
      });
  }
}