import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from "rxjs";
import {PhpData} from "../php-data";
import { DomSanitizer } from '@angular/platform-browser';
import {AuthService} from "../auth/auth.service";


interface Video {
  id: number;
  lien: string;
  title: string;
  lienSan;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  lastname = '';
  firstname = '';
  idPlaylist = '';
  namePlaylist = '';
  videos: Video[];
  nb = '';
  idVideoDelete;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private sanitizer: DomSanitizer,
              private service: AuthService) { }

  ngOnInit(): void {
    this.idPlaylist = this.route.snapshot.paramMap.get('id');
    this.getUsername();
    this.getVideos();
    this.getPlaylistName();
    this.getNbVideo();
  }




  getVideosBackend(): Observable<PhpData> {
    const data = {
      id: this.idPlaylist,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_videos_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getVideos(): void{
    this.getVideosBackend().subscribe( message => {
        this.videos = message.data;
      }
    );
  }

  getPlaylistNameBackend(): Observable<PhpData> {
    const data = {
      id: this.idPlaylist,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_playlist_name',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getPlaylistName(): void{
    this.getPlaylistNameBackend().subscribe( message => {
        this.namePlaylist = message.data.nom;
      }
    );
  }

  getNbVideosBackend(): Observable<PhpData> {
    const data = {
      id: this.idPlaylist,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_nb_video',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getNbVideo(): void{
    this.getNbVideosBackend().subscribe(
      message => {
        this.nb = message.data.nb;
      }
    );
  }


  deletePlaylistBackend(): Observable<PhpData> {
    const data = {
      id: this.idPlaylist,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/delete_playlist',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  deletePlaylist(): void{
    this.deletePlaylistBackend().subscribe(
      message => {
      }
    );
  }

  deleteVideoBackend(): Observable<PhpData> {
    const data = {
      idVideo: this.idVideoDelete,
      idPlaylist: this.idPlaylist,
    };

    return this.http.post<PhpData>(
        'http://127.0.0.1:3000/delete_video',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
        data,                                            // le FormData
        {withCredentials: true}                        // les options de transfert
    );
  }

  deleteVideo(): void{
    this.deleteVideoBackend().subscribe(
        message => {
          window.location.reload();
        }
    );
  }

  setIdDeleteVideo(id): void{
    this.idVideoDelete = id;
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

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }

}
