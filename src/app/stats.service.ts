import { memoize } from 'lodash';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { subDays, startOfToday, isEqual as datesMatch } from 'date-fns';
import { HttpService } from './http.service';
import {
  AllCountriesSummary,
  CountryDetails,
  DayOneCell,
} from './models/covid-api';
import {
  IStatsWizCountryHistory,
  StatsWizCountryHistory,
} from './models/stats-wiz';
import {
  calculateDailyChanges,
  aggregateHistoryByDate,
} from './stats.adapters';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private static readonly API_BASE_URL = 'https://api.covid19api.com';
  constructor(
    private readonly httpService: HttpService,
    private readonly firestore: AngularFirestore
  ) {
    this.getCountriesList = memoize(this.getCountriesList.bind(this));
    this.getWorldWideSummary = memoize(this.getWorldWideSummary.bind(this));
    this.getStatsWizCountrySummary = memoize(
      this.getStatsWizCountrySummary.bind(this)
    );
  }

  public async getStatsWizCountrySummary(
    countrySlug: string
  ): Promise<StatsWizCountryHistory> {
    const todaysDate = startOfToday();
    const countryDoc = this.firestore.collection('countries').doc(countrySlug);
    const countryDocRef = await countryDoc.ref.get();

    if (countryDocRef.exists) {
      const data = countryDocRef.data() as IStatsWizCountryHistory;
      if (datesMatch(new Date(data.lastUpdate), todaysDate)) {
        return new StatsWizCountryHistory(data);
      }
    }

    const entireHistoryRaw = await this.httpService.get<DayOneCell[]>(
      `${StatsService.API_BASE_URL}/dayone/country/${countrySlug}`
    );
    const entireHistory = aggregateHistoryByDate(entireHistoryRaw);
    const dateEightDaysAgo = subDays(todaysDate, 8);
    const lastEightDaysHistory = entireHistory.filter(
      (x) => new Date(x.date) >= dateEightDaysAgo
    );
    const lastWeek = calculateDailyChanges(lastEightDaysHistory);
    const [samplePoint] = entireHistoryRaw;
    const country = samplePoint.Country;

    const newData: IStatsWizCountryHistory = {
      lastUpdate: todaysDate.toISOString(),
      lastWeek,
      country,
      dayone: entireHistory,
    };
    await countryDoc.set(newData, { merge: true });

    return new StatsWizCountryHistory(newData);
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
}
