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
import {MatAutocompleteSelectedEvent} from '@angular/material';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent implements OnInit {
  @ViewChild('photo') public photo;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public positionBeforeTooltip = 'before';
  public positionAfterTooltip = 'after';
  // Enter, comma
  public separatorKeysCodes = [ENTER, COMMA];
  public message: string;
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
    window.addEventListener('scroll', this.scroll, true); // third parameter
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
      if (!(retourAPI.valueOf() instanceof Utilisateur)) {
        this.router.navigate(['page-404'], {skipLocationChange: true});
      }
      this.utilisateur = retourAPI;
      this.utilisateurModifie = JSON.parse(JSON.stringify(this.utilisateur));
    }
  }

  // Méthode permettante de comparé l'objet utilisateur avec utilisateurModifier
  comparedUserWithUserModif() {
    // Si l'utilisateur modifier est différent de utilisateur
    if (JSON.stringify(this.utilisateur) !== JSON.stringify(this.utilisateurModifie)) {
      this.cacherBoutonAnnulation = false;
      // Permets d'afficher la pop-up "en cours d'édition"
      this.formEditService.setDirty(true);
    } else {
      this.cacherBoutonAnnulation = true;
      // Permets d'afficher la pop-up "en cours d'édition"
      this.formEditService.setDirty(false);
    }
  }

  cancelModification() {
    // Permet de copier la variable utilisateur dans utilisateurModifier
    this.utilisateurModifie = JSON.parse(JSON.stringify(this.utilisateur));
    // Permets de cacher le bouton d'annulation des modifications
    this.cacherBoutonAnnulation = true;
    //  Permets de désactiver la pop-up "en cours d'édition"
    this.formEditService.setDirty(false);
  }

  public saveModification(): void {
    this.updateUser();
  }

  public async updateUser() {
    const retourAPI = await this.utilisateurService.update(this.utilisateurModifie);
    if (retourAPI != null && retourAPI !== undefined) {
      // Si le retourAPI est un utilisateur
      if (retourAPI.valueOf() instanceof Utilisateur) {
        // Mets à jour la variable utilisateur et utilisateur modifiée
        this.utilisateur = retourAPI;
        if (this.utilisateur != null && this.utilisateur !== undefined) {
          this.utilisateurModifie = JSON.parse(JSON.stringify(retourAPI));
        }
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = true;
        this.cacherAlert = false;
        this.message = 'L\'utilisateur a été mis à jour.';
        this.cacherBoutonAnnulation = true;
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.formEditService.setDirty(false);
      } else {
        // Permets gérer la gestion d'alerte en cas de succès ou erreur
        this.cacherErreur = false;
        this.cacherAlert = true;
        this.message = 'L\'utilisateur n\'a pas pu être modifié, vous devez renseigner au minimum les champs de l\'email' +
          ' et du mdp';
      }
    }
  }

  // Méthode permettante l'ajout d'une utilisateur
  public async addUser() {
    const retourAPI = await this.utilisateurService.add(this.utilisateurModifie);
    // Si le retourAPI est un utilisateur
    if (retourAPI.valueOf() instanceof Utilisateur) {
      this.cacherErreur = true;
      this.cacherAlert = false;
      this.ajout = true;
      this.utilisateur = retourAPI;
      // Mets à jour la variable utilisateur et utilisateur modifiée
      if (this.utilisateur != null && this.utilisateur !== undefined) {
        this.utilisateurModifie = JSON.parse(JSON.stringify(retourAPI));
      }
      this.message = 'L\'utilisateur a été correctement ajouté';
      this.router.navigate(['/admin/utilisateur']);
    } else {
      this.cacherErreur = false;
      this.cacherAlert = true;
      this.message = retourAPI;
    }
  }

  // Méthode permettante de gérer la supprésion d'utilisateur
  public deleteUser(utilisateur: Utilisateur) {
    // Pop-up gérant la suppression d'un utilisateur
    const dialogRef = this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Suppression de ' + utilisateur.id + ' - ' + utilisateur.email)
      .body('Comfirmez vous la suppression de ' + utilisateur.id + ' - ' + utilisateur.email + '?')
      .okBtn('Comfirmer la suppression')
      .okBtnClass('btn btn-danger')
      .cancelBtn('Annuler la suppression')
      .open();
    dialogRef.result
      .then(async () => {
        const supprimer = await this.utilisateurService.delete(this.utilisateur);
        // Si l'utilisateur a été supprimé, on affiche le message
        if (supprimer) {
          this.cacherErreur = false;
          this.cacherAlert = true;
          this.message = 'L\'utilisateur a été supprimé.';
        }
      })
      // Pour éviter l'erreur de promise dans console.log
      .catch(() => null);
  }

  // Supprime une rôle de la liste
  public deleteRole(role: any): void {
    this.utilisateurModifie.role = new Role(0, '');
  }

  // Permet de rajouter un role dans la chips
  public addRole(event: MatAutocompleteSelectedEvent): void {
    const retourRole = event.option.value;
    this.roleInput.nativeElement.value = '';
    this.choixRoleFormControl.setValue(null);
    const role = this.utilisateurModifie.role;
    let trouver = false;
    for (const categorie of role) {
      if (categorie.id === retourRole.id) {
        trouver = true;
        break;
      }
    }
    if (trouver === false) {
      this.utilisateurModifie.role = retourRole;
      this.comparedUserWithUserModif();
    } else {
      this.cacherAlert = true;
      this.cacherErreur = false;
      this.message = 'Ce rôle est déjà ajoutée.';
    }
  }

  // Méthode de retour à la liste des utilisateurs
  public goBack(): void {
    this.router.navigate(['/admin/utilisateur']);
    this.comparedUserWithUserModif();
  }

  // Permets de gérer le bouton 'oeil' dans l'input mot de passe
  public hidePassword(): void {
    if (this.typePassword === 'password') {
      // Permets de définir le input de type:
      this.typePassword = 'text';
      // Permets de changer la classe de l'icone dans l'input
      this.classPassword = 'glyphicon glyphicon-eye-open';
    } else {
      // Permets de définir le input de type:
      this.typePassword = 'password';
      // Permets de changer la classe de l'icone dans l'input
      this.classPassword = 'glyphicon glyphicon-eye-close';
    }
  }

  getCurrentOffsetTop(element) {
    const rect = element.nativeElement.getBoundingClientRect();
    return rect.top + window.pageYOffset - document.documentElement.clientTop;
  }

  scroll = (): void => {
    console.log(this.getCurrentOffsetTop(this.toolContainerNotFixed));
    if (this.getCurrentOffsetTop(this.toolContainerNotFixed) !== 0 && this.toolNotFixed) {
      this.toolNotFixed = false;
    } else if (this.getCurrentOffsetTop(this.toolContainerNotFixed) === 0 && !this.toolNotFixed) {
      this.toolNotFixed = true;
    }
  };
}
