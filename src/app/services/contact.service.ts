import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private API_URL=`${environment.apiUrl}/contact`;
  constructor(private http:HttpClient) { }

  contacto(contacto:any):Observable<any>{
    return this.http.post(`${this.API_URL}`,contacto)
  }
}
