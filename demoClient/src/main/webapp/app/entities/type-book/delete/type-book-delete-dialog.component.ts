import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeBook } from '../type-book.model';
import { TypeBookService } from '../service/type-book.service';

@Component({
  templateUrl: './type-book-delete-dialog.component.html',
})
export class TypeBookDeleteDialogComponent {
  typeBook?: ITypeBook;

  constructor(protected typeBookService: TypeBookService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeBookService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
