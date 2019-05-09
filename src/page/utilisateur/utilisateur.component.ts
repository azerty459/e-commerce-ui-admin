import {Component, OnInit} from '@angular/core';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {ActivatedRoute} from '@angular/router';
import {PaginationService} from '../../../e-commerce-ui-common/business/pagination.service';
import {UtilisateurService} from '../../../e-commerce-ui-common/business/utilisateur.service';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  // Pagination
  public messagesParPage = 5;
  private pageActuelURL;

  constructor(private modal: Modal,
              public paginationService: PaginationService,
              public utilisateurService: UtilisateurService,
              private activatedRoute: ActivatedRoute) {
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

  // Méthode pour supprimer un utilisateur
  deleteUser(utilisateur: Utilisateur) {
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppression de ' + utilisateur.email + ' - ' + utilisateur.id)
      .body('Comfirmez vous la suppression de ' + utilisateur.email + ' - ' + utilisateur.id + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la suppression')
      .open();
    dialogRef.result
      .then(async () => {
        const supprimer = await this.utilisateurService.delete(utilisateur);
        if (supprimer) {
          this.display();
        }
      })
      .catch(() => null); // Pour éviter l'erreur de promise dans console.log
  }
}
