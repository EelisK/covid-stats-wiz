import { groupBy, mapValues, reduce } from 'lodash';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  AggregatedCountryDaySummary,
  AllCountriesSummary,
  CountryDetails,
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
    // TODO: fetch this from firestore
    const entireHistory = await this.httpService.get<
      CountryProvinceDaySummary[]
    >(`${StatsService.API_BASE_URL}/dayone/country/${countrySlug}`);
    return this.composeAggregates(entireHistory);
  }

  public async getWorldWideSummary(): Promise<AllCountriesSummary> {
    return await this.httpService.get<AllCountriesSummary>(
      `${StatsService.API_BASE_URL}/summary`
    );
  }

  public async getCountriesList(): Promise<CountryDetails[]> {
    return await this.httpService.get<CountryDetails[]>(
      `${StatsService.API_BASE_URL}/countries`
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
