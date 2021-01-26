import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserconnectionComponent} from './userconnection/userconnection.component';
import {UserregistrationComponent} from './userregistration/userregistration.component';
import {AccueilplaylistComponent} from './accueilplaylist/accueilplaylist.component';
import {RecherchevideoComponent} from './recherchevideo/recherchevideo.component';
import {PlaylistComponent} from './playlist/playlist.component';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './auth/auth.guard';
import {CompanyconnectionComponent} from './companyconnection/companyconnection.component';
import {CompanyregistrationComponent} from './companyregistration/companyregistration.component';
import {AnnoncesComponent} from './annonces/annonces.component';
import {AdcreationComponent} from './adcreation/adcreation.component';
import {AnnonceComponent} from './annonce/annonce.component';
import {AdmodificationComponent} from './admodification/admodification.component';

const routes: Routes = [
  {path: '', redirectTo: '/accueilplaylist', pathMatch: 'full'},
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {path: 'playlist/:id', component: PlaylistComponent},
      {path: 'accueilplaylist', component: AccueilplaylistComponent},
      {path: 'recherche', component: RecherchevideoComponent},
      {path: 'annonces/:id_entreprise', component: AnnoncesComponent},
      {path: 'annonces/:id_entreprise/creer_ciblage', component: AdcreationComponent},
      {path: 'annonces/:id_entreprise/:id_annonce', component: AnnonceComponent},
      {path: 'annonces/:id_entreprise/:id_annonce/modification', component: AdmodificationComponent}
    ]
  },
  {path: 'login', component: UserconnectionComponent},
  {path: 'inscription', component: UserregistrationComponent},
  {path: 'login_company', component: CompanyconnectionComponent},
  {path: 'inscription_company', component: CompanyregistrationComponent}

  //{path: '**', redirectTo: '/accueilplaylist'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
