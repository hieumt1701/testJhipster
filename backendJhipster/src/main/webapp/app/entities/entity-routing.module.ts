import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'book',
        data: { pageTitle: 'backendJhipsterApp.book.home.title' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'type-book',
        data: { pageTitle: 'backendJhipsterApp.typeBook.home.title' },
        loadChildren: () => import('./type-book/type-book.module').then(m => m.TypeBookModule),
      },
      {
        path: 'author',
        data: { pageTitle: 'backendJhipsterApp.author.home.title' },
        loadChildren: () => import('./author/author.module').then(m => m.AuthorModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
