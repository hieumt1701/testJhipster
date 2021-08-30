jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITypeBook, TypeBook } from '../type-book.model';
import { TypeBookService } from '../service/type-book.service';

import { TypeBookRoutingResolveService } from './type-book-routing-resolve.service';

describe('Service Tests', () => {
  describe('TypeBook routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TypeBookRoutingResolveService;
    let service: TypeBookService;
    let resultTypeBook: ITypeBook | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TypeBookRoutingResolveService);
      service = TestBed.inject(TypeBookService);
      resultTypeBook = undefined;
    });

    describe('resolve', () => {
      it('should return ITypeBook returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeBook = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeBook).toEqual({ id: 123 });
      });

      it('should return new ITypeBook if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeBook = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTypeBook).toEqual(new TypeBook());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeBook })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeBook = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeBook).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
