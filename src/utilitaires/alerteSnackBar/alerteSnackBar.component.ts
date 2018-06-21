import {Component, ViewChild} from '@angular/core';
import {ArbreService} from "../../../e-commerce-ui-common/business/arbre.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {Modal} from "ngx-modialog/plugins/bootstrap";
import {CategorieFlatNode} from "../../../e-commerce-ui-common/models/CategorieFlatNode";
import {MatSnackBar} from "@angular/material";
import {ArbreCategorieComponent} from "../../page/ArbreCategorie/arbreCategorie.component";



@Component({
  selector: 'app-alerte-snack-bar',
  templateUrl: './alerteSnackBar.component.html',
  styleUrls: ['./alerteSnackBar.component.css']
})

export class AlerteSnackBarComponent {
  constructor() {

  }
  public snackBarRefAlerteComponent: any;
  public restore() {
    this.snackBarRefAlerteComponent.dismiss();
  }
  public exit() {
    this.snackBarRefAlerteComponent.dismiss();
  }
}
