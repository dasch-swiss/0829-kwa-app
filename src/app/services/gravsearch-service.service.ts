import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GravsearchServiceService {

    private static API_BASE_URL_GRAVSEARCH = environment.api + '/v2/searchextended';

  constructor(
      private http: HttpClient
  ) { }

  sendGravsearchRequest( body: string ) {
      return this.http.post(`${GravsearchServiceService.API_BASE_URL_GRAVSEARCH}`, body, {observe: 'response'});
  }
}
