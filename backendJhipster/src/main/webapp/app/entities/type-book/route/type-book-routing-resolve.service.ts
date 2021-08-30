import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeBook, TypeBook } from '../type-book.model';
import { TypeBookService } from '../service/type-book.service';

@Injectable({ providedIn: 'root' })
export class TypeBookRoutingResolveService implements Resolve<ITypeBook> {
  constructor(protected service: TypeBookService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeBook> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeBook: HttpResponse<TypeBook>) => {
          if (typeBook.body) {
            return of(typeBook.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeBook());
  }
}
