import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {CategorieNode} from "../../../e-commerce-ui-common/models/CategorieNode";
import {CategorieFlatNode} from "../../../e-commerce-ui-common/models/CategorieFlatNode";
import {ArbreService} from "../../../e-commerce-ui-common/business/arbre.service";

/**
 * @title Arbre avec FlatNode
 */
@Component({
  selector: 'tree-flat-overview-example',
  templateUrl: 'arbreCategorie.component.html',
  styleUrls: ['arbreCategorie.component.css'],
  providers: [ArbreService]
})

export class ArbreCategorieComponent implements OnInit {
  ngOnInit(): void {
  }

  treeControl: FlatTreeControl<CategorieFlatNode>;
  treeFlattener: MatTreeFlattener<CategorieNode, CategorieFlatNode>;
  dataSource: MatTreeFlatDataSource<CategorieNode, CategorieFlatNode>;

  constructor(arbreService: ArbreService) {
    this.treeFlattener = new MatTreeFlattener(arbreService.transformerNodeToFlatNode, arbreService.getLevel,
      arbreService.isExpandable, arbreService.getChildren);
    this.treeControl = new FlatTreeControl<CategorieFlatNode>(arbreService.getLevel, arbreService.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    arbreService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  /**
   * Méthode testant si la flat node possède un enfant.
   * @param {number} _
   * @param {CategorieFlatNode} nodeData
   * @return {boolean} true si extensibe false sinon
   */
  hasChild = (_: number, nodeData: CategorieFlatNode) => {
    return nodeData.expandable;
  };





}

