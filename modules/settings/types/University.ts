export type UniversityCountry = {
  id: string;
  name: string;
  status?: number;
  sms_driver?: string | null;
  currency_name?: string;
  currency_symbol?: string;
};

export type University = {
  id: string;
  name: string;
  url: string | null;
  country?: UniversityCountry;
  country_id?: string;
};
