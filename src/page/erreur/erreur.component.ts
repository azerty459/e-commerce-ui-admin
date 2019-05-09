import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.component.html',
  styleUrls: ['./erreur.component.css']
})
export class ErreurComponent implements OnInit {

  public codeErreur: number;
  public titreErreur: String;
  public messageErreur: String;

  constructor() {
  }

  ngOnInit() {
  }
}
