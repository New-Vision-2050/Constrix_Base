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
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateAddressParams {
  address: string;
  latitude: number;
  longitude: number;
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

