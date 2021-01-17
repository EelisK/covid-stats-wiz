import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { IStatsWizEntityHistory } from '../models/stats-wiz';

const DEATH_COLOR = '#FF6384';
const RECOVERY_COLOR = '#36A2EB';
const ACTIVE_COLOR = '#FFCE56';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @Input() public summary: IStatsWizEntityHistory;
  public piechartData: any;
  public barchartData: any;
  public linechartData: any;

  ngOnInit(): void {
    this.updatePiechartData();
    this.updateBarchartData();
    this.updateLinechartData();
  }

  private updatePiechartData(): void {
    this.piechartData = {
      labels: ['Dead Cases', 'Recovered Cases', 'Active Cases'],
      datasets: [
        {
          data: [
            this.summary.latestSummary.totalDeaths,
            this.summary.latestSummary.totalRecovered,
            this.summary.latestSummary.totalConfirmed,
          ],
          backgroundColor: [DEATH_COLOR, RECOVERY_COLOR, ACTIVE_COLOR],
        },
      ],
    };
  }

  private updateBarchartData(): void {
    this.barchartData = {
      labels: this.summary.lastWeek.map((x) => this.formatDateString(x.date)),
      datasets: [
        {
          label: 'Daily Deaths',
          data: this.summary.lastWeek.map((day) => day.newDeaths),
          backgroundColor: DEATH_COLOR,
        },
        {
          label: 'Daily Recovered',
          data: this.summary.lastWeek.map((day) => day.newRecovered),
          backgroundColor: RECOVERY_COLOR,
        },
        {
          label: 'Daily New Cases',
          data: this.summary.lastWeek.map((day) => day.newConfirmed),
          backgroundColor: ACTIVE_COLOR,
        },
      ],
    };
  }

  private updateLinechartData(): void {
    this.linechartData = {
      labels: this.summary.dayone.map((x) => this.formatDateString(x.date)),
      datasets: [
        {
          label: 'Total Deaths',
          data: this.summary.dayone.map((x) => x.totalDeaths),
          fill: true,
          backgroundColor: DEATH_COLOR + '77',
          borderColor: DEATH_COLOR,
        },
        {
          label: 'Total Recovered',
          data: this.summary.dayone.map((x) => x.totalRecovered),
          fill: true,
          backgroundColor: RECOVERY_COLOR + '77',
          borderColor: RECOVERY_COLOR,
        },
        {
          label: 'Total Cases',
          data: this.summary.dayone.map((x) => x.totalConfirmed),
          fill: true,
          backgroundColor: ACTIVE_COLOR + '77',
          borderColor: ACTIVE_COLOR,
        },
      ],
    };
  }

  private formatDateString = (date: string): string =>
    format(new Date(date), 'd, MMM');
}
