import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { CountryDetails } from '../models/covid-api';
import { NewsArticle } from '../models/news';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public news: NewsArticle;
  private countriesDetails: Awaitable<CountryDetails[]> = { state: 'loading' };
  constructor(
    authService: AuthService,
    private readonly statsService: StatsService,
    public readonly commonService: CommonService
  ) {
    this.news = {
      userId: authService.user.uid,
      date: new Date(),
      countrySlug: null,
      description: '',
      title: '',
    };
  }

  public async ngOnInit(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getCountriesList()
    )) {
      this.countriesDetails = result;
    }
  }

  public get countries(): CountryDetails[] {
    if (this.commonService.isSuccess(this.countriesDetails)) {
      return [
        { Slug: null, Country: 'Worldwide', ISO2: '' },
        ...this.countriesDetails.data,
      ];
    } else {
      return [];
    }
  }
}
