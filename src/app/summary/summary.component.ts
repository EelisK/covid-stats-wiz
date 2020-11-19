import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { AllCountriesSummary, CountrySummary } from '../models/covid-api';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  public countriesSummary: Awaitable<AllCountriesSummary>;
  constructor(
    private readonly statsService: StatsService,
    public readonly commonService: CommonService
  ) {}

  public async ngOnInit(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getWorldWideSummary()
    )) {
      this.countriesSummary = result;
    }
  }

  public getCountries(): CountrySummary[] {
    if (this.commonService.isSuccess(this.countriesSummary)) {
      return this.countriesSummary.data.Countries;
    } else {
      return [];
    }
  }

  public getError(): string | null {
    if (this.commonService.isError(this.countriesSummary)) {
      return this.countriesSummary.error.message;
    } else {
      return null;
    }
  }
}
