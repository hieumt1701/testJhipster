import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeBook } from '../type-book.model';

@Component({
  selector: 'jhi-type-book-detail',
  templateUrl: './type-book-detail.component.html',
})
export class TypeBookDetailComponent implements OnInit {
  typeBook: ITypeBook | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeBook }) => {
      this.typeBook = typeBook;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
