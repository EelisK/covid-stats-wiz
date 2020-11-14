import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import {
  AggregatedCountryDaySummary,
  CountrySummary,
} from '../models/covid-api';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  private countryEntireHistory: Awaitable<AggregatedCountryDaySummary[]>;
  private countryLastSevenDayChanges: Awaitable<AggregatedCountryDaySummary[]>;
  private countrySummary: Awaitable<CountrySummary>;
  constructor(
    private readonly statsService: StatsService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      const countrySlug = paramMap.get('countrySlug');
      await this.tryUpdateSummaries(countrySlug);
      await this.tryUpdateLastSevendaysData(countrySlug);
      await this.tryUpdateSummary(countrySlug);
    });
  }

  private async tryUpdateSummary(countrySlug: string): Promise<void> {
    try {
      this.countrySummary = { state: 'loading' };
      const summary = await this.statsService.getCountrySummary(countrySlug);
      this.countrySummary = {
        state: 'success',
        data: summary,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.countrySummary = { state: 'error', error };
    }
  }

  private async tryUpdateLastSevendaysData(countrySlug: string): Promise<void> {
    try {
      this.countryLastSevenDayChanges = { state: 'loading' };
      const summary = await this.statsService.getLastSevenDaysForCountry(
        countrySlug
      );
      this.countryLastSevenDayChanges = {
        state: 'success',
        data: summary,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.countryLastSevenDayChanges = { state: 'error', error };
    }
  }

  private async tryUpdateSummaries(countrySlug: string): Promise<void> {
    try {
      this.countryEntireHistory = { state: 'loading' };
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

  public get isLoading(): boolean {
    return (
      this.commonService.isLoading(this.countryEntireHistory) ||
      this.commonService.isLoading(this.countryLastSevenDayChanges) ||
      this.commonService.isLoading(this.countrySummary)
    );
  }

  public get summary(): CountrySummary {
    if (this.commonService.isSuccess(this.countrySummary)) {
      return this.countrySummary.data;
    } else {
      throw new Error('Summary not fetched');
    }
  }

  public get activeCases(): number {
    // TODO: should we deduct the number of dead?
    return this.summary.TotalConfirmed - this.summary.TotalRecovered;
  }

  public get recoveryRate(): number {
    return this.summary.TotalRecovered / this.summary.TotalConfirmed;
  }

  public get mortalityRate(): number {
    return this.summary.TotalDeaths / this.summary.TotalRecovered;
  }

  public get entireHistory(): AggregatedCountryDaySummary[] {
    if (this.commonService.isSuccess(this.countryEntireHistory)) {
      return this.countryEntireHistory.data;
    } else {
      return [];
    }
  }

  public get lastSevenDays(): AggregatedCountryDaySummary[] {
    if (this.commonService.isSuccess(this.countryLastSevenDayChanges)) {
      return this.countryLastSevenDayChanges.data;
    } else {
      return [];
    }
  }
}
