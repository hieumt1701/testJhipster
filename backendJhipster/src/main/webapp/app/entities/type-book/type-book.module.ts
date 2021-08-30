import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeBookComponent } from './list/type-book.component';
import { TypeBookDetailComponent } from './detail/type-book-detail.component';
import { TypeBookUpdateComponent } from './update/type-book-update.component';
import { TypeBookDeleteDialogComponent } from './delete/type-book-delete-dialog.component';
import { TypeBookRoutingModule } from './route/type-book-routing.module';

@NgModule({
  imports: [SharedModule, TypeBookRoutingModule],
  declarations: [TypeBookComponent, TypeBookDetailComponent, TypeBookUpdateComponent, TypeBookDeleteDialogComponent],
  entryComponents: [TypeBookDeleteDialogComponent],
})
export class TypeBookModule {}
