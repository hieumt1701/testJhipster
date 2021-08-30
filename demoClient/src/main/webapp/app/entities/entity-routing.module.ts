import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'book',
        data: { pageTitle: 'demoClientApp.book.home.title' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'type-book',
        data: { pageTitle: 'demoClientApp.typeBook.home.title' },
        loadChildren: () => import('./type-book/type-book.module').then(m => m.TypeBookModule),
      },
      {
        path: 'author',
        data: { pageTitle: 'demoClientApp.author.home.title' },
        loadChildren: () => import('./author/author.module').then(m => m.AuthorModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'demoClientApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
