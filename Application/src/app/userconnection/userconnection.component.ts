import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-userconnection',
  templateUrl: './userconnection.component.html',
  styleUrls: ['./userconnection.component.css']
})
export class UserconnectionComponent implements OnInit {

  email = '';
  mdp = '';
  errorMessage = '';

  constructor(private service: AuthService, private router: Router ) { }

  ngOnInit() { }

  authenticate(){
    this.errorMessage = '';
    if (this.email.trim() === '' || this.mdp.trim() === '') {
      this.errorMessage = 'Champ login ou mot de passe non rempli';
    } else {
      this.service.sendAuthentification(this.email, this.mdp, 1).subscribe(
        reponse => {
          if (reponse.status === 'ok'){
            this.service.applicationId = reponse.data.applicationId;
            if (this.service.redirectUrl === '') { this.router.navigateByUrl('/accueilplaylist');}
            else { this.router.navigateByUrl(this.service.redirectUrl); }
          } else { this.errorMessage = reponse.data.reason; }
        }
      );
    }
  }


}
