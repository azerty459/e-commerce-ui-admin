/**
 * @title Arbre avec FlatNode
 */
import {Component, OnInit} from '@angular/core';
import {AuthDataService} from '../../business/auth-data.service';
import {MessageAlerte} from '../../../e-commerce-ui-common/models/MessageAlerte';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})


export class LoginComponent implements OnInit {
  public email: string;
  public mdp: string;
  public messageAlerte: MessageAlerte = this.authData.messageAlerte;
  public hide = true;

  constructor(private authData: AuthDataService) {
  }

  ngOnInit(): void {
    // Deconnexion si deja connecté
    if (this.authData.isLogged()) {
      this.authData.logout();
    }
    // Inialise les champs
    this.email = '';
    this.mdp = '';
  }

  public signIn() {
    if (this.email === '' || this.mdp === '') {
      this.messageAlerte.message = 'Merci d\'entrer un email et un mot de passe';
    } else {
      this.authData.signIn(this.email, this.mdp);
    }
  }
}

