import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemCommunicationSettingsMessages = new MessagesGroup({
  title: _m("Communication Settings", "اعدادات الاتصال"),
  
  // Contact Data Fields
  email: _m("Email", "البريد الإلكتروني"),
  phone: _m("Phone Number", "رقم الهاتف"),
  
  // Validation Messages
  emailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
  emailInvalid: _m("Please enter a valid email address", "يرجى إدخال بريد إلكتروني صالح"),
  phoneRequired: _m("Phone number is required", "رقم الهاتف مطلوب"),
  phoneInvalid: _m("Please enter a valid phone number", "يرجى إدخال رقم هاتف صالح"),
  phoneMinLength: _m("Phone must be at least 10 digits", "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  phoneMaxLength: _m("Phone must not exceed 20 digits", "رقم الهاتف يجب ألا يزيد عن 20 رقم"),
});