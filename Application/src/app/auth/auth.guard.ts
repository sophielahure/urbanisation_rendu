import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private authService: AuthService, private router: Router){  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string ;

    if (this.authService.applicationId === -1) {
      if (state.url === '/accueilplaylist' || state.url === '/recherche' || state.url.substring(0, 9) === '/playlist'){
        this.authService.applicationId = 1;
      } else if ( state.url.substring(0, 10)  === '/annonces/'){
        this.authService.applicationId = 2;
      }
    }

    if (url === '/login'){
      url = '/accueilplaylist';
    } else {
      url = state.url;
    }

    return this.checkLogin(url);
  }

  verifyConnection() {
    return new Promise(resolve => {
      this.authService.checkConnection().subscribe(
        message => {
          if (message.data.userId === -1 || message.data.applicationId !== this.authService.applicationId){
            this.authService.userId = -1;
            resolve(false);
          } else {
            this.authService.userId = message.data.userId;
            resolve(true);
          }
        }
      );
    });
  }

  async checkLogin(url: string): Promise<boolean> {

    let connect = await this.verifyConnection( );

    if (connect) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras

    if (this.authService.applicationId === 2){
      this.router.navigate(['/login_company']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }

}
