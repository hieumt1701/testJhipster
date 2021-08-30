import { Component, OnInit } from '@angular/core';
import { IHomeBook } from '../home-book.model';
import { BookService } from '../../entities/book/service/book.service';
import { HomeBookService } from '../home-book.service';

@Component({
  selector: 'jhi-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.scss'],
})
export class ListBookComponent implements OnInit {
  test: any;
  listBook: IHomeBook[] | null = null;

  constructor(protected bookService: HomeBookService) {}

  ngOnInit(): void {
    this.bookService.query().subscribe(res => {
      this.listBook = res.body;
    });
  }
}
