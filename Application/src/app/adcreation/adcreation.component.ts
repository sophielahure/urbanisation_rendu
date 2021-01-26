import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {PhpData} from '../php-data';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {formatNumber} from '@angular/common';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {AuthService} from '../auth/auth.service';


type Keyword = {
  id: number ,
  mot: string
};

@Component({
  selector: 'app-adcreation',
  templateUrl: './adcreation.component.html',
  styleUrls: ['./adcreation.component.css']
})


export class AdcreationComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, public fb: FormBuilder, private service: AuthService) {
    this.uploadForm = this.fb.group({
      image: [null]
    });
  }
  keywords = [];
  // tslint:disable-next-line:variable-name
  parcours_keywords = [];
  parcours_keywordsAPI = [];

  // tslint:disable-next-line:variable-name
  id_entreprise = null;
  // tslint:disable-next-line:variable-name
  keywords_checked = [];
  name = '';
  errorMessageAge = '';
  errorMessageName = '';
  errorMessage = '';
  nb_people = 0;
  entreprise_name = '';

  checked: boolean[] = [];
  filedata: any;


  imageURL: string;
  uploadForm: FormGroup;
  // public uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/Application/src/app/images'});

  keywords_API = [];
  ngOnInit(): void {
    this.id_entreprise = this.route.snapshot.paramMap.get('id_entreprise');
    this.print_all_keywords();
    this.print_all_keywords_API();
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

  get_keywords_API(): Observable<PhpData>{
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_categories_api',
      { withCredentials: true }
    );
  }

  // tslint:disable-next-line:typedef
  print_all_keywords_API(){
    this.get_keywords_API().subscribe(
      reponse => {
        this.keywords_API = reponse.data;
        for (let i = 0 ; i < reponse.data.length; i++){
          const kwAPI = {} as Keyword ;
          kwAPI.id = reponse.data[i].id;
          kwAPI.mot = reponse.data[i].mot;
          this.keywords.push(kwAPI);
          this.parcours_keywordsAPI.push(reponse.data[i].id - 1);
        }

        return reponse;

      }

    );

  }

  // tslint:disable-next-line:typedef
  showPreview(event){
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      image: file
    });
    this.uploadForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  fileEvent(e){
    this.filedata = e.target.files[0];
  }

  onSubmitform(f: NgForm){
    const myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    myFormData.append('image', this.filedata);
    /* Image Post Request */
    this.http.post('http://127.0.0.1:3000/save.php', myFormData, {
      headers: headers
    }).subscribe(data => {
      //Check success message
    });
  }

  get_number_people_targetting(infos): Observable<PhpData>{
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/number_people_targetting_realtime',
      infos,
      {withCredentials: true}
    );
  }


  // tslint:disable-next-line:typedef
  checkCheckBoxvalue(event){
    // tslint:disable-next-line:triple-equals
    if (event.target.checked == true && this.keywords_checked.includes(event.target.id) == false ){
      this.keywords_checked.push(event.target.id);
    }else if (event.target.checked == false && this.keywords_checked.includes(event.target.id) == true ){
      this.keywords_checked.forEach((element, index) => {
        if (element == event.target.id ) { this.keywords_checked.splice(index, 1); }
      });
    }

    let agemin = 0;
    if ( (document.getElementById('fagemin') as HTMLInputElement).value !== '' ){
      agemin = Number((document.getElementById('fagemin') as HTMLInputElement).value);
    }

    let agemax = 150;
    if ( (document.getElementById('fagemax') as HTMLInputElement).value !== '' ){
      agemax = Number((document.getElementById('fagemax') as HTMLInputElement).value);
    }

    const data = {
      agemin: agemin,
      agemax: agemax,
      gender: (document.getElementById('fgender') as HTMLInputElement).value,
      keywords: this.keywords_checked
    }

    this.get_number_people_targetting(data).subscribe(
      message => {
        this.nb_people = message.data;
      }
    );

  }

  get_all_keywords(): Observable<PhpData>{
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/get_keywords',
      { withCredentials: true }
    );
  }

  // tslint:disable-next-line:typedef
  print_all_keywords(){
    this.get_all_keywords().subscribe(
      reponse => {

        for (let i = 0 ; i < reponse.data.length; i++){
          const kw = {} as Keyword ;
          kw.id = reponse.data[i].id;
          kw.mot = reponse.data[i].mot;
          this.keywords.push(kw);
          this.parcours_keywords.push(reponse.data[i].id - 1);
        }
        return reponse;
      }
    );
  }




  create_advertisement(): Observable<PhpData>{
    // tslint:disable-next-line:variable-name
    const keywords_id = this.keywords_checked.map((i) => Number(i));
    const data = {
      id_entreprise : this.id_entreprise,
      keywords : keywords_id,
      name : (document.getElementById('fname') as HTMLInputElement).value,
      photo : (document.getElementById('fphoto') as HTMLInputElement).files[0].name,
      gender : (document.getElementById('fgender') as HTMLInputElement).value,
      agemin : (document.getElementById('fagemin') as HTMLInputElement).value,
      agemax : (document.getElementById('fagemax') as HTMLInputElement).value,
      datedeb : (document.getElementById('fdatedeb') as HTMLInputElement).value,
      datefin : (document.getElementById('fdatefin') as HTMLInputElement).value

    };
    console.log('je suis là dans create');

    console.log((document.getElementById('fgender') as HTMLInputElement).value);
    return this.http.post<PhpData>(
      'http://127.0.0.1:3000/create_new_ad',
      data,                                            // le FormData
      { withCredentials: true }                        // les options de transfert
    );
  }

  // tslint:disable-next-line:typedef
  add_advertisement(){
    const agemin = (document.getElementById('fagemin') as HTMLInputElement).value;
    const agemax = (document.getElementById('fagemax') as HTMLInputElement).value;
    const name = (document.getElementById('fname') as HTMLInputElement).value;
    if (agemin > agemax) {
      this.errorMessageAge = 'L\'age minimum est supérieur à l\'age maximum';
      this.errorMessage = "error";
      // tslint:disable-next-line:triple-equals
      //}else if (name.length == 0){
      //this.errorMessageName='Veuillez entrer un nom pour votre annonce';
      //this.errorMessage = "error";

    }else {
      this.errorMessage='';
      this.create_advertisement().subscribe(
        reponse => {

          return reponse;
        }
      );
    }
  }


  // tslint:disable-next-line:typedef
  show_annonces_page(){
    const link = '/annonces/' + this.id_entreprise;
    // window.open(link);
    window.location.href = link;
  }

  deconnection(): void{
    this.service.send_deconnection().subscribe(
      message => {
        // console.log(message.data);
      }
    );
  }

}
