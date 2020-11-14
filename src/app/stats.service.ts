import { memoize, groupBy, mapValues, reduce, zip, maxBy } from 'lodash';
import { Injectable } from '@angular/core';
import { subDays, startOfToday } from 'date-fns';
import { HttpService } from './http.service';
import {
  AggregatedCountryDaySummary,
  AllCountriesSummary,
  CountryDetails,
  CountryProvinceDaySummary,
  CountrySummary,
} from './models/covid-api';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private static readonly API_BASE_URL = 'https://api.covid19api.com';
  constructor(private readonly httpService: HttpService) {
    this.getCountriesList = memoize(this.getCountriesList.bind(this));
    this.getWorldWideSummary = memoize(this.getWorldWideSummary.bind(this));
    this.getEntireHistoryForCountry = memoize(
      this.getEntireHistoryForCountry.bind(this)
    );
    this.getLastSevenDaysForCountry = memoize(
      this.getLastSevenDaysForCountry.bind(this)
    );
  }

  public async getEntireHistoryForCountry(
    countrySlug: string
  ): Promise<AggregatedCountryDaySummary[]> {
    // TODO: fetch this from firestore
    const entireHistory = await this.httpService.get<
      CountryProvinceDaySummary[]
    >(`${StatsService.API_BASE_URL}/dayone/country/${countrySlug}`);
    return this.composeAggregatesByDate(entireHistory);
  }

  public async getWorldWideSummary(): Promise<AllCountriesSummary> {
    return await this.httpService.get<AllCountriesSummary>(
      `${StatsService.API_BASE_URL}/summary`
    );
  }

  public async getCountryLiveStatus(
    countrySlug: string
  ): Promise<AggregatedCountryDaySummary> {
    const provinces = await this.httpService.get<CountryProvinceDaySummary[]>(
      `${StatsService.API_BASE_URL}/live/country/${countrySlug}`
    );
    const aggregatedResults = this.composeAggregatesByDate(provinces);
    return maxBy(aggregatedResults, (x) => new Date(x.Date));
  }

  public async getCountrySummary(countrySlug: string): Promise<CountrySummary> {
    // unfortunately, there is no endpoint for a single country
    const world = await this.getWorldWideSummary();
    const country = world.Countries.find(({ Slug }) => Slug === countrySlug);
    if (!country) {
      throw new Error(`No summary found for country ${countrySlug}`);
    }
    return country;
  }

  public async getLastSevenDaysForCountry(countrySlug: string): Promise<any> {
    const entireHistory = await this.getEntireHistoryForCountry(countrySlug);
    const today = startOfToday();
    const eightDaysAgo = subDays(today, 8);
    const lastEightDays = entireHistory.filter(
      (x) => new Date(x.Date) >= eightDaysAgo
    );
    return this.calculateDailyChanges(lastEightDays);
  }

  public async getCountriesList(): Promise<CountryDetails[]> {
    return await this.httpService.get<CountryDetails[]>(
      `${StatsService.API_BASE_URL}/countries`
    );
  }

  private calculateDailyChanges = (
    from: AggregatedCountryDaySummary[]
  ): AggregatedCountryDaySummary[] => {
    const tail = from.slice(1);
    const references = from.slice(0, tail.length);
    return zip(references, tail).map(([oldPoint, newPoint]) =>
      this.combineAggregates(newPoint, oldPoint, (n, o) => n - o)
    );
  };

  private composeAggregatesByDate = (
    history: CountryProvinceDaySummary[]
  ): AggregatedCountryDaySummary[] => {
    const casesByDate = groupBy(history, (x) => x.Date);
    const daySummaries = mapValues(casesByDate, this.aggregateResultFromDay);
    return Object.values(daySummaries);
  };

  private aggregateResultFromDay = (
    valuesForDay: CountryProvinceDaySummary[]
  ): AggregatedCountryDaySummary =>
    reduce<AggregatedCountryDaySummary>(valuesForDay, (comp, next) =>
      this.combineAggregates(comp, next, (x, y) => x + y)
    );

  private combineAggregates = (
    first: AggregatedCountryDaySummary,
    second: AggregatedCountryDaySummary,
    operation: (x: number, y: number) => number
  ): AggregatedCountryDaySummary => ({
    ...first,
    Active: operation(first.Active, second.Active),
    Confirmed: operation(first.Confirmed, second.Confirmed),
    Deaths: operation(first.Deaths, second.Deaths),
    Recovered: operation(first.Recovered, second.Recovered),
  });
}
