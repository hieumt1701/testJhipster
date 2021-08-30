import { IBook } from 'app/entities/book/book.model';

export interface IAuthor {
  id?: number;
  name?: string | null;
  books?: IBook[] | null;
}

export class Author implements IAuthor {
  constructor(public id?: number, public name?: string | null, public books?: IBook[] | null) {}
}

export function getAuthorIdentifier(author: IAuthor): number | undefined {
  return author.id;
}
