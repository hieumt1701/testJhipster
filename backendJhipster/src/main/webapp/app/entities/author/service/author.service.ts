import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthor, getAuthorIdentifier } from '../author.model';

export type EntityResponseType = HttpResponse<IAuthor>;
export type EntityArrayResponseType = HttpResponse<IAuthor[]>;

@Injectable({ providedIn: 'root' })
export class AuthorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/authors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(author: IAuthor): Observable<EntityResponseType> {
    return this.http.post<IAuthor>(this.resourceUrl, author, { observe: 'response' });
  }

  update(author: IAuthor): Observable<EntityResponseType> {
    return this.http.put<IAuthor>(`${this.resourceUrl}/${getAuthorIdentifier(author) as number}`, author, { observe: 'response' });
  }

  partialUpdate(author: IAuthor): Observable<EntityResponseType> {
    return this.http.patch<IAuthor>(`${this.resourceUrl}/${getAuthorIdentifier(author) as number}`, author, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAuthor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAuthor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuthorToCollectionIfMissing(authorCollection: IAuthor[], ...authorsToCheck: (IAuthor | null | undefined)[]): IAuthor[] {
    const authors: IAuthor[] = authorsToCheck.filter(isPresent);
    if (authors.length > 0) {
      const authorCollectionIdentifiers = authorCollection.map(authorItem => getAuthorIdentifier(authorItem)!);
      const authorsToAdd = authors.filter(authorItem => {
        const authorIdentifier = getAuthorIdentifier(authorItem);
        if (authorIdentifier == null || authorCollectionIdentifiers.includes(authorIdentifier)) {
          return false;
        }
        authorCollectionIdentifiers.push(authorIdentifier);
        return true;
      });
      return [...authorsToAdd, ...authorCollection];
    }
    return authorCollection;
  }
}
