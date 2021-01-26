import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {AuthService} from '../auth/auth.service';

interface Playlist {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-accueilplaylist',
  templateUrl: './accueilplaylist.component.html',
  styleUrls: ['./accueilplaylist.component.css']
})
export class AccueilplaylistComponent implements OnInit {

  lastname = '';
  firstname = '';
  playlists: Playlist[];
  namePlaylist = '';

  constructor(private http: HttpClient, private service: AuthService) {
  }

  ngOnInit(): void {
    this.getUsername();
    this.getPlaylist();
  }

  getUserNameBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_username',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getUsername(): void{
    this.getUserNameBackend().subscribe(
      message => {
        this.lastname = message.data.nom;
        this.firstname = message.data.prenom;
      }
    );
  }

  getPlaylistBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getPlaylist(): void{
    this.getPlaylistBackend().subscribe( message => {
        this.playlists = message.data;
      }
    );
  }

  newPlaylistBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
      name: this.namePlaylist
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/add_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  newPlaylist(): void{
    this.newPlaylistBackend().subscribe( message => {
        window.location.reload();
      }
    );
  }

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }
}
