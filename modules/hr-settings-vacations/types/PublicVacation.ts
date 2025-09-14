export interface PublicVacation {
  id: string;
  name: string;
  country_id: string;
  date_end: string;
  date_start: string;
  country: {
    id: string;
    name: string;
  };
}
