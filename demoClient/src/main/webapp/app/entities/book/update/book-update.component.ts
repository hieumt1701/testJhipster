import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBook, Book } from '../book.model';
import { BookService } from '../service/book.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITypeBook } from 'app/entities/type-book/type-book.model';
import { TypeBookService } from 'app/entities/type-book/service/type-book.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;

  typeBooksSharedCollection: ITypeBook[] = [];
  authorsSharedCollection: IAuthor[] = [];

  editForm = this.fb.group({
    id: [],
    tilte: [],
    des: [],
    image: [],
    imageContentType: [],
    dob: [],
    cv: [],
    cvContentType: [],
    typeBooks: [],
    author: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected bookService: BookService,
    protected typeBookService: TypeBookService,
    protected authorService: AuthorService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      if (book.id === undefined) {
        const today = dayjs().startOf('day');
        book.dob = today;
      }

      this.updateForm(book);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('demoClientApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  trackTypeBookById(index: number, item: ITypeBook): number {
    return item.id!;
  }

  trackAuthorById(index: number, item: IAuthor): number {
    return item.id!;
  }

  getSelectedTypeBook(option: ITypeBook, selectedVals?: ITypeBook[]): ITypeBook {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
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

  protected updateForm(book: IBook): void {
    this.editForm.patchValue({
      id: book.id,
      tilte: book.tilte,
      des: book.des,
      image: book.image,
      imageContentType: book.imageContentType,
      dob: book.dob ? book.dob.format(DATE_TIME_FORMAT) : null,
      cv: book.cv,
      cvContentType: book.cvContentType,
      typeBooks: book.typeBooks,
      author: book.author,
    });

    this.typeBooksSharedCollection = this.typeBookService.addTypeBookToCollectionIfMissing(
      this.typeBooksSharedCollection,
      ...(book.typeBooks ?? [])
    );
    this.authorsSharedCollection = this.authorService.addAuthorToCollectionIfMissing(this.authorsSharedCollection, book.author);
  }

  protected loadRelationshipsOptions(): void {
    this.typeBookService
      .query()
      .pipe(map((res: HttpResponse<ITypeBook[]>) => res.body ?? []))
      .pipe(
        map((typeBooks: ITypeBook[]) =>
          this.typeBookService.addTypeBookToCollectionIfMissing(typeBooks, ...(this.editForm.get('typeBooks')!.value ?? []))
        )
      )
      .subscribe((typeBooks: ITypeBook[]) => (this.typeBooksSharedCollection = typeBooks));

    this.authorService
      .query()
      .pipe(map((res: HttpResponse<IAuthor[]>) => res.body ?? []))
      .pipe(map((authors: IAuthor[]) => this.authorService.addAuthorToCollectionIfMissing(authors, this.editForm.get('author')!.value)))
      .subscribe((authors: IAuthor[]) => (this.authorsSharedCollection = authors));
  }

  protected createFromForm(): IBook {
    return {
      ...new Book(),
      id: this.editForm.get(['id'])!.value,
      tilte: this.editForm.get(['tilte'])!.value,
      des: this.editForm.get(['des'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      dob: this.editForm.get(['dob'])!.value ? dayjs(this.editForm.get(['dob'])!.value, DATE_TIME_FORMAT) : undefined,
      cvContentType: this.editForm.get(['cvContentType'])!.value,
      cv: this.editForm.get(['cv'])!.value,
      typeBooks: this.editForm.get(['typeBooks'])!.value,
      author: this.editForm.get(['author'])!.value,
    };
  }
}
