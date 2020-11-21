import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { AllCountriesSummary, CountrySummary } from '../models/covid-api';
import { StatsWizEntityHistory } from '../models/stats-wiz';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss'],
})
export class GlobalComponent implements OnInit {
  public countriesSummary: Awaitable<AllCountriesSummary>;
  public worldWideHistory: Awaitable<StatsWizEntityHistory>;
  constructor(
    private readonly statsService: StatsService,
    public readonly commonService: CommonService
  ) {}

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.updateWorldWideHistory(),
      this.updateWorldWideSummary(),
    ]);
  }

  private async updateWorldWideSummary(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getWorldWideSummary()
    )) {
      this.countriesSummary = result;
    }
  }

  private async updateWorldWideHistory(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getWorldWideHistory()
    )) {
      this.worldWideHistory = result;
    }
  }

  public get history(): StatsWizEntityHistory {
    if (this.commonService.isSuccess(this.worldWideHistory)) {
      return this.worldWideHistory.data;
    } else {
      throw new Error('History not fetched');
    }
  }

  public get countries(): CountrySummary[] {
    if (this.commonService.isSuccess(this.countriesSummary)) {
      return this.countriesSummary.data.Countries;
    } else {
      return [];
    }
  }

  public get error(): string | null {
    if (this.commonService.isError(this.countriesSummary)) {
      return this.countriesSummary.error.message;
    } else if (this.commonService.isError(this.worldWideHistory)) {
      return this.worldWideHistory.error.message;
    } else {
      return null;
    }
  }
}
