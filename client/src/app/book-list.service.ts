import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Book} from './book-list';
import {Transaction} from './book-list';
import 'rxjs/add/operator/map';

@Injectable()
export class BookListService {

  constructor(private http: Http) { }


  //retrieve books
  getBooks(){
    return this.http.get('http://localhost:3000')
      .map(res => res.json());
  }

  //add book
  addBook(newBook){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/insert', newBook, {headers:headers})
      .map(res => res.json());
  }

  //delete
  deleteBook(id){
    return this.http.delete('http://localhost:3000/delete/' + id)
      .map(res => res.json());
  }

  //update
  updateBook(id, data){
    var headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post('http://localhost:3000/update/' + id, data, {headers:headers})
      .map(res => res.json());
  }


// ------------transactions-------------//


  //issue
  issueBook(id, data){
    var headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post('http://localhost:3000/issue/' + id, data, {headers:headers})
      .map(res => res.json());
  }

  //return
  returnBook(id, data){
    var headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post('http://localhost:3000/return/' + id, data, {headers:headers})
      .map(res => res.json());
  }

  //get all transactions
  getTransactions(){
    return this.http.get('http://localhost:3000/transactions')
      .map(res => res.json());
  }



}
