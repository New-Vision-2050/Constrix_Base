import { _m, MessagesGroup } from "../../types";

export const personalDataFormMessages = new MessagesGroup({
  title: _m("Personal Data", "البيانات الشخصية"),
  name: _m("Full Name", "الاسم ثلاثي"),
  namePlaceholder: _m("Enter full name", "ادخل الاسم الثلاثي"),
  nameRequired: _m("Name is required", "الاسم مطلوب"),
  nameThreeTerms: _m("Name must consist of exactly three terms (first, middle, and last name)", "الاسم يجب أن يتكون من ثلاثة مقاطع فقط (الأول والأوسط والأخير)"),
  nameLettersOnly: _m("Name must contain only letters (no numbers or symbols)", "يجب أن يحتوي الاسم على حروف فقط (بدون أرقام أو رموز)"),
  nickname: _m("Nickname", "اسم الشهرة"),
  nicknamePlaceholder: _m("Enter nickname", "ادخل اسم الشهرة"),
  nicknameRequired: _m("Nickname is required", "اسم الشهرة مطلوب"),
  gender: _m("Gender", "الجنس"),
  genderPlaceholder: _m("Select gender", "اختر الجنس"),
  genderMale: _m("Male", "ذكر"),
  genderFemale: _m("Female", "أنثى"),
  genderRequired: _m("Gender is required", "الجنس مطلوب"),
  is_default: _m("Is Default?", "افتراضي ؟"),
  isDefaultPlaceholder: _m("Is Default?", "افتراضي؟"),
  birthdate_gregorian: _m("Birthdate (Gregorian)", "تاريخ الميلاد"),
  birthdateGregorianPlaceholder: _m("Enter Gregorian birthdate", "ادخل تاريخ الميلاد الميلادي"),
  birthdateGregorianRequired: _m("Gregorian birthdate is required", "التاريخ الميلادي مطلوب"),
  birthdate_hijri: _m("Birthdate (Hijri)", "تاريخ الهجري"),
  birthdateHijriPlaceholder: _m("Enter Hijri birthdate", "ادخل تاريخ الميلاد الهجري"),
  birthdateHijriRequired: _m("Hijri birthdate is required", "التاريخ الهجري مطلوب"),
  country_id: _m("Nationality", "الجنسية"),
  countryPlaceholder: _m("Select nationality", "اختر الجنسية"),
  countryRequired: _m("Nationality is required", "الجنسية مطلوبة"),
  submitButtonText: _m("Save", "حفظ"),
  cancelButtonText: _m("Cancel", "إلغاء"),
  resetButtonText: _m("Clear Form", "مسح النموذج"),
  error: new MessagesGroup({

  })
});
