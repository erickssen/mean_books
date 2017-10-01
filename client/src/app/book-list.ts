
export class Book {
  book_name: string;
  author?: string;
  isbn?: number;
  quantity?: number;
  publish_date?: Date;
  category?: string;
  books_issued?: number;
  _id:any;
}

export class Transaction {
  b_name: string;
  book_id: any;
  date: Date;
  state: string;
}
