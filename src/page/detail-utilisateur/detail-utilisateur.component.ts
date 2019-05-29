import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilisateurService} from '../../../e-commerce-ui-common/business/utilisateur.service';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';
import {RoleService} from '../../../e-commerce-ui-common/business/role.service';
import {Role} from '../../../e-commerce-ui-common/models/Role';
import {AuthDataService} from '../../business/auth-data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  passwordStrengthValidator,
  passwordStrengthValidatorOptional,
  samePasswordAndVerification
} from '../../../e-commerce-ui-common/directive/password.directive';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent implements OnInit {

  /**
   * Indique si les données pour l'affichage de la page sont chargées
   */
  public isLoad = false;

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
   * La zone de formulaire des details
   */
  public formDetail: FormGroup;

  /**
   * La zone de formulaire du mot de passe
   */
  public formMdp: FormGroup;

  /**
   * La zone de formulaire du role
   */
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

  ngOnInit() {
    this.ajout = (this.route.snapshot.routeConfig.path === 'admin/utilisateur/ajouter');
    this.setupUser().then(() => {
      this.setupForm();
      this.isLoad = true;
    });
  }

  /**
   * Retourne sur la liste des utilisateurs
   */
  public goBack(): void {
    this.router.navigate(['/admin/utilisateur']);
  }

  /**
   * Cache/affiche le mot de passe
   */
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

  /**
   * Verifie si les données du formulaire sont valide
   * et si elle sont différentes de l'utilisateur en cours de modification (si modification)
   */
  public dataAreValid(): boolean {
    if (this.formDetail === undefined || this.formMdp === undefined || this.formRole === undefined) {
      return false;
    }
    if (Utilisateur.equals(this.utilisateur, this.getUserFromForm())) {
      return false;
    }
    return this.formDetail.valid && this.formMdp.valid && this.formRole.valid;
  }

  /**
   * Annule les modifications effectuées
   */
  public cancelModification(): void {
    this.setupForm();
  }

  /**
   * Sauvegarde l'utilisateur
   */
  public saveUser(): void {
    // Verif info formulaire
    if (!this.dataAreValid()) {
      this.message = 'Données du formulaire invalide';
      this.cacherErreur = false;
      return;
    }
    // Recup info du formulaire
    const utilisateur = this.getUserFromForm();
    // Sauvegarde l'utilisateur
    if (this.ajout) {
      this.addUser(utilisateur);
    } else {
      this.updateUser(utilisateur);
    }
  }


  /**
   * Ajoute un utilisateur
   * @param nouvelUtilisateur
   */
  public async addUser(nouvelUtilisateur: Utilisateur) {
    const retourAPI = await this.utilisateurService.add(nouvelUtilisateur);
    // Si le retourAPI est un utilisateur
    if (retourAPI.constructor.name !== 'String') {
      this.ajout = true;
      this.utilisateur = retourAPI;
      this.router.navigate(['/admin/utilisateur']);
    } else {
      this.cacherErreur = false;
      this.cacherSucces = true;
      this.message = retourAPI;
    }
  }

  /**
   * Met à jour un utilisateur
   * @param utilisateurModifie
   */
  public async updateUser(utilisateurModifie: Utilisateur) {
    // Verification que les champs requis sont présent
    const retourAPI = await this.utilisateurService.update(utilisateurModifie);
    if (retourAPI != null) {
      // Si le retourAPI est un utilisateur
      if (retourAPI.constructor.name !== 'String') {
        // Mets à jour la variable utilisateur et utilisateur modifiée
        this.utilisateur = retourAPI;
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

  /**
   * Affiche un modal de confirmation
   * @param content
   */
  public confirmModal(content: TemplateRef<any>) {
    this.modal = this.modalService.show(content, {class: 'modal-md'});
  }

  /**
   * Supprime un utilisateur
   */
  public async deleteUser() {
    this.modal.hide();
    await this.utilisateurService.delete(this.utilisateur);
    this.goBack();
  }

  /**
   * Recupere les infos de l'utlisateur à modifier
   */
  private async setupUser() {
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
  }

  /**
   * Création des formulaires
   */
  private setupForm(): void {
    // Formulaire detail
    this.formDetail = new FormGroup({
      'email': new FormControl(this.utilisateur.email, [
        Validators.required,
        Validators.maxLength(250),
        Validators.email
      ]),
      'prenom': new FormControl(this.utilisateur.prenom, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z\\s\'_-]+$')
      ]),
      'nom': new FormControl(this.utilisateur.nom, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z\\s\'_-]+$')
      ])
    });
    // Formulaire MdP (change ne fonction de ajout ou modif)
    const validator = [];
    if (this.ajout) {
      validator.push(Validators.required);
      validator.push(passwordStrengthValidator);
    } else {
      validator.push(passwordStrengthValidatorOptional);
    }
    this.formMdp = new FormGroup({
      'mdp': new FormControl('', validator),
      'verifMdp': new FormControl('', validator)
    }, samePasswordAndVerification);
    // Formulaire role
    this.formRole = new FormGroup({
      'id': new FormControl(this.utilisateur.role.id, [
        Validators.required
      ])
    });
  }

  /**
   * Création de l'utilisateur correspondant aux valeurs des champs du formulaire
   */
  private getUserFromForm(): Utilisateur {
    const detail = this.formDetail.value;
    const role = this.formRole.value;
    const mdp = this.formMdp.value;
    const utilisateur = new Utilisateur(
      this.utilisateur.id,
      detail.email,
      detail.prenom,
      detail.nom,
      mdp.mdp
    );
    utilisateur.role = new Role(
      role.id,
      this.utilisateur.role.nom
    );
    return utilisateur;
  }

}
