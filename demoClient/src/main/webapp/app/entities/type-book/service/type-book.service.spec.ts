import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeBook, TypeBook } from '../type-book.model';

import { TypeBookService } from './type-book.service';

describe('Service Tests', () => {
  describe('TypeBook Service', () => {
    let service: TypeBookService;
    let httpMock: HttpTestingController;
    let elemDefault: ITypeBook;
    let expectedResult: ITypeBook | ITypeBook[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TypeBookService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TypeBook', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TypeBook()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TypeBook', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TypeBook', () => {
        const patchObject = Object.assign({}, new TypeBook());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TypeBook', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TypeBook', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTypeBookToCollectionIfMissing', () => {
        it('should add a TypeBook to an empty array', () => {
          const typeBook: ITypeBook = { id: 123 };
          expectedResult = service.addTypeBookToCollectionIfMissing([], typeBook);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeBook);
        });

        it('should not add a TypeBook to an array that contains it', () => {
          const typeBook: ITypeBook = { id: 123 };
          const typeBookCollection: ITypeBook[] = [
            {
              ...typeBook,
            },
            { id: 456 },
          ];
          expectedResult = service.addTypeBookToCollectionIfMissing(typeBookCollection, typeBook);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TypeBook to an array that doesn't contain it", () => {
          const typeBook: ITypeBook = { id: 123 };
          const typeBookCollection: ITypeBook[] = [{ id: 456 }];
          expectedResult = service.addTypeBookToCollectionIfMissing(typeBookCollection, typeBook);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeBook);
        });

        it('should add only unique TypeBook to an array', () => {
          const typeBookArray: ITypeBook[] = [{ id: 123 }, { id: 456 }, { id: 67951 }];
          const typeBookCollection: ITypeBook[] = [{ id: 123 }];
          expectedResult = service.addTypeBookToCollectionIfMissing(typeBookCollection, ...typeBookArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const typeBook: ITypeBook = { id: 123 };
          const typeBook2: ITypeBook = { id: 456 };
          expectedResult = service.addTypeBookToCollectionIfMissing([], typeBook, typeBook2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeBook);
          expect(expectedResult).toContain(typeBook2);
        });

        it('should accept null and undefined values', () => {
          const typeBook: ITypeBook = { id: 123 };
          expectedResult = service.addTypeBookToCollectionIfMissing([], null, typeBook, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeBook);
        });

        it('should return initial array if no TypeBook is added', () => {
          const typeBookCollection: ITypeBook[] = [{ id: 123 }];
          expectedResult = service.addTypeBookToCollectionIfMissing(typeBookCollection, undefined, null);
          expect(expectedResult).toEqual(typeBookCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
