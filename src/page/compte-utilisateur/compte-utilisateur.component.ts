import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {PreviousRouteBusiness} from '../../../e-commerce-ui-common/business/previous-route.service';
import {FormControl} from '@angular/forms';
import {FormEditService} from '../../../e-commerce-ui-common/business/form-edit.service';
import {UtilisateurService} from '../../../e-commerce-ui-common/business/utilisateur.service';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';
import {RoleService} from '../../../e-commerce-ui-common/business/role.service';
import {Role} from '../../../e-commerce-ui-common/models/Role';

@Component({
  selector: 'app-compte-utilisateur',
  templateUrl: './compte-utilisateur.component.html',
  styleUrls: ['./compte-utilisateur.component.scss']
})
export class CompteUtilisateurComponent implements OnInit {


  public positionAfterTooltip = 'after';
  public message: String;
  public utilisateur: Utilisateur;

  /**
   * Boolean permettant de savoir si le bouton d'annulation dans la toolbar doit être cacher ou non
   * @type {boolean}
   */
  public cacherBoutonAnnulation = true;

  /**
   * Observable d'un tableau d'objets de role
   */
  public roleObservable: Observable<Role[]>;

  /**
   * Tableau contenant toutes les roles
   */
  public roles: Role[];

  /**
   * Form contrôle permettant de gérer la liste déroulante pour la recherche intelligente
   */
  public choixRoleFormControl: FormControl = new FormControl();


  @ViewChild('roleInput') roleInput: ElementRef;
  @ViewChild('toolContainerNotFixed', {read: ElementRef}) toolContainerNotFixed: ElementRef;

  constructor(private modal: Modal,
              private formEditService: FormEditService,
              private previousRouteBusiness: PreviousRouteBusiness,
              private route: ActivatedRoute,
              private utilisateurService: UtilisateurService,
              private roleService: RoleService,
              private router: Router) {
  }

  ngOnInit() {
    this.formEditService.clear();
    this.getUser();
  }

  async getUser() {

    const utilisateurActuel = JSON.parse(localStorage.InfoUser);
    const idUtilisateur = parseInt(utilisateurActuel.id, 10);
    const retourAPI = await this.utilisateurService.getById(idUtilisateur);
    this.utilisateur = retourAPI;
  }

  // Méthode de retour à la liste des utilisateurs
  public goBack(): void {
    this.router.navigate(['/admin/']);
  }

}
