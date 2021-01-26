import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-userregistration',
  templateUrl: './userregistration.component.html',
  styleUrls: ['./userregistration.component.css']
})
export class UserregistrationComponent implements OnInit {

  nom = '';
  prenom = '';
  birthday = '';
  email = '';
  mdp = '';
  errorMessage = '';
  genre = 'homme';
  mdp_confirmation = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  sendNewUser(): Observable<PhpData>{
    const data = {
      nom: this.nom,
      prenom: this.prenom,
      birthday: this.birthday,
      email: this.email,
      mdp: this.mdp,
      genre: this.genre
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/create_user',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }


  inscription(){
    if (this.email.trim() === '' || this.mdp.trim() === '' || this.prenom.trim() === '' || this.nom.trim() === '' || this.birthday.trim() === '' || this.mdp_confirmation.trim() === '') {
      this.errorMessage = 'Un ou plusieurs champ n\'est pas rempli correctement';
    }else if (this.mdp_confirmation !== this.mdp){
      this.errorMessage = 'Les mots de passe sont différents';
      this.mdp = '';
      this.mdp_confirmation = '';
}  else {
      this.sendNewUser().subscribe(
        message => {
          // tslint:disable-next-line:triple-equals
          if (message.status == 'ok'){
            this.router.navigateByUrl('/login');
          } else {
            this.errorMessage = message.data.reason;
          }
        }
      );
    }
  }

}
