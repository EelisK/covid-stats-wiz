import { reduce, mapValues, groupBy, zip } from 'lodash';
import { IStatsWizDayChange, IStatsWizDayTotal } from './models/stats-wiz';
import { DayOneCell } from './models/covid-api';

export const calculateDailyChanges = (
  aggregatedTotals: IStatsWizDayTotal[]
): IStatsWizDayChange[] => {
  const tail = aggregatedTotals.slice(1);
  const references = aggregatedTotals.slice(0, tail.length);
  const dailyChanges = zip(references, tail).map(([oldPoint, newPoint]) =>
    getCombiner<IStatsWizDayTotal>((n, o) => n - o)([
      'totalConfirmed',
      'totalDeaths',
      'totalRecovered',
    ])(newPoint, oldPoint)
  );
  return dailyChanges.map(
    ({ date, totalConfirmed, totalDeaths, totalRecovered }) => ({
      date,
      newConfirmed: totalConfirmed,
      newDeaths: totalDeaths,
      newRecovered: totalRecovered,
    })
  );
};

export const aggregateHistoryByDate = (
  history: DayOneCell[]
): IStatsWizDayTotal[] => {
  const casesByDate = groupBy(history, (x) => x.Date);
  const daySummaries = mapValues(casesByDate, aggregateResultFromDay);
  const statsWizDaySummaries = mapValues(daySummaries, (x) => ({
    totalRecovered: x.Recovered,
    totalConfirmed: x.Confirmed,
    totalDeaths: x.Deaths,
    date: x.Date,
  }));
  return Object.values(statsWizDaySummaries);
};

const aggregateResultFromDay = (valuesForDay: DayOneCell[]): DayOneCell =>
  reduce<DayOneCell>(
    valuesForDay,
    getCombiner<DayOneCell>()(['Active', 'Confirmed', 'Deaths', 'Recovered'])
  );

const getCombiner = <T extends Record<string, any>>(
  operation: (x: number, y: number) => number = (x, y) => x + y
) => (fields: Array<keyof T>) => (first: T, second: T): T => ({
  ...first,
  ...fields.reduce(
    (comp, next) => ({
      ...comp,
      [next]: operation(first[next], second[next]),
    }),
    {}
  ),
});
