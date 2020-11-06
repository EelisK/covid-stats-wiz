import { Component, OnInit } from '@angular/core';
import { Awaitable } from '../models/awaitable.model';
import { AllCountriesSummary, CountrySummary } from '../models/covid-api';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  private countriesSummary: Awaitable<AllCountriesSummary>;
  constructor(private readonly statsService: StatsService) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.countriesSummary = { state: 'loading' };
      const summary = await this.statsService.getWorldWideSummary();
      this.countriesSummary = {
        state: 'success',
        data: summary,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.countriesSummary = { state: 'error', error };
    }
  }

  public getCountries(): CountrySummary[] {
    if (this.countriesSummary?.state === 'success') {
      return this.countriesSummary.data.Countries;
    } else {
      return [];
    }
  }

  public isLoading(): boolean {
    return this.countriesSummary?.state === 'loading';
  }

  public isError(): boolean {
    return this.countriesSummary?.state === 'error';
  }

  public isSuccess(): boolean {
    return this.countriesSummary?.state === 'success';
  }

  public getError(): string {
    if (this.countriesSummary?.state === 'error') {
      return this.countriesSummary.error.message;
    } else {
      return null;
    }
  }
}
