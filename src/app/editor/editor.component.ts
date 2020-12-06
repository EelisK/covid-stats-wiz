import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { CountryDetails } from '../models/covid-api';
import { NewsArticle } from '../models/news';
import { NewsService } from '../news.service';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public news: NewsArticle = {} as any;
  private countriesDetails: Awaitable<CountryDetails[]> = { state: 'loading' };
  constructor(
    private readonly authService: AuthService,
    private readonly statsService: StatsService,
    private readonly newsService: NewsService,
    public readonly commonService: CommonService
  ) {}

  public async ngOnInit(): Promise<void> {
    const user = await this.authService.getUser();
    this.news = {
      userId: user.uid,
      date: new Date(),
      countrySlug: null,
      description: '',
      title: '',
    };
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getCountriesList()
    )) {
      this.countriesDetails = result;
    }
  }

  public async onSubmit(): Promise<void> {
    await this.newsService.addNews(this.news);
  }

  public get countries(): CountryDetails[] {
    if (this.commonService.isSuccess(this.countriesDetails)) {
      return [
        { Slug: null, Country: 'Worldwide', ISO2: null },
        ...this.countriesDetails.data,
      ];
    } else {
      return [];
    }
  }
}
