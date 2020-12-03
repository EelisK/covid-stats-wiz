import { Component, Input, OnInit } from '@angular/core';
import { NewsArticle } from '../models/news';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.scss'],
})
export class NewsArticleComponent implements OnInit {
  @Input() article: NewsArticle;
  constructor() {}

  ngOnInit(): void {}
}
