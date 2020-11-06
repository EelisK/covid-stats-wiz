import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private countryLastSevenDays: Awaitable<AggregatedCountryDaySummary[]>;
  constructor(
    private readonly statsService: StatsService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      const countrySlug = paramMap.get('countrySlug');
      await Promise.all([
        // TODO: consider removing last seven days fetching entirely and just deriving it from the entire history
        this.tryUpdateMostRecentData(countrySlug),
        this.tryUpdateSummaries(countrySlug),
      ]);
    });
  }

  private async tryUpdateMostRecentData(countrySlug: string): Promise<void> {
    try {
      this.countryLastSevenDays = { state: 'loading' };
      const data = await this.statsService.getLastSevenDaysForCountry(
        countrySlug
      );
      this.countryLastSevenDays = {
        state: 'success',
        data,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.countryLastSevenDays = { state: 'error', error };
    }
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

  public getEntireHistory(): AggregatedCountryDaySummary[] {
    if (this.commonService.isSuccess(this.countryEntireHistory)) {
      return this.countryEntireHistory.data;
    } else {
      return [];
    }
  }

  public getLastSevenDays(): AggregatedCountryDaySummary[] {
    if (this.commonService.isSuccess(this.countryLastSevenDays)) {
      return this.countryLastSevenDays.data;
    } else {
      return [];
    }
  }
}
