export interface IHomeBook {
  id?: number;
  tilte?: string | null;
}

export class HomeBook implements IHomeBook {
  constructor(public id?: number, public tilte?: string | null) {}
}

export function getHomeBookIdentifier(book: IHomeBook): number | undefined {
  return book.id;
}
