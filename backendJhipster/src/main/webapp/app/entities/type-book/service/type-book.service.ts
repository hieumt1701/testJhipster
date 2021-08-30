import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeBook, getTypeBookIdentifier } from '../type-book.model';

export type EntityResponseType = HttpResponse<ITypeBook>;
export type EntityArrayResponseType = HttpResponse<ITypeBook[]>;

@Injectable({ providedIn: 'root' })
export class TypeBookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-books');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeBook: ITypeBook): Observable<EntityResponseType> {
    return this.http.post<ITypeBook>(this.resourceUrl, typeBook, { observe: 'response' });
  }

  update(typeBook: ITypeBook): Observable<EntityResponseType> {
    return this.http.put<ITypeBook>(`${this.resourceUrl}/${getTypeBookIdentifier(typeBook) as number}`, typeBook, { observe: 'response' });
  }

  partialUpdate(typeBook: ITypeBook): Observable<EntityResponseType> {
    return this.http.patch<ITypeBook>(`${this.resourceUrl}/${getTypeBookIdentifier(typeBook) as number}`, typeBook, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeBook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeBook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeBookToCollectionIfMissing(typeBookCollection: ITypeBook[], ...typeBooksToCheck: (ITypeBook | null | undefined)[]): ITypeBook[] {
    const typeBooks: ITypeBook[] = typeBooksToCheck.filter(isPresent);
    if (typeBooks.length > 0) {
      const typeBookCollectionIdentifiers = typeBookCollection.map(typeBookItem => getTypeBookIdentifier(typeBookItem)!);
      const typeBooksToAdd = typeBooks.filter(typeBookItem => {
        const typeBookIdentifier = getTypeBookIdentifier(typeBookItem);
        if (typeBookIdentifier == null || typeBookCollectionIdentifiers.includes(typeBookIdentifier)) {
          return false;
        }
        typeBookCollectionIdentifiers.push(typeBookIdentifier);
        return true;
      });
      return [...typeBooksToAdd, ...typeBookCollection];
    }
    return typeBookCollection;
  }
}
