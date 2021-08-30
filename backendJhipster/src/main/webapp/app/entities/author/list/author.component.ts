import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthor } from '../author.model';
import { AuthorService } from '../service/author.service';
import { AuthorDeleteDialogComponent } from '../delete/author-delete-dialog.component';

@Component({
  selector: 'jhi-author',
  templateUrl: './author.component.html',
})
export class AuthorComponent implements OnInit {
  authors?: IAuthor[];
  isLoading = false;

  constructor(protected authorService: AuthorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.authorService.query().subscribe(
      (res: HttpResponse<IAuthor[]>) => {
        this.isLoading = false;
        this.authors = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAuthor): number {
    return item.id!;
  }

  delete(author: IAuthor): void {
    const modalRef = this.modalService.open(AuthorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.author = author;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
