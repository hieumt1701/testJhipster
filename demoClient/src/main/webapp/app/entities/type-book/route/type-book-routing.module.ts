import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeBookComponent } from '../list/type-book.component';
import { TypeBookDetailComponent } from '../detail/type-book-detail.component';
import { TypeBookUpdateComponent } from '../update/type-book-update.component';
import { TypeBookRoutingResolveService } from './type-book-routing-resolve.service';

const typeBookRoute: Routes = [
  {
    path: '',
    component: TypeBookComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeBookDetailComponent,
    resolve: {
      typeBook: TypeBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeBookUpdateComponent,
    resolve: {
      typeBook: TypeBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeBookUpdateComponent,
    resolve: {
      typeBook: TypeBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeBookRoute)],
  exports: [RouterModule],
})
export class TypeBookRoutingModule {}
