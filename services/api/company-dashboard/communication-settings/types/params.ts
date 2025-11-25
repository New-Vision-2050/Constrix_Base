/**
 * Contact Info Parameters
 */
export interface UpdateContactInfoParams {
  email: string;
  phone: string;
}

/**
 * Address Parameters
 */
export interface CreateAddressParams {
  title_ar: string;
  title_en: string;
  address: string;
  latitude: number;
  longitude: number;
  status?: number;
}

export interface UpdateAddressParams {
  title_ar: string;
  title_en: string;
  address: string;
  latitude: number;
  longitude: number;
  status?: number;
}

/**
 * Social Link Parameters
 */
export interface CreateSocialLinkParams {
  type: string;
  url: string;
  social_icon: File;
}

export interface UpdateSocialLinkParams {
  type: string;
  url: string;
  social_icon: File;
}

