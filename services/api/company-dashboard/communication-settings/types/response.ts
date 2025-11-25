import { ApiBaseResponse } from "@/types/common/response/base";

/**
 * Contact Info Response Types
 */
export interface ContactInfo {
  email: string;
  phone: string;
}

export type GetContactInfoResponse = ApiBaseResponse<ContactInfo>;

/**
 * Address Response Types
 */
export interface City {
  id: string;
  name: string;
}

export interface Address {
  id: string;
  city_id: number;
  city: City;
  title: string;
  title_ar: string;
  title_en: string;
  address: string;
  latitude: string;
  longitude: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export type ShowAddressResponse = ApiBaseResponse<Address>;
export type GetAllAddressesResponse = ApiBaseResponse<Address[]>;

/**
 * Social Link Response Types
 */
export interface SocialLink {
  id: string;
  type: string;
  url: string;
  social_icon: string;
  created_at: string;
  updated_at: string;
}

export type ShowSocialLinkResponse = ApiBaseResponse<SocialLink>;

