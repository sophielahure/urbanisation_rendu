import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css']
})
export class AnnoncesComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  id_entreprise = null;
  // tslint:disable-next-line:variable-name
  liste_annonce = null;
  // tslint:disable-next-line:variable-name
  parcours_annonce = null;
  imageURL = '';
  number_people_targetting = [];
  entreprise_name = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private service: AuthService) { }

  ngOnInit(): void {
    this.id_entreprise = this.route.snapshot.paramMap.get('id_entreprise');
    this.print_advertisement();
    this.getCompanyName();
    //this.print_number_people_targetting();
  }

  getCompanyNameBackend(): Observable<PhpData> {
    const data = {
      id: this.service.userId,
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/name_company',   // 'http://127.0.0.1:3000/public_html/forum/angular/checkLogin.php', // le script PHP
      data,                                            // le FormData
      {withCredentials: true}                        // les options de transfert
    );
  }

  getCompanyName(): void{
    this.getCompanyNameBackend().subscribe(
      message => {
        this.entreprise_name = message.data.entreprise;
      }
    );
  }

  get_number_people_targetting(annonces): Observable<PhpData>{
    let id_annonces = [];

    for (let annonce of annonces){
      id_annonces.push(annonce.id);
    }

    const data = {
      id_ad: id_annonces
    };

    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/number_people_targetting',
      data,
      {withCredentials: true}
    );
  }

  get_advertisement(): Observable<PhpData>{
    const data = {
      // id_entreprise: 1
      id_entreprise : this.id_entreprise
    };
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/annonces',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  // tslint:disable-next-line:typedef
  print_advertisement(){
    this.get_advertisement().subscribe(
      reponse => {

        this.liste_annonce = reponse;
        this.parcours_annonce = Array.from(Array(this.liste_annonce.data.length).keys());

        this.get_number_people_targetting(reponse.data).subscribe(
          reponse2 => {
            this.number_people_targetting = reponse2.data;
          }
        );

        return reponse;
      }
    );

  }

  // tslint:disable-next-line:typedef
  show_creation_page(){
    const link = '/annonces/' + this.id_entreprise + '/creer_ciblage';
    // window.open(link);
    window.location.href = link;
  }

  // tslint:disable-next-line:typedef variable-name
  show_detail_page(id_annonce){
    const link = '/annonces/' + this.id_entreprise + '/' + id_annonce;
    window.location.href = link;
  }

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }

}
