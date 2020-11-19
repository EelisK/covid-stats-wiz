import { maxBy } from 'lodash';

export interface IStatsWizDayTotal {
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
  date: string;
}

export interface IStatsWizDayChange {
  newConfirmed: number;
  newDeaths: number;
  newRecovered: number;
  date: string;
}

export interface IStatsWizCountryHistory {
  country: string;
  lastUpdate: string;
  lastWeek: IStatsWizDayChange[];
  dayone: IStatsWizDayTotal[];
}

export class StatsWizCountryHistory implements IStatsWizCountryHistory {
  public readonly country: string;
  public readonly lastUpdate: string;
  public readonly lastWeek: IStatsWizDayChange[];
  public readonly dayone: IStatsWizDayTotal[];

  private readonly latestTotal: IStatsWizDayTotal;
  private readonly latestChange: IStatsWizDayChange;

  constructor(props: IStatsWizCountryHistory) {
    this.lastUpdate = props.lastUpdate;
    this.lastWeek = props.lastWeek;
    this.country = props.country;
    this.dayone = props.dayone;

    this.latestTotal = maxBy(this.dayone, (x) => new Date(x.date));
    this.latestChange = maxBy(this.lastWeek, (x) => new Date(x.date));
  }

  public get activeCases(): number {
    return this.latestTotal.totalConfirmed - this.latestTotal.totalRecovered;
  }
  public get recoveryRate(): number {
    return this.latestTotal.totalRecovered / this.latestTotal.totalConfirmed;
  }
  public get mortalityRate(): number {
    return this.latestTotal.totalDeaths / this.latestTotal.totalRecovered;
  }
  public get totalConfirmed(): number {
    return this.latestTotal.totalConfirmed;
  }
  public get totalDeaths(): number {
    return this.latestTotal.totalDeaths;
  }
  public get totalRecovered(): number {
    return this.latestTotal.totalRecovered;
  }
  public get newConfirmed(): number {
    return this.latestChange.newConfirmed;
  }
  public get newDeaths(): number {
    return this.latestChange.newDeaths;
  }
  public get newRecovered(): number {
    return this.latestChange.newRecovered;
  }
}
