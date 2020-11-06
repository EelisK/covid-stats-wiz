import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { startOfToday, subDays } from 'date-fns';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { AggregatedCountryDaySummary } from '../models/covid-api';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  private countryEntireHistory: Awaitable<AggregatedCountryDaySummary[]>;
  constructor(
    private readonly statsService: StatsService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      const countrySlug = paramMap.get('countrySlug');
      await this.tryUpdateSummaries(countrySlug);
    });
  }

  private async tryUpdateSummaries(countrySlug: string): Promise<void> {
    try {
      this.countryEntireHistory = { state: 'loading' };
      if (countrySlug === null) {
        throw new Error('CountrySlug was not provided');
      }
      const summary = await this.statsService.getEntireHistoryForCountry(
        countrySlug
      );
      this.countryEntireHistory = {
        state: 'success',
        data: summary,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.countryEntireHistory = { state: 'error', error };
    }
  }

  public isLoading(): boolean {
    return this.commonService.isLoading(this.countryEntireHistory);
  }

  public getEntireHistory(): AggregatedCountryDaySummary[] {
    if (this.commonService.isSuccess(this.countryEntireHistory)) {
      return this.countryEntireHistory.data;
    } else {
      return [];
    }
  }

  public getLastSevenDays(): AggregatedCountryDaySummary[] {
    const history = this.getEntireHistory();
    const today = startOfToday();
    const weekAgo = subDays(today, 7);
    return history.filter((x) => new Date(x.Date) >= weekAgo);
  }
}
