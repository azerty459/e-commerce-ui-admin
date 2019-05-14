import {Injectable} from '@angular/core';
import {Utilisateur} from '../../e-commerce-ui-common/models/Utilisateur';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Token} from '../../e-commerce-ui-common/models/Token';
import {Router} from '@angular/router';
import {MessageAlerte} from '../../e-commerce-ui-common/models/MessageAlerte';

// noinspection JSAnnotator
@Injectable()

export class AuthDataService {
  public utilisateur: Utilisateur = new Utilisateur(null, null, null, null, null);
  public token: Token = new Token(this.utilisateur);
  public messageAlerte: MessageAlerte = new MessageAlerte();

  constructor(private http: HttpClient, private _router: Router) {
    if (localStorage.getItem('AuthToken') !== null && localStorage.getItem('AuthToken') !== undefined) {
      this.token.token = localStorage.getItem('AuthToken');
    }
  }

  public async signIn() {
    const response = await this.signInRequete();
    if (response.valueOf()[0] !== undefined) {
      this.messageAlerte.message = response.valueOf()[0]['message'];
    } else if (response['signinUtilisateur'] !== undefined) {
      this.messageAlerte.message = '';
      this.token.token = response['signinUtilisateur'].token.token;
      localStorage.setItem('AuthToken', this.token.token);
      localStorage.setItem('InfoUser', JSON.stringify(response['signinUtilisateur'].token.utilisateur));
      this._router.navigate(['/admin']);
    }
  }

  public signInRequete() {
    // On récupère l'objet Observable retourné par la requête post
    if (this.utilisateur === undefined) {
      // TODO erreur
    }
    const postResult = this.http.post(environment.api_login_url, {
      query: 'mutation { signinUtilisateur(auth: {email:"' + this.utilisateur.email + '",' +
        'password:"' + this.utilisateur.mdp + '"}){' +
        'token{utilisateur{email nom prenom}token}}}'
    });
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            // On résout notre promesse
            resolve(response);
          }
        );
    });
    return promise;
  }

  public isLogged() {
    let token;
    if (this.token === undefined || this.token.token) {
      token = localStorage.getItem('AuthToken');
      if (token === null) {
        token = 0;
      }
    } else {
      token = this.token.token;
    }
    // On récupère l'objet Observable retourné par la requête post
    if (this.utilisateur === undefined) {
      // TODO erreur
    }
    const postResult = this.http.post(environment.api_login_url, {query: 'mutation {isLogged(token:"' + token + '")}'});
    // On créer une promesse
    const promise = new Promise<any>((resolve) => {
      postResult
      // On transforme en promesse
        .toPromise()
        .then(
          response => {
            console.log(response);
            if (response.valueOf()['isLogged'] !== undefined) {
              resolve(response.valueOf()['isLogged']);
            } else {
              resolve(false);
            }
            // On résout notre promesse
          }
        );
    });
    return promise;
  }

  public logout() {
    this.utilisateur.email = null;
    this.utilisateur.mdp = null;
    this.token.token = undefined;
    this.token.utilisateur = new Utilisateur(null, null, null, null, null);
    localStorage.removeItem('AuthToken');
    this._router.navigate(['/admin/login']);
  }
}
