export interface AllCountriesSummary {
  Message: string;
  Global: GlobalSummary;
  Countries: CountrySummary[];
  Date: string;
}

export interface GlobalSummary {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
}

export interface CountrySummary {
  Country: string;
  CountryCode: string;
  Slug: string;
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
  Date: string;
  Premium: {};
}

export interface CountryDetails {
  Country: string;
  Slug: string;
  ISO2: string;
}

export interface AggregatedCountryDaySummary {
  Country: string;
  CountryCode: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Active: number;
  Date: string;
}

export interface CountryProvinceDaySummary {
  Country: string;
  CountryCode: string;
  Province: string;
  City: string;
  CityCode: string;
  Lat: string;
  Lon: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Active: number;
  Date: string;
}
