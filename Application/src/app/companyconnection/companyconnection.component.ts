import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-companyconnection',
  templateUrl: './companyconnection.component.html',
  styleUrls: ['./companyconnection.component.css']
})
export class CompanyconnectionComponent implements OnInit {

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
      this.service.sendAuthentificationCompany(this.email, this.mdp).subscribe(
        reponse => {
          if (reponse.status === 'ok'){
            this.service.applicationId = 2;
            if (this.service.redirectUrl === '') { this.router.navigateByUrl('/annonces/' + reponse.data.userId); }
            else { this.router.navigateByUrl(this.service.redirectUrl); }
          } else { this.errorMessage = reponse.data.reason; }
        }
      );
    }
  }

}
