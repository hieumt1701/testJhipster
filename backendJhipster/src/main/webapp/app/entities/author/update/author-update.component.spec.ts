jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AuthorService } from '../service/author.service';
import { IAuthor, Author } from '../author.model';

import { AuthorUpdateComponent } from './author-update.component';

describe('Component Tests', () => {
  describe('Author Management Update Component', () => {
    let comp: AuthorUpdateComponent;
    let fixture: ComponentFixture<AuthorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let authorService: AuthorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuthorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AuthorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuthorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      authorService = TestBed.inject(AuthorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const author: IAuthor = { id: 456 };

        activatedRoute.data = of({ author });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(author));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Author>>();
        const author = { id: 123 };
        jest.spyOn(authorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ author });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: author }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(authorService.update).toHaveBeenCalledWith(author);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Author>>();
        const author = new Author();
        jest.spyOn(authorService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ author });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: author }));
        saveSubject.complete();

        // THEN
        expect(authorService.create).toHaveBeenCalledWith(author);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Author>>();
        const author = { id: 123 };
        jest.spyOn(authorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ author });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(authorService.update).toHaveBeenCalledWith(author);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
