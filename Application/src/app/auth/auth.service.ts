import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PhpData} from '../php-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl = '';
  userId = -1;
  applicationId = -1;

  constructor(private http: HttpClient) {

  }

  checkConnection(): Observable<PhpData>{
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/checkConnection',   //'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      [],                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  sendAuthentification(email: string, mdp: string, id): Observable<PhpData>{
    const data = {
      email: email,
      mdp: mdp,
      application_id: id
    }

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/checkLogin',   //'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  sendAuthentificationCompany(email: string, mdp: string): Observable<PhpData>{
    const data = {
      email: email,
      mdp: mdp,
      application_id: 2
    }

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/checkLoginCompany',   //'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  send_deconnection(): Observable<PhpData> {
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/disconnect_user',
      [],
      {withCredentials: true}
    );
  }

}
