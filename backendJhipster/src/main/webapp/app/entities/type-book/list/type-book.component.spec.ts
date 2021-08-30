import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TypeBookService } from '../service/type-book.service';

import { TypeBookComponent } from './type-book.component';

describe('Component Tests', () => {
  describe('TypeBook Management Component', () => {
    let comp: TypeBookComponent;
    let fixture: ComponentFixture<TypeBookComponent>;
    let service: TypeBookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TypeBookComponent],
      })
        .overrideTemplate(TypeBookComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeBookComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TypeBookService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.typeBooks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
