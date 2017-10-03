import { Component, OnInit } from '@angular/core';
import { BookListService } from '../book-list.service';
import { Book } from '../book-list';
import { Transaction } from '../book-list';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  providers: [BookListService]
})

export class BookListComponent implements OnInit {

  //Book class variables
  books: Book[];
  book_name: String;
  author: String;
  isbn: Number;
  quantity: any;
  publish_date: Date;
  category: String;
  books_issued: any;
  bookUpdate: Book;

  //Transaction variables
  transactions: Transaction[];
  b_name: string;
  book_id: any;
  date: Date;
  state: String;


  //constructor with http service injected
  constructor(private bookListService: BookListService) {
  this.bookUpdate = null;
  }

  update(book){
    this.bookUpdate = book;
  }

  //gets all books
  ngOnInit() {
    this.bookListService.getTransactions()
      .subscribe(transactions => this.transactions = transactions)

    this.bookListService.getBooks()
      .subscribe(books => this.books = books);
  }



//-------books--------

  addBook(){
    const newBook = {
      book_name: this.book_name,
      author: this.author,
      isbn: this.isbn,
      quantity: this.quantity,
      publish_date: this.publish_date,
      category: this.category,
      books_issued: this.books_issued
    }
    this.bookListService.addBook(newBook)
      .subscribe(book => {
        this.books.push(book);
      });
  }

  //Delete book
  deleteBook(id:any, book:any){
    var books = this.books;
    this.bookListService.deleteBook(id, book)
      .subscribe(data =>{
        if(data.n == 1){
          for(var i = 0; i < books.length; i++){
            if(books[i]._id == id){
              books.splice(i,1);
            }
          }
        }
      })
  }

  //update
  updateBook(id:any, data:any){
      if(data.quantity > 0){
          var books = this.books;
          this.bookUpdate = null;
          this.bookListService.updateBook(id, data)
          .subscribe(data =>{
          })
      }
  }

//----Transactions-----


  //issue
  issueBook(id:any, data:Book){
    if(data.quantity > 0){
        data.quantity--;
        data.books_issued++;
        this.bookListService.issueBook(id, data)
          .subscribe(data =>{
            this.transactions.push(data);
          })
      }
  }

  //return
  returnBook(id:any, data:Transaction){
      var books = this.books;
      var t_book_id = data.book_id;
      data.state = 'returned';

      for (var i; i < books.length; i++){
        if(this.books[i]._id == t_book_id){
          books[i].quantity++;
          books[i].books_issued--;
        }
      }
      this.bookListService.returnBook(id, data)
        .subscribe(data =>{
        })
  }




}
