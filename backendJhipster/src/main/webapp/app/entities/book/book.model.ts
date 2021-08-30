import * as dayjs from 'dayjs';
import { ITypeBook } from 'app/entities/type-book/type-book.model';
import { IAuthor } from 'app/entities/author/author.model';

export interface IBook {
  id?: number;
  tilte?: string | null;
  des?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  dob?: dayjs.Dayjs | null;
  cvContentType?: string | null;
  cv?: string | null;
  typeBooks?: ITypeBook[] | null;
  author?: IAuthor | null;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public tilte?: string | null,
    public des?: string | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public dob?: dayjs.Dayjs | null,
    public cvContentType?: string | null,
    public cv?: string | null,
    public typeBooks?: ITypeBook[] | null,
    public author?: IAuthor | null
  ) {}
}

export function getBookIdentifier(book: IBook): number | undefined {
  return book.id;
}
