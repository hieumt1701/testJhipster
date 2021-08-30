import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeBookDetailComponent } from './type-book-detail.component';

describe('Component Tests', () => {
  describe('TypeBook Management Detail Component', () => {
    let comp: TypeBookDetailComponent;
    let fixture: ComponentFixture<TypeBookDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TypeBookDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ typeBook: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TypeBookDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TypeBookDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load typeBook on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.typeBook).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
