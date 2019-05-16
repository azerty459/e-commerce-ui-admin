import {Injectable} from '@angular/core';
import {Utilisateur} from '../../e-commerce-ui-common/models/Utilisateur';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Token} from '../../e-commerce-ui-common/models/Token';
import {Router} from '@angular/router';
import {MessageAlerte} from '../../e-commerce-ui-common/models/MessageAlerte';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  public token = new Token();
  public messageAlerte = new MessageAlerte();

  constructor(private http: HttpClient, private _router: Router) {
    if (sessionStorage.getItem('token') !== null) {
      this.token.connecte = true;
      this.token.token = sessionStorage.token;
      this.token.utilisateur = JSON.parse(sessionStorage.user);
    }
  }

  public async signIn(email: string, mdp: string) {
    const response = await this.signInRequete(email, mdp);
    if (response['signinUtilisateur'] !== undefined) {
      this.setToken(response['signinUtilisateur'].token.token, response['signinUtilisateur'].token.utilisateur);
      this.messageAlerte.message = '';
      this._router.navigate(['/admin']);
    } else {
      this.messageAlerte.message = response[0]['message'];
    }
  }

  public isLogged(): Promise<Boolean> {
    if (!this.token.connecte) {
      return new Promise<Boolean>(resolve => resolve(false));
    }
    return this.isLoggedRequest();
  }

  public logout() {
    this.unsetToken();
    this._router.navigate(['/admin/login']);
  }

  public isSet(): boolean {
    return this.token.connecte;
  }

  public getToken(): string {
    return this.token.token;
  }

  public getCurrentUser(): Utilisateur {
    return this.token.utilisateur;
  }

  private setToken(token: string, utilisateur: Utilisateur): void {
    this.token.token = token;
    this.token.utilisateur = utilisateur;
    this.token.connecte = true;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', '' + JSON.stringify(utilisateur));
  }

  private unsetToken(): void {
    this.token.connecte = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  private signInRequete(email: string, mdp: string) {
    return this.http.post(environment.api_login_url, {
      query: 'mutation { signinUtilisateur(auth: {email:"' + email + '",' +
        'password:"' + mdp + '"}){' +
        'token{utilisateur{id email nom prenom}token}}}'
    }).toPromise();
  }

  private isLoggedRequest(): Promise<Boolean> {
    // On récupère l'objet Observable retourné par la requête post
    const postResult = this.http.post(environment.api_login_url, {query: 'mutation {isLogged(token:"' + this.token.token + '")}'});
    // On créer une promesse
    return new Promise<any>((resolve) => {
      postResult
        .toPromise()
        .then(
          response => {
            console.log(response);
            if (response.valueOf()['isLogged'] !== undefined) {
              resolve(response.valueOf()['isLogged']);
            } else {
              resolve(false);
            }
          }
        );
    });
  }
}
