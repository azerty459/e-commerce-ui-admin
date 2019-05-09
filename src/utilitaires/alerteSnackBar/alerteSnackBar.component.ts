import {Component, Input} from '@angular/core';
import {ArbreService} from '../../../e-commerce-ui-common/business/arbre.service';
import {CategoriedataService} from '../../../e-commerce-ui-common/business/data/categoriedata.service';


@Component({
  selector: 'app-alerte-snack-bar',
  templateUrl: './alerteSnackBar.component.html',
  styleUrls: ['./alerteSnackBar.component.css']
})

export class AlerteSnackBarComponent {
  @Input() idCategorieParent: number;
  public snackBarRefAlerteComponent: any;

  constructor(public categoriedataBusiness: CategoriedataService, public arbreService: ArbreService) {

  }

  public restore() {
    this.arbreService.restoreLastDeletedNode();
    this.exit();
  }

  public exit() {
    this.snackBarRefAlerteComponent.dismiss();
  }
}
