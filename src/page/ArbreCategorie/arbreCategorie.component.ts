import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {CategorieNode} from '../../../e-commerce-ui-common/models/CategorieNode';
import {CategorieFlatNode} from '../../../e-commerce-ui-common/models/CategorieFlatNode';
import {ArbreService} from '../../../e-commerce-ui-common/business/arbre.service';
import {Categorie} from '../../../e-commerce-ui-common/models/Categorie';
import {Modal} from 'ngx-modialog/plugins/bootstrap';


/**
 * @title Arbre avec FlatNode
 */
@Component({
  selector: 'app-arbre-categorie',
  templateUrl: 'arbreCategorie.component.html',
  styleUrls: ['arbreCategorie.component.css'],
})


export class ArbreCategorieComponent implements OnInit {
  public treeControl: FlatTreeControl<CategorieFlatNode>;
  public treeFlattener: MatTreeFlattener<CategorieNode, CategorieFlatNode>;
  public dataSource: MatTreeFlatDataSource<CategorieNode, CategorieFlatNode>;
  // EXEMPLE FILTRES
  filter = ['Catégorie vide', 'Nouvelles', 'Promo ', '+ de 100 articles', '- de 50 articles' , 'Plus de stock', 'Top vente'];
  displayFilter = false;
  // boolean afficher erreur
  nomCategorieIsEmpy = false;
  ngOnInit(): void {
  }
  constructor(private arbreService: ArbreService, private modal: Modal) {
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
  public hasChild = (_: number, nodeData: CategorieFlatNode) => {
    return nodeData.expandable;
  }




  /**
   * Methode gérant : -l'entré d'une node en mode edit
   *                  -la sortie d'une node du mode edit
   *                  -la validation de la modification d'une node
   * @param {CategorieFlatNode} node
   * @return {Promise<void>}
   */
  async editCategorieName(node: CategorieFlatNode) {
    // Permet de savoir si on est en mode edit
    if (!node.isInEditMode) {
      // On n'est pas en mode edit on active ce dernier
      node.isInEditMode = true;
    } else {
      // Nouveau nom de la categorie
      const nouveauNom = node.nomCategorieModifie;
      // Permet d'effectuer le changement de nom si seulement le nouveauNom est valable et different de l'ancien
      if (nouveauNom !== undefined && nouveauNom != null && nouveauNom !== node.nomCategorie) {
        // On appelle la methode updateCategorie du service categorieBusiness en passant par arbreService
        const retourAPI = await this.arbreService.categorieBusiness.updateCategorie(node.id, nouveauNom);
        if (retourAPI != null && retourAPI !== undefined) {
          if (retourAPI.valueOf() instanceof Categorie) {
            // On met à jour le nom de la categorie afficher dans la node concerné
            node.nomCategorie = retourAPI.nomCat;
            node.isInEditMode = false;
            this.nomCategorieIsEmpy = false;
          } else {
            this.nomCategorieIsEmpy = true;
          }
        }
      }
      // On sort du mode edit


    }
  }


  /**
   * Permet de desactiver l'affichage des outils d'une node
   * @param node la node concerné
   */
  public disableToolNode(node: CategorieFlatNode): void {
    if (!node.isInEditMode) {
      node.enableToolNode = false;
    }
  }

  /**
   * Permet d'activer l'affichage des outils d'une node
   * @param node la node concerné
   */
  public enableToolNode(node: CategorieFlatNode): void {
    node.enableToolNode = true;
  }


  /**
   * Methode permettant de supprimer une categorie a partir de sa flat node
   * @param {CategorieFlatNode} node flat node représentant la categorie a supprimer
   * @return {Promise<void>}
   */
  async deleteCategorie(node: CategorieFlatNode) {
  // Modal
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppresion de la catégorie ' + node.nomCategorie + ' - id(' + node.id + ')')
      .body('Comfirmez vous la supression de la categorie ' + node.nomCategorie + ' - id(' + node.id + ')?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la supression')
      .open();
    dialogRef.result
      .then(async() => {
        // On appelle la methode supprimerCategorie du service categorieBusiness en passant par arbreService
        const retourAPI = await this.arbreService.categorieBusiness.supprimerCategorie(
          new Categorie(node.id, node.nomCategorie, null, null)
        );
        if (retourAPI != null && retourAPI !== undefined) {
          // On met à jour le nom de la categorie afficher dans la node concerné
          if (retourAPI) {
            // On supprime la categorie visuelement si la suppression dans la base de donnée est un succès
            this.deleteNode(node);
          } else {
            console.log('pas supprimer');
          }
        } else {
          // TODO Message erreur
        }
      }).catch(() => null); // Pour éviter l'erreur de promise dans console.log

  }


  /**
   * Methode permettant de supprimer une categorie visuelement
   * @param {CategorieFlatNode} node la flat node representant la categorie a supprimer
   */
  public deleteNode(node: CategorieFlatNode) {
    // Si la flat node possède un parent on la supprimer des enfants de ce parent
    if (node.idParent !== undefined) {
      let nodeParent = null;
      const nodeEnfant = this.arbreService.flatNodeMap.get(node);
      this.arbreService.flatNodeMap.forEach(function (value) {
        if (value.id === node.idParent) {
          nodeParent = value;
        }
      });
      this.arbreService.deleteChild(nodeParent, nodeEnfant);
    } else {
      // Si la flat node ne possède pas de parent on recharge l'arbre pour la supprimer de l'affichage
      this.arbreService.initialize();
    }

  }

  /**
   * Methode permetant de tester si l'arbre est vide
   * @returns {boolean} vrai si vide sinon faux
   */
  public hasCategories() {
    return this.arbreService.hasCategories;
  }
  hasNoContent = (_: number, _nodeData: CategorieFlatNode) => _nodeData.nomCategorie === '';

  /**
   * Methode permettant d'afficher la fenétre de filtre
   */
  public enableFilter() {
    this.displayFilter = this.displayFilter === false;
  }

  /** Créer un nouveau champ pour entrer le nom de la catégorie
   *  a ajouter
   * @param {CategorieFlatNode} nodeParent le parent de la node a créer
   */
  public addNewItem(nodeParent: CategorieFlatNode) {
    // Une nodeParent null signifie qu'on se trouve au niveau 0
    if (nodeParent === null) {
      this.arbreService.insertItem(null, '');
    } else {
      const nodeParentFlat = this.arbreService.flatNodeMap.get(nodeParent);
      this.arbreService.insertItem(nodeParentFlat!, '');
      nodeParent.expandable = true;
      this.treeControl.expand(nodeParent);
    }
  }

  /** Sauvegarde la node dans la base de donée
   *  et ajoute visuellement la node à l'arbre
   * @param {CategorieFlatNode} node a sauvegardé
   * @param {string} nomCategorie  nom de la catégorie a associer
   * @returns {Promise<void>}
   */
  async saveNode(node: CategorieFlatNode, nomCategorie: string) {
    const nestedNode = this.arbreService.flatNodeMap.get(node);
    if (nomCategorie === '') {
      this.nomCategorieIsEmpy = true;
    } else {
      this.nomCategorieIsEmpy = false;
      if (node.idParent) {
        const categorie: Categorie = await this.arbreService.categorieBusiness.ajouterCategorieEnfant(nomCategorie, node.idParent);
        nestedNode.id = categorie.id;
        nestedNode.nomCategorie = categorie.nomCat;
      } else {
        const categorie: Categorie = await this.arbreService.categorieBusiness.ajouterCategorieParent(nomCategorie);
        nestedNode.id = categorie.id;
        nestedNode.nomCategorie = categorie.nomCat;
      }

      this.arbreService.updateCategorie(nestedNode!, nomCategorie);
    }
  }

  /**
   * Annule la création d'une catégorie
   * @param {CategorieFlatNode} node représentant la catégorie a désafficher
   */
  public cancelAddCategorie(node: CategorieFlatNode) {
    this.nomCategorieIsEmpy = false;
    this.deleteNode(node);
  }


}

