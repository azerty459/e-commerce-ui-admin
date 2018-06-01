import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, HostListener, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {CategorieNode} from "../../../e-commerce-ui-common/models/CategorieNode";
import {CategorieFlatNode} from "../../../e-commerce-ui-common/models/CategorieFlatNode";
import {ArbreService} from "../../../e-commerce-ui-common/business/arbre.service";
import {Categorie} from "../../../e-commerce-ui-common/models/Categorie";
import {CategorieBusinessService} from "../../../e-commerce-ui-common/business/categorie.service";

/**
 * @title Arbre avec FlatNode
 */
@Component({
  selector: 'app-arbre-categorie',
  templateUrl: 'arbreCategorie.component.html',
  styleUrls: ['arbreCategorie.component.css'],
})



export class ArbreCategorieComponent implements OnInit {
  hiddenDiv:boolean=false;
  ngOnInit(): void {
  }

  treeControl: FlatTreeControl<CategorieFlatNode>;
  treeFlattener: MatTreeFlattener<CategorieNode, CategorieFlatNode>;
  dataSource: MatTreeFlatDataSource<CategorieNode, CategorieFlatNode>;

  constructor(private arbreService: ArbreService,categorieBusiness: CategorieBusinessService) {
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


  /**
   * Methode gérant : -l'entré d'une node en mode edit
   *                  -la sortie d'une node du mode edit
   *                  -la validation de la modification d'une node
   * @param {CategorieFlatNode} node
   * @return {Promise<void>}
   */
  async editCategorieName(node:CategorieFlatNode) {
    //Permet de savoir si on est en mode edit
    if (!node.isInEditMode) {
      // On n'est pas en mode edit on active ce dernier
      node.isInEditMode=true;
    }
    else {
      //Nouveau nom de la categorie
      let nouveauNom = node.nomCategorieModifie;
      //Permet d'effectuer le changement de nom si seulement le nouveauNom est valable et different de l'ancien
      if (nouveauNom != undefined && nouveauNom != null && nouveauNom != node.nomCategorie) {
        //On appelle la methode updateCategorie du service categorieBusiness en passant par arbreService
        let retourAPI = await this.arbreService.categorieBusiness.updateCategorie(node.id,nouveauNom);
        if(retourAPI != null && retourAPI != undefined){
          if(retourAPI.valueOf() instanceof Categorie){
            //On met à jour le nom de la categorie afficher dans la node concerné
            node.nomCategorie = retourAPI.nomCat;
          }else{
            //TODO Message erreur
          }
        }
      }
      //On sort du mode edit
      node.isInEditMode=false;

     }
  }


  /**
   * Permet de desactiver l'affichage des outils d'une node
   * @param {CategorieFlatNode} la node concerné
   */
  disableToolNode(node:CategorieFlatNode):void{
    if(!node.isInEditMode) {
      node.enableToolNode = false;
    }
  }

  /**
   * Permet d'activer l'affichage des outils d'une node
   * @param {CategorieFlatNode} la node concerné
   */
  enableToolNode(node:CategorieFlatNode):void{;
    node.enableToolNode=true;
  }



}

