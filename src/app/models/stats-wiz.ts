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

export interface IStatsWizEntitySummary {
  totalConfirmed: number;
  newConfirmed: number;
  activeCases: number;
  totalRecovered: number;
  newRecovered: number;
  recoveryRate: number;
  totalDeaths: number;
  newDeaths: number;
  mortalityRate: number;
}

export interface IStatsWizEntityHistory {
  entityName: string;
  lastUpdate: string;
  lastWeek: IStatsWizDayChange[];
  dayone: IStatsWizDayTotal[];
  latestSummary: IStatsWizEntitySummary;
}

export type IStatsWizFireStoreEntity = Pick<
  IStatsWizEntityHistory,
  'latestSummary' | 'lastUpdate'
>;
