import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilisateurService} from '../../../e-commerce-ui-common/business/utilisateur.service';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';
import {RoleService} from '../../../e-commerce-ui-common/business/role.service';
import {Role} from '../../../e-commerce-ui-common/models/Role';
import {AuthDataService} from '../../business/auth-data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent implements OnInit {

  /**
   * Si on ajoute ou non un utilisateur
   * Si ce n'est pas un ajout c'est une modification
   */
  public ajout: boolean;

  /**
   * L'utilisateur actuel
   */
  public utilisateur: Utilisateur;

  /**
   * L'utilisateur modifié avec la valeur des champs du formDetail
   */
  public utilisateurModifie: Utilisateur;

  public formDetail: FormGroup;

  public formMdp: FormGroup;

  public formRole: FormGroup;

  /**
   * Tableau contenant toutes les roles
   */
  public roles: Role[];

  /**
   * Le message à afficher dans l'alerte
   */
  public message: string;

  /**
   * Boolean permettant de cacher l'alerte de succès
   * @type {boolean}
   */
  public cacherSucces = true;

  /**
   * Boolean permettant de cacher l'alerte d'erreur
   * @type {boolean}
   */
  public cacherErreur = true;

  /**
   * Boolean permettant de savoir si le bouton d'annulation dans la toolbar doit être cacher ou non
   * @type {boolean}
   */
  public desactiverBtn = true;

  /**
   * Le type du champ à utiliser pour le mot de passe
   */
  public typePassword = 'password';

  /**
   * L'icone à utiliser pour le bouton montrer/cacher mot de passe
   */
  public iconPassword = 'glyphicon glyphicon-eye-close';

  /**
   * La reference vers le modal
   */
  private modal: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private utilisateurService: UtilisateurService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthDataService
  ) {
  }

  async ngOnInit() {
    /* --- Setup des données de la page --- */
    this.ajout = (this.route.snapshot.routeConfig.path === 'admin/utilisateur/ajouter');
    // Recuperation des roles
    this.roles = await this.roleService.getAll();
    // Recupère l'utilisateur
    if (this.ajout) {
      // Si c'est un ajout d'utilisateur
      this.utilisateur = new Utilisateur(0, '', '', '');
      this.utilisateur.role = this.roles[0];
    } else {
      // Sinon c'est une modification
      const idUtilisateur = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      this.utilisateur = await this.utilisateurService.getById(idUtilisateur);
    }
    // Creation du nouvel utilisateur
    this.utilisateurModifie = Utilisateur.clone(this.utilisateur);
    /* --- Setup des formulaires --- */
    this.setupForm();
    console.log(this.formDetail);
  }

  // Méthode de retour à la liste des utilisateurs
  public goBack(): void {
    this.router.navigate(['/admin/utilisateur']);
    this.changeBtnState();
  }

  // Permets de gérer le bouton 'oeil' dans l'input mot de passe
  public hidePassword(): void {
    if (this.typePassword === 'password') {
      // Permets de définir le input de type:
      this.typePassword = 'text';
      // Permets de changer la classe de l'icone dans l'input
      this.iconPassword = 'glyphicon glyphicon-eye-open';
    } else {
      // Permets de définir le input de type:
      this.typePassword = 'password';
      // Permets de changer la classe de l'icone dans l'input
      this.iconPassword = 'glyphicon glyphicon-eye-close';
    }
  }

  public formIsValid(): boolean {
    return this.formDetail.valid && this.formRole.valid;
  }

  // Méthode permettante de comparé l'objet utilisateur avec utilisateurModifier
  public changeBtnState(): void {

  }

  public cancelModification() {
    this.utilisateurModifie = Utilisateur.clone(this.utilisateur);
    this.desactiverBtn = true;
  }

  public saveUser(): void {
    // Recup info du formulaire
    const detail = this.formDetail.value;
    const role = this.formRole.value;
    this.utilisateurModifie = new Utilisateur(
      this.utilisateur.id,
      detail.email,
      detail.prenom,
      detail.nom,
      'aze'
    );
    this.utilisateurModifie.role = new Role(
      role.id,
      this.utilisateur.role.nom
    );
    // Sauvegarde l'utilisateur
    if (this.ajout) {
      this.addUser();
    } else {
      this.updateUser();
    }
  }

  // Méthode permettante l'ajout d'une utilisateur
  public async addUser() {
    const retourAPI = await this.utilisateurService.add(this.utilisateurModifie);
    // Si le retourAPI est un utilisateur
    if (retourAPI.constructor.name !== 'String') {
      this.ajout = true;
      this.utilisateur = retourAPI;
      // Mets à jour la variable utilisateur et utilisateur modifiée
      if (this.utilisateur != null) {
        this.utilisateurModifie = retourAPI;
      }
      this.router.navigate(['/admin/utilisateur']);
    } else {
      this.cacherErreur = false;
      this.cacherSucces = true;
      this.message = retourAPI;
    }
  }

  public async updateUser() {
    // Verification que les champs requis sont présent
    const retourAPI = await this.utilisateurService.update(this.utilisateurModifie);
    if (retourAPI != null) {
      // Si le retourAPI est un utilisateur
      if (retourAPI.constructor.name !== 'String') {
        // Mets à jour la variable utilisateur et utilisateur modifiée
        this.utilisateur = retourAPI;
        this.utilisateurModifie = JSON.parse(JSON.stringify(this.utilisateur));
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = true;
        this.cacherSucces = false;
        this.message = 'L\'utilisateur a été mis à jour.';
        this.desactiverBtn = true;
        // Si c'est l'utilisateur courrant on met à jour ces infos
        if (this.auth.getCurrentUser().id === this.utilisateur.id) {
          this.auth.updateCurrentUserInfo(this.utilisateur);
        }
      } else {
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = false;
        this.cacherSucces = true;
        this.message = retourAPI;
      }
    } else {
      this.cacherErreur = false;
      this.cacherSucces = true;
      this.message = 'Impossible de modifier l\'utilisateur : Erreur serveur';
    }
  }


  public confirmModal(content: TemplateRef<any>) {
    this.modal = this.modalService.show(content, {class: 'modal-md'});
  }

  public async deleteUser() {
    this.modal.hide();
    await this.utilisateurService.delete(this.utilisateur);
    this.goBack();
  }

  private setupForm(): void {
    // Formulaire detail
    this.formDetail = new FormGroup({
      'email': new FormControl(this.utilisateur.email),
      'prenom': new FormControl(this.utilisateur.prenom),
      'nom': new FormControl(this.utilisateur.nom)
    });
    // Formulaire role
    this.formRole = new FormGroup({
      'id': new FormControl(this.utilisateur.role.id, [
        Validators.required
      ])
    });
  }

}
