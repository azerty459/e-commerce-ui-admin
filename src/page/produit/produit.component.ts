import {Component, OnInit} from '@angular/core';
import {ProduitBusiness} from '../../../e-commerce-ui-common/business/produit.service';
import {Produit} from '../../../e-commerce-ui-common/models/Produit';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  // Pagination
  public produits: Array<Produit>;
  public nombreDeProduit;

  public pageActuelURL: number;
  public pageMax: number;
  public pageMin = 1;
  public messagesParPage = 5;

  constructor(private modal: Modal,
              private produitBusiness: ProduitBusiness,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
        // radix à 10 pour un décimal
        this.pageActuelURL = parseInt(params.page, 10);
      },
      error => {
        console.log('Erreur gestion de page ', error);
      },
    );
  }

  ngOnInit() {
    this.display();
  }

  async display() {
    const page = await this.produitBusiness.getProduitByPagination(this.pageActuelURL, this.messagesParPage);
    if (page != null && page !== undefined) {
      this.pageActuelURL = page.pageActuelle;
      this.nombreDeProduit = page.total;
      this.produits = page.tableau;
      this.pageMax = page.pageMax;
    } else {
      console.log('Erreur getProduitByPagination');
    }
    this.redirect();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.display();
  }

  async redirect() {
    if (this.pageActuelURL <= 0) {
      this.router.navigate(['/admin/produit', this.pageMin]);
    } else if (this.pageActuelURL > this.pageMax) {
      this.router.navigate(['/admin/produit', this.pageMax]);
    }
  }

  paging(value: String) {
    if (value === 'precedent') {
      if (this.pageActuelURL > this.pageMin) {
        this.pageActuelURL = this.pageActuelURL - 1;
      }
    } else {
      if (this.pageActuelURL < this.pageMax) {
        this.pageActuelURL = this.pageActuelURL + 1;
      }
    }
    this.display();
    this.router.navigate(['/admin/produit', this.pageActuelURL]);
  }

  deleteProduit(produit: Produit) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppression de ' + produit.nom + ' - ' + produit.ref)
      .body('Comfirmez vous la suppression de ' + produit.nom + ' - ' + produit.ref + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la suppression')
      .open();
    dialogRef.result
      .then(async () => {
        const supprimer = await this.produitBusiness.deleteProduit(produit);
        if (supprimer) {
          this.refreshProductList();
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }

  refreshProductList() {
    this.display();
  }

}
