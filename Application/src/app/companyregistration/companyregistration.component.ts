import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-companyregistration',
  templateUrl: './companyregistration.component.html',
  styleUrls: ['./companyregistration.component.css']
})
export class CompanyregistrationComponent implements OnInit {

  company = '';
  email = '';
  mdp = '';
  errorMessage = '';
  mdp_confirmation = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  sendNewCompany(): Observable<PhpData>{
    const data = {
      company: this.company,
      mdp: this.mdp,
      email: this.email
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/create_company',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  inscription(){
    if (this.email.trim() === '' || this.mdp.trim() === '' || this.company.trim() === '' || this.mdp_confirmation.trim() === '') {
      this.errorMessage = 'Un ou plusieurs champ n\'est pas rempli correctement';
    }else if (this.mdp_confirmation !== this.mdp){
      this.errorMessage = 'Les mots de passe sont différents';
      this.mdp = '';
      this.mdp_confirmation = '';
    } else {
      this.sendNewCompany().subscribe(
        message => {
          if (message.status === 'ok'){
            this.router.navigateByUrl('/login_company');
          } else {
            this.errorMessage = message.data.reason;
          }
        }
      );
    }
  }

}
