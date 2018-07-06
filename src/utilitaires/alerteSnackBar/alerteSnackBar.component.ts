import {Component, Input, ViewChild} from '@angular/core';
import {ArbreService} from "../../../e-commerce-ui-common/business/arbre.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {CategorieFlatNode} from "../../../e-commerce-ui-common/models/CategorieFlatNode";
import {MatSnackBar} from "@angular/material";
import {ArbreCategorieComponent} from "../../page/ArbreCategorie/arbreCategorie.component";
import {CategoriedataService} from "../../../e-commerce-ui-common/business/data/categoriedata.service";



@Component({
  selector: 'app-alerte-snack-bar',
  templateUrl: './alerteSnackBar.component.html',
  styleUrls: ['./alerteSnackBar.component.css']
})

export class AlerteSnackBarComponent {
  constructor( public categoriedataBusiness: CategoriedataService, public arbreService: ArbreService) {

  }
  @Input() idCategorieParent: number;
  public snackBarRefAlerteComponent: any;
  public restore() {
    this.arbreService.restoreLastDeletedNode();
    this.exit();
  }
  public exit() {
    this.snackBarRefAlerteComponent.dismiss();
  }
}
