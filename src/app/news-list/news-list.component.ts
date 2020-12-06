import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { NewsArticle } from '../models/news';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {
  @Input() countrySlug: string | null;
  private allNews: Awaitable<NewsArticle[]> = { state: 'loading' };
  constructor(
    private readonly commonService: CommonService,
    private readonly newsService: NewsService
  ) {}

  public async ngOnInit(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.newsService.getNewsForCountry(this.countrySlug)
    )) {
      this.allNews = result;
    }
  }

  public get articles(): NewsArticle[] {
    if (this.commonService.isSuccess(this.allNews)) {
      return this.allNews.data;
    } else {
      return [];
    }
  }

  public get isLoading(): boolean {
    return this.commonService.isLoading(this.allNews);
  }
}
