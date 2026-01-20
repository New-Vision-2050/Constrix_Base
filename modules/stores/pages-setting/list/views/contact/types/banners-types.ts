export interface BannersRow {
  id: string;
  image?: {
    url: string;
  };
  title?: string;
  url?: string;
  is_active: boolean;
}
