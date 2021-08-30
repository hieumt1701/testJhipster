import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ListBookComponent } from './list-book/list-book.component';
import { DetailBookComponent } from './detail-book/detail-book.component';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

const contactRoute: Routes = [
  {
    path: 'list-book',
    component: ListBookComponent,
    data: {
      pageTitle: 'demoClientApp.book.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'detail-book/:id',
    component: DetailBookComponent,
    data: {
      pageTitle: 'demoClientApp.book.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(contactRoute)],
  declarations: [ListBookComponent, DetailBookComponent],
})
export class HomeBookModule {}
