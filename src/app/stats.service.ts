import { groupBy, mapValues, reduce } from 'lodash';
import { subDays, startOfToday } from 'date-fns';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  AggregatedCountryDaySummary,
  AllCountriesSummary,
  CountryProvinceDaySummary,
} from './models/covid-api';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private static readonly API_BASE_URL = 'https://api.covid19api.com';
  constructor(private readonly httpService: HttpService) {}

  public async getEntireHistoryForCountry(
    countrySlug: string
  ): Promise<AggregatedCountryDaySummary[]> {
    // TODO:; cache results and use in getLastSevenDaysForCountry
    const entireHistory = await this.httpService.get<
      CountryProvinceDaySummary[]
    >(`${StatsService.API_BASE_URL}/dayone/country/${countrySlug}`);
    return this.composeAggregates(entireHistory);
  }

  public async getLastSevenDaysForCountry(
    countrySlug: string
  ): Promise<AggregatedCountryDaySummary[]> {
    const today = startOfToday();
    const weekAgo = subDays(today, 7);
    const lastSevenDays = await this.httpService.get<
      CountryProvinceDaySummary[]
    >(
      `${
        StatsService.API_BASE_URL
      }/dayone/country/${countrySlug}?from=${weekAgo.toISOString()}&to=${today.toISOString()}`
    );
    return this.composeAggregates(lastSevenDays);
  }

  public async getWorldWideSummary(): Promise<AllCountriesSummary> {
    return await this.httpService.get<AllCountriesSummary>(
      `${StatsService.API_BASE_URL}/summary`
    );
  }

  private composeAggregates = (
    history: CountryProvinceDaySummary[]
  ): AggregatedCountryDaySummary[] => {
    const casesByDate = groupBy(history, (x) => x.Date);
    const daySummaries = mapValues(casesByDate, this.aggregateDayResults);
    return Object.values(daySummaries);
  };

  private aggregateDayResults = (
    valuesForDay: CountryProvinceDaySummary[]
  ): AggregatedCountryDaySummary =>
    reduce<AggregatedCountryDaySummary>(valuesForDay, (comp, next) => ({
      ...comp,
      Active: comp.Active + next.Active,
      Confirmed: comp.Confirmed + next.Confirmed,
      Deaths: comp.Deaths + next.Deaths,
      Recovered: comp.Recovered + next.Recovered,
    }));
}
