export interface ECM_SocialIcon {
  id: string;
  name: string;
  web_icon: string;
  mobile_icon: string;
}

export interface ECM_SocialMedia {
  id: string;
  social_icons_id: string;
  social_icon?: ECM_SocialIcon;
  platform: string;
  url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
