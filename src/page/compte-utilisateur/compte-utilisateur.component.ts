import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {PreviousRouteBusiness} from '../../../e-commerce-ui-common/business/previous-route.service';
import {map, startWith} from 'rxjs/operators';
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
  @ViewChild('photo') public photo;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public positionBeforeTooltip = 'before';
  public positionAfterTooltip = 'after';
  // Enter, comma
  public separatorKeysCodes = [ENTER, COMMA];
  public message: String;
  public ajout: boolean;
  public utilisateur: Utilisateur;
  public utilisateurModifie: Utilisateur;

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

  /**
   * Boolean permettant de cacher l'alerte de succès
   * @type {boolean}
   */
  cacherAlert = true;

  /**
   * Boolean permettant de cacher l'alerte d'erreur
   * @type {boolean}
   */
  cacherErreur = true;

  /**
   * indique que la toolbar est en position fixed
   * @type {boolean}
   */
  toolNotFixed = true;

  public typePassword = 'password';

  public classPassword = 'glyphicon glyphicon-eye-open';


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
    // Permets de gérer l'affichage des rôles dans les chips
    this.roles = await this.roleService.getAll();
    if (this.roles !== undefined) {
      // Permets de faire une recherche intelligente sur la liste déroulante selon le(s) caractère(s) écrit.
      this.roleObservable = this.choixRoleFormControl.valueChanges.pipe(
        startWith(''),
        map(val => this.roles.filter(role => role.nom.toLowerCase().indexOf(val) === 0))
      );
    }
    const url = this.route.snapshot.routeConfig.path;
    if (url === 'admin/utilisateur/ajouter') {
      this.ajout = true;
      this.utilisateurModifie = new Utilisateur(null, null, null, null, null);
      this.utilisateurModifie.role = this.roles[0];
      this.utilisateur = new Utilisateur(null, null, null, null, null);
      this.utilisateur.role = new Role(0, '');
    } else {
      this.ajout = false;
      const idUtilisateur = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      const retourAPI = await this.utilisateurService.getById(idUtilisateur);
      this.utilisateur = retourAPI;
      this.utilisateurModifie = JSON.parse(JSON.stringify(this.utilisateur));
    }
  }
}
