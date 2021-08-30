import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeBookService } from '../home-book.service';
import { IHomeBook } from '../home-book.model';

@Component({
  selector: 'jhi-detail-book',
  templateUrl: './detail-book.component.html',
  styleUrls: ['./detail-book.component.scss'],
})
export class DetailBookComponent implements OnInit {
  test: any;
  bookId: any;
  bookDetail: IHomeBook | null = null;
  constructor(private route: ActivatedRoute, protected homeBookService: HomeBookService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(pr => {
      this.bookId = pr.get('id');
    });

    this.homeBookService.find(this.bookId).subscribe(res => {
      this.bookDetail = res.body;
    });
  }
}
