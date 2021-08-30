jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BookService } from '../service/book.service';
import { IBook, Book } from '../book.model';
import { ITypeBook } from 'app/entities/type-book/type-book.model';
import { TypeBookService } from 'app/entities/type-book/service/type-book.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';

import { BookUpdateComponent } from './book-update.component';

describe('Component Tests', () => {
  describe('Book Management Update Component', () => {
    let comp: BookUpdateComponent;
    let fixture: ComponentFixture<BookUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bookService: BookService;
    let typeBookService: TypeBookService;
    let authorService: AuthorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BookUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BookUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bookService = TestBed.inject(BookService);
      typeBookService = TestBed.inject(TypeBookService);
      authorService = TestBed.inject(AuthorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call TypeBook query and add missing value', () => {
        const book: IBook = { id: 456 };
        const typeBooks: ITypeBook[] = [{ id: 21871 }];
        book.typeBooks = typeBooks;

        const typeBookCollection: ITypeBook[] = [{ id: 46071 }];
        jest.spyOn(typeBookService, 'query').mockReturnValue(of(new HttpResponse({ body: typeBookCollection })));
        const additionalTypeBooks = [...typeBooks];
        const expectedCollection: ITypeBook[] = [...additionalTypeBooks, ...typeBookCollection];
        jest.spyOn(typeBookService, 'addTypeBookToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(typeBookService.query).toHaveBeenCalled();
        expect(typeBookService.addTypeBookToCollectionIfMissing).toHaveBeenCalledWith(typeBookCollection, ...additionalTypeBooks);
        expect(comp.typeBooksSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Author query and add missing value', () => {
        const book: IBook = { id: 456 };
        const author: IAuthor = { id: 47336 };
        book.author = author;

        const authorCollection: IAuthor[] = [{ id: 29185 }];
        jest.spyOn(authorService, 'query').mockReturnValue(of(new HttpResponse({ body: authorCollection })));
        const additionalAuthors = [author];
        const expectedCollection: IAuthor[] = [...additionalAuthors, ...authorCollection];
        jest.spyOn(authorService, 'addAuthorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(authorService.query).toHaveBeenCalled();
        expect(authorService.addAuthorToCollectionIfMissing).toHaveBeenCalledWith(authorCollection, ...additionalAuthors);
        expect(comp.authorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const book: IBook = { id: 456 };
        const typeBooks: ITypeBook = { id: 20178 };
        book.typeBooks = [typeBooks];
        const author: IAuthor = { id: 5685 };
        book.author = author;

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(book));
        expect(comp.typeBooksSharedCollection).toContain(typeBooks);
        expect(comp.authorsSharedCollection).toContain(author);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = { id: 123 };
        jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: book }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bookService.update).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = new Book();
        jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: book }));
        saveSubject.complete();

        // THEN
        expect(bookService.create).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = { id: 123 };
        jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bookService.update).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTypeBookById', () => {
        it('Should return tracked TypeBook primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTypeBookById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAuthorById', () => {
        it('Should return tracked Author primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAuthorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedTypeBook', () => {
        it('Should return option if no TypeBook is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedTypeBook(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected TypeBook for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedTypeBook(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this TypeBook is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedTypeBook(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
