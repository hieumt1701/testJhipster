import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthorService } from '../service/author.service';

import { AuthorComponent } from './author.component';

describe('Component Tests', () => {
  describe('Author Management Component', () => {
    let comp: AuthorComponent;
    let fixture: ComponentFixture<AuthorComponent>;
    let service: AuthorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuthorComponent],
      })
        .overrideTemplate(AuthorComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuthorComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AuthorService);

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
      expect(comp.authors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
