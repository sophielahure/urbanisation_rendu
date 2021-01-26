import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {AuthService} from '../auth/auth.service';

interface Keyword {
  id: number;
  name: string;
}

@Component({
  selector: 'app-annonce',
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})


export class AnnonceComponent implements OnInit {

  id_entreprise = null;
  id_ciblage = null;
  details = null;
  keywords: Keyword[];
  keywords_id = null;
  imageURL = '';
  entreprise_name = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private service: AuthService) { }

  ngOnInit(): void {
    this.id_ciblage = this.route.snapshot.paramMap.get('id_annonce');
    this.id_entreprise = this.route.snapshot.paramMap.get('id_entreprise');
    this.print_details();
    this.getCompanyName();
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


  get_details(): Observable<PhpData>{
    const data = {
      id_ciblage : this.id_ciblage
    };
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_details',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }



  // tslint:disable-next-line:typedef
  print_details(){
    this.get_details().subscribe(
      reponse => {
        this.details = reponse.data[0];
        this.keywords = reponse.data[1];
        return reponse;
      }
    );

  }

  // tslint:disable-next-line:variable-name
  get_category_name(id_cat): Observable<PhpData>{
    const data = {
      id_category : id_cat
    };
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_category_name',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  // tslint:disable-next-line:typedef variable-name
  print_category_name(id_cat){
    this.get_category_name(id_cat).subscribe(
      reponse => {
        return reponse;
      }
    );

  }

  delete_advertisement(): Observable<PhpData>{
    const data = {
      id_ciblage : this.id_ciblage
    };
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/delete_advertisement',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  // tslint:disable-next-line:typedef
  delete_and_back_to_index(){
    this.delete_advertisement().subscribe(
      reponse => {
        return reponse;
      }
    );
  }

  // tslint:disable-next-line:typedef
  show_annonces_page(){
    const link = '/annonces/' + this.id_entreprise;
    // window.open(link);
    window.location.href = link;
  }

  // tslint:disable-next-line:typedef
  show_modification_page(){
    const link = '/annonces/' + this.id_entreprise + '/' + this.id_ciblage + '/modification';
    window.location.href = link;
  }

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }

}
