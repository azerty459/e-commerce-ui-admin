import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Utilisateur} from '../../../e-commerce-ui-common/models/Utilisateur';
import {AuthDataService} from '../../business/auth-data.service';

@Component({
  selector: 'app-compte-utilisateur',
  templateUrl: './compte-utilisateur.component.html',
  styleUrls: ['./compte-utilisateur.component.scss']
})
export class CompteUtilisateurComponent implements OnInit {

  public utilisateur: Utilisateur = this.auth.getCurrentUser();

  constructor(
    private router: Router,
    private auth: AuthDataService) {
  }

  ngOnInit() {
  }

  // Méthode de retour à la liste des utilisateurs
  public goBack(): void {
    this.router.navigate(['/admin/']);
  }

}
