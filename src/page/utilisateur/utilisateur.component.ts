import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PaginationService} from '../../../e-commerce-ui-common/business/pagination.service';
import {UtilisateurService} from '../../../e-commerce-ui-common/business/utilisateur.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {
  public modal: BsModalRef;
  public utilisateurSelected: Utilisateur;
  public messagesParPage = 5;
  private pageActuelURL;

  constructor(
    private modalService: BsModalService,
    public paginationService: PaginationService,
    public utilisateurService: UtilisateurService,
    private activatedRoute: ActivatedRoute
  ) {
    // Récupère le params dans la page pour la pagination /page/'1'
    this.activatedRoute.params.subscribe(params => {
        // radix à 10 pour un décimal
        this.pageActuelURL = parseInt(params.page, 10);
      },
      error => {
        console.log('Erreur gestion de page ', error);
      },
    );
  }

  // Permet de rafraichir l'écran d'affichage
  async display() {
    this.paginationService.paginationUtilisateur(this.pageActuelURL, this.messagesParPage);
    this.paginationService.redirection('/admin/utilisateur');
  }

  ngOnInit() {
    this.display();
  }

  // Permets de changer le nombre d'utilisateur à afficher
  selected(value: any) {
    this.messagesParPage = value;
    this.display();
  }

  // Permets de gérer le bouton suivant et précedent dans la pagination
  paging(value: String) {
    if (value === 'precedent') {
      if (this.pageActuelURL > this.paginationService.getMinPage()) {
        this.pageActuelURL = this.pageActuelURL - 1;
      }
    } else {
      if (this.pageActuelURL < this.paginationService.getMaxPage()) {
        this.pageActuelURL = this.pageActuelURL + 1;
      }
    }
    this.paginationService.refreshURL('/admin/utilisateurs/page/' + this.pageActuelURL);
    this.display();
  }

  public confirmModal(content: TemplateRef<any>, user: Utilisateur) {
    this.utilisateurSelected = new Utilisateur(user.id, user.email, user.prenom, user.nom);
    if (this.utilisateurSelected.nom === '' && this.utilisateurSelected.nom === '') {
      this.utilisateurSelected.nom = 'Anonyme';
    }
    this.modal = this.modalService.show(content, {class: 'modal-md'});
  }

  public async deleteUser() {
    this.modal.hide();
    await this.utilisateurService.delete(this.utilisateurSelected);
    this.display();
  }
}
