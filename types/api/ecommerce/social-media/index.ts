export interface ECM_SocialMedia {
  id: string;
  platform: string;
  link: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SocialMediaPlatform = 
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "whatsapp";
