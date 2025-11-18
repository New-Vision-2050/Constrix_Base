import { _m, MessagesGroup } from "../../types";

export const locationMessages = new MessagesGroup({
  longitude: _m("Longitude", "خط الطول"),
  latitude: _m("Latitude", "خط العرض"),
  radius: _m("Attendance Radius", "نصف قطر الحضور"),
  meters: _m("meters", "متر"),
  save: _m("Save", "حفظ"),
  chooseLocationCoordinates: _m("Choose Location Coordinates", "اختر إحداثيات الموقع"),
  defaultBranchLocation: _m("Default Branch Location", "موقع الفرع الافتراضي"),
  selectBranch: _m("Select Branch", "اختر الفرع"),
  loading: _m("Loading...", "جاري التحميل..."),
  selectBranchesFirst: _m("Select Branches First", "اختر الفروع أولاً"),
  selectBranchesInstructions: _m("You need to select branches from the form first to be able to set their locations", "تحتاج إلى تحديد الفروع من النموذج أولاً لتتمكن من تحديد مواقعها"),
  city: _m("City", "المدينة"),
  state: _m("State", "المنطقة"),
  country: _m("Country", "الدولة"),
  address: _m("Address", "العنوان"),
  postalCode: _m("Postal Code", "الرمز البريدي"),
  map: _m("Map", "الخريطة"),
  disctrict: _m("District", "الحي"),
  notFound: _m("No locations found", "لم يتم العثور على مواقع")
});
