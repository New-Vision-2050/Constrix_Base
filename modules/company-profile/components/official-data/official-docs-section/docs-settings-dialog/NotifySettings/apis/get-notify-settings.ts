import { apiClient } from "@/config/axios-config";

export type NotifySettings = {
  company_id: string;
  email: string;
  id: string;
  is_daily_reminder: number;
  is_mail: number;
  is_sms: number;
  is_weekly_reminder: number;
  message: string;
  phone: string;
  reminder_type: string;
  reminder_type_label: string;
  settings_summary: {
    notification_methods: {
      email: boolean;
      sms: boolean;
    };
    frequency: string;
    status: string;
    has_custom_message: boolean;
  };
  type: string;
  type_label: string;
  updated_at: string;
  user_id: string | null;
};

export type ResponseT = {
  code: string;
  message: string;
  payload: NotifySettings;
};

export default async function getNotifySettings() {
  const res = await apiClient.get<ResponseT>(`/notification_settings`);

  return res.data.payload;
}
