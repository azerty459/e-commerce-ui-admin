/**
 * @title Arbre avec FlatNode
 */
import {Component, OnInit} from '@angular/core';
import {AuthDataService} from '../../business/auth-data.service';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';
import {MessageAlerte} from "../../../e-commerce-ui-common/models/MessageAlerte";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})


export class LoginComponent implements OnInit {
  public utilisateur: Utilisateur = this.authData.utilisateur;
  public messageAlerte: MessageAlerte = this.authData.messageAlerte;
  constructor(private authData: AuthDataService) {
  }
  ngOnInit(): void {
    this.utilisateur.email = '';
    this.utilisateur.mdp = '';
  }
  public signIn() {
    if (this.utilisateur.email === '' || this.utilisateur.mdp === '') {
      console.log('champs vide');
    } else {
      this.authData.signIn();
    }
  }
}

