import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {PhpData} from "../php-data";
import {AuthService} from '../auth/auth.service';
type Keyword = {
  id: number ,
  mot: string
};

@Component({
  selector: 'app-admodification',
  templateUrl: './admodification.component.html',
  styleUrls: ['./admodification.component.css']
})
export class AdmodificationComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  id_entreprise = null;
  // tslint:disable-next-line:variable-name
  id_ciblage = null;
  // tslint:disable-next-line:variable-name
  previous_details = null;
  // tslint:disable-next-line:variable-name
  previous_keywords = null;
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
        this.previous_details = reponse.data[0];
        this.previous_keywords = reponse.data[1];
        return reponse;
      }
    );

  }

  get_modification(): Observable<PhpData>{
    // tslint:disable-next-line:variable-name
    const data = {
      id_ciblage : this.id_ciblage,
      name : (document.getElementById('fname') as HTMLInputElement).value,
      photo : (document.getElementById('fphoto') as HTMLInputElement).value

    };
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/modify_advertisement',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  // tslint:disable-next-line:typedef
  modify_advertisement(){
    this.get_modification().subscribe(
      reponse => {
        return reponse;
      }
    );
  }



  // tslint:disable-next-line:typedef
  show_annonce_page(){
    const link = '/annonces/' + this.id_entreprise + '/' + this.id_ciblage;
    // window.open(link);
    window.location.href = link;
  }

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
      }
    );
  }


}
