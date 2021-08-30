jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TypeBookService } from '../service/type-book.service';
import { ITypeBook, TypeBook } from '../type-book.model';

import { TypeBookUpdateComponent } from './type-book-update.component';

describe('Component Tests', () => {
  describe('TypeBook Management Update Component', () => {
    let comp: TypeBookUpdateComponent;
    let fixture: ComponentFixture<TypeBookUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let typeBookService: TypeBookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TypeBookUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TypeBookUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeBookUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      typeBookService = TestBed.inject(TypeBookService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const typeBook: ITypeBook = { id: 456 };

        activatedRoute.data = of({ typeBook });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(typeBook));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeBook>>();
        const typeBook = { id: 123 };
        jest.spyOn(typeBookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeBook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeBook }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(typeBookService.update).toHaveBeenCalledWith(typeBook);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeBook>>();
        const typeBook = new TypeBook();
        jest.spyOn(typeBookService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeBook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeBook }));
        saveSubject.complete();

        // THEN
        expect(typeBookService.create).toHaveBeenCalledWith(typeBook);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TypeBook>>();
        const typeBook = { id: 123 };
        jest.spyOn(typeBookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeBook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(typeBookService.update).toHaveBeenCalledWith(typeBook);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
