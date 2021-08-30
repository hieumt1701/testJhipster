import { IBook } from 'app/entities/book/book.model';

export interface ITypeBook {
  id?: number;
  name?: string | null;
  books?: IBook[] | null;
}

export class TypeBook implements ITypeBook {
  constructor(public id?: number, public name?: string | null, public books?: IBook[] | null) {}
}

export function getTypeBookIdentifier(typeBook: ITypeBook): number | undefined {
  return typeBook.id;
}
