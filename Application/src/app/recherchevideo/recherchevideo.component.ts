import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';

import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
import {AuthService} from '../auth/auth.service';

interface Video {
  title: string;
  image: string;
  description: string;
  channel: string;
  videoId: string;
  url: string;
}

interface Ad {
  id: number;
  nom: string;
}

interface Playlist {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-recherchevideo',
  templateUrl: './recherchevideo.component.html',
  styleUrls: ['./recherchevideo.component.css']
})
export class RecherchevideoComponent implements OnInit {

  recherche: '';
  firstname = '';
  lastname = '';
  videos: Video[];
  playlists: Playlist[];
  namePlaylist;
  newPlaylist;
  videoAddUrl;
  videoAddTitle;
  videoId = '';
  errorMessage = '';
  validationMessage = '';
  ad: Ad = {id: -1, nom: ''};
  debut = true;
  click = false;


  // videochat = "https://www.youtube.com/embed/ByH9LuSILxU"
  public catVideoEmbed = 'https://www.youtube.com/embed/QH2-TGUlwu4';

  constructor(private http: HttpClient, private service: AuthService) { }

  ngOnInit(): void {
    this.getPlaylist();
    this.getUsername();
    this.getAd();
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

  getAdBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/choose_ad',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getAd(): void{
    this.getAdBackend().subscribe(
      message => {
        this.ad = message.data;
      }
    );
  }

  getVideosBackend(recherche): Observable<PhpData> {
    const data = {
      term: recherche
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/search_videos',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }


  getVideos(recherche): void{
    this.getVideosBackend(recherche).subscribe(
      message => {
        this.videos = message.data;
        this.debut = false;
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

  setVideoAdd(url, title, videoId): void{
    this.videoAddUrl = url;
    this.videoAddTitle = title;
    this.videoId = videoId;
    this.errorMessage = '';
    this.newPlaylist = '';
  }

  newPlaylistBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
      name: this.newPlaylist
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/add_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getLastPlaylist(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_last_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  addVideoPlaylist(idPlaylist): Observable<PhpData> {
    const data = {
      url: this.videoAddUrl,
      title: this.videoAddTitle.toString(),
      id: idPlaylist,
      id_youtube: this.videoId
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/add_video_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  addPlaylist(){
    if (this.newPlaylist === undefined || this.newPlaylist === ''){
      // cas ou on ajoute dans une playlist existante
      if (this.namePlaylist === undefined) {
        this.errorMessage = 'Veuillez créer ou sélectionner une Playlist';
      } else {
        this.addVideoPlaylist(this.namePlaylist).subscribe(message => {
          this.errorMessage = '';
          this.validationMessage = 'La vidéo a bien été ajoutée à la Playlist';
        });
      }

    } else {
      return new Promise(resolve => {
        // cas ou on crée une nouvelle playlist
        this.newPlaylistBackend().subscribe( message => {
          this.getPlaylistBackend().subscribe( message => {
              this.playlists = message.data;
            }
          );
          this.getLastPlaylist().subscribe(message2 => {
            this.addVideoPlaylist(message2.data[0].idmax).subscribe(message3 => {
              this.errorMessage = '';
              this.validationMessage = 'La vidéo a bien été ajoutée à la Playlist';
            });
          });
          }
        );
      });
    }
  }

  close(): void {
    this.validationMessage = '';
    this.errorMessage = '';
  }


  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }

  addClickBackend(): Observable<PhpData> {
    const data = {
      id: this.ad.id,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/add_click',
      data,
      {withCredentials: true}
    );
  }

  addClick(): void{
    if (!this.click){
      this.addClickBackend().subscribe();
      this.click = true;
    }
  }

}
