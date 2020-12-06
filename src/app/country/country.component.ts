import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { StatsWizEntityHistory } from '../models/stats-wiz';
import { StatsService } from '../stats.service';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public countrySummary: Awaitable<StatsWizEntityHistory> = {
    state: 'loading',
  };
  public countrySlug: string;

  constructor(
    private readonly statsService: StatsService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      this.countrySlug = paramMap.get('countrySlug');
      await this.tryUpdateSummary();
    });
  }

  public get isLoading(): boolean {
    return this.commonService.isLoading(this.countrySummary);
  }

  public get summary(): StatsWizEntityHistory {
    if (this.commonService.isSuccess(this.countrySummary)) {
      return this.countrySummary.data;
    } else {
      throw new Error('Summary not fetched');
    }
  }

  private async tryUpdateSummary(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.statsService.getStatsWizCountrySummary(this.countrySlug)
    )) {
      this.countrySummary = result;
    }
  }
}
