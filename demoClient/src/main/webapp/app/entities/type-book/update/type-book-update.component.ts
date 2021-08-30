import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeBook, TypeBook } from '../type-book.model';
import { TypeBookService } from '../service/type-book.service';

@Component({
  selector: 'jhi-type-book-update',
  templateUrl: './type-book-update.component.html',
})
export class TypeBookUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected typeBookService: TypeBookService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeBook }) => {
      this.updateForm(typeBook);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeBook = this.createFromForm();
    if (typeBook.id !== undefined) {
      this.subscribeToSaveResponse(this.typeBookService.update(typeBook));
    } else {
      this.subscribeToSaveResponse(this.typeBookService.create(typeBook));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeBook>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(typeBook: ITypeBook): void {
    this.editForm.patchValue({
      id: typeBook.id,
      name: typeBook.name,
    });
  }

  protected createFromForm(): ITypeBook {
    return {
      ...new TypeBook(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
