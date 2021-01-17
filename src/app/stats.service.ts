import { sortBy, takeRight, maxBy } from 'lodash';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { subDays, startOfToday, isEqual as datesMatch } from 'date-fns';
import { HttpService } from './http.service';
import {
  AllCountriesSummary,
  CountryDetails,
  GlobalSummary,
  DayOneCell,
} from './models/covid-api';
import {
  IStatsWizFireStoreEntity,
  IStatsWizEntityHistory,
  IStatsWizEntitySummary,
  IStatsWizDayChange,
  IStatsWizDayTotal,
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
  ) {}

  public async getStatsWizCountrySummary(
    countrySlug: string
  ): Promise<IStatsWizEntityHistory> {
    const todaysDate = startOfToday();
    const entireHistoryRaw = await this.httpService.get<DayOneCell[]>(
      `${StatsService.API_BASE_URL}/total/country/${countrySlug}`
    );
    const entireHistory = aggregateHistoryByDate(entireHistoryRaw);
    const dateEightDaysAgo = subDays(todaysDate, 8);
    const lastEightDaysHistory = entireHistory.filter(
      (x) => new Date(x.date) >= dateEightDaysAgo
    );
    const lastWeek = calculateDailyChanges(lastEightDaysHistory);
    const [samplePoint] = entireHistoryRaw;
    const country = samplePoint.Country;
    const latestSummary = await this.getLatestEntitySummary(
      countrySlug,
      entireHistory,
      lastWeek
    );

    return {
      lastUpdate: todaysDate.toISOString(),
      lastWeek,
      entityName: country,
      dayone: entireHistory,
      latestSummary,
    };
  }

  public async getWorldWideHistory(): Promise<IStatsWizEntityHistory> {
    const today = startOfToday();
    const todayISO = today.toISOString();
    /**
     * The /world api endpoint is WIP, and does not return all the necessary details.
     * Thus, we need to annotate the values with assumed dates.
     */
    const wipWorldDataHistory = await this.httpService.get<GlobalSummary[]>(
      `${StatsService.API_BASE_URL}/world`
    );
    const worldWideDataSorted = sortBy(
      wipWorldDataHistory,
      (x) => x.TotalConfirmed
    );
    const worldWideDataAnnotated = worldWideDataSorted.map(
      (point, pointIndex) => ({
        ...point,
        Date: subDays(
          today,
          worldWideDataSorted.length - pointIndex
        ).toISOString(),
      })
    );
    const dayone = worldWideDataAnnotated.map((x) => ({
      date: x.Date,
      totalConfirmed: x.TotalConfirmed,
      totalDeaths: x.TotalDeaths,
      totalRecovered: x.TotalRecovered,
    }));
    const lastWeek = takeRight(worldWideDataAnnotated, 7).map((x) => ({
      date: x.Date,
      newConfirmed: x.NewConfirmed,
      newDeaths: x.NewDeaths,
      newRecovered: x.NewRecovered,
    }));
    const latestSummary = await this.getLatestEntitySummary(
      'worldwide',
      dayone,
      lastWeek
    );
    return {
      lastUpdate: todayISO,
      entityName: 'The World',
      latestSummary,
      lastWeek,
      dayone,
    };
  }

  public async getWorldWideSummary(): Promise<AllCountriesSummary> {
    const summary = await this.httpService.get<AllCountriesSummary>(
      `${StatsService.API_BASE_URL}/summary`
    );
    /**
     * The API uses Message to for communicating exceptional situations.
     * For example: Caching in progress
     */
    if (summary.Message) {
      throw new Error(summary.Message);
    }
    return summary;
  }

  public async getCountriesList(): Promise<CountryDetails[]> {
    return await this.httpService.get<CountryDetails[]>(
      `${StatsService.API_BASE_URL}/countries`
    );
  }

  private async getLatestEntitySummary(
    countrySlugOrAlias: string,
    dailyAggregated: IStatsWizDayTotal[],
    dailyChanges: IStatsWizDayChange[]
  ): Promise<IStatsWizEntitySummary> {
    const todaysDate = startOfToday();
    const countryDoc = this.firestore
      .collection('countries')
      .doc(countrySlugOrAlias);
    const countryDocRef = await countryDoc.ref.get();

    if (countryDocRef.exists) {
      const data = countryDocRef.data() as IStatsWizFireStoreEntity;
      if (datesMatch(new Date(data.lastUpdate), todaysDate)) {
        return data.latestSummary;
      }
    }

    const latestTotal = maxBy(dailyAggregated, (x) => new Date(x.date));
    const latestChange = maxBy(dailyChanges, (x) => new Date(x.date));
    const latestSummary: IStatsWizEntitySummary = {
      activeCases: latestTotal.totalConfirmed - latestTotal.totalRecovered,
      recoveryRate: latestTotal.totalRecovered / latestTotal.totalConfirmed,
      mortalityRate: latestTotal.totalDeaths / latestTotal.totalRecovered,
      totalConfirmed: latestTotal.totalConfirmed,
      totalDeaths: latestTotal.totalDeaths,
      totalRecovered: latestTotal.totalRecovered,
      newConfirmed: latestChange.newConfirmed,
      newDeaths: latestChange.newDeaths,
      newRecovered: latestChange.newRecovered,
    };
    const newData: IStatsWizFireStoreEntity = {
      lastUpdate: todaysDate.toISOString(),
      latestSummary: latestSummary,
    };
    await countryDoc.set(newData, { merge: true });

    return latestSummary;
  }
}
