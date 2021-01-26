import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserconnectionComponent } from './userconnection/userconnection.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { UserregistrationComponent } from './userregistration/userregistration.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { RecherchevideoComponent } from './recherchevideo/recherchevideo.component';
import { AccueilplaylistComponent } from './accueilplaylist/accueilplaylist.component';
import {SafePipeModule} from 'safe-pipe';
import { CompanyconnectionComponent } from './companyconnection/companyconnection.component';
import { CompanyregistrationComponent } from './companyregistration/companyregistration.component';
import { AdcreationComponent } from './adcreation/adcreation.component';
import { AdmodificationComponent } from './admodification/admodification.component';
import { AnnonceComponent } from './annonce/annonce.component';
import { AnnoncesComponent } from './annonces/annonces.component';


@NgModule({
  declarations: [
    AppComponent,
    UserconnectionComponent,
    UserregistrationComponent,
    PlaylistComponent,
    RecherchevideoComponent,
    AccueilplaylistComponent,
    CompanyconnectionComponent,
    CompanyregistrationComponent,
    AdcreationComponent,
    AdmodificationComponent,
    AnnonceComponent,
    AnnoncesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SafePipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
