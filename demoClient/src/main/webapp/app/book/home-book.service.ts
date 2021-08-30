import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHomeBook } from './home-book.model';

export type EntityResponseType = HttpResponse<IHomeBook>;
export type EntityArrayResponseType = HttpResponse<IHomeBook[]>;

@Injectable({ providedIn: 'root' })
export class HomeBookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/books');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHomeBook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHomeBook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
