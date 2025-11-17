import { _m, MessagesGroup } from "../../types";

export const warehouseMessages = new MessagesGroup({
  plural: _m("Warehouses", "المخازن"),
  singular: _m("Warehouse", "المخزن"),
  addWarehouse: _m("Add Warehouse", "اضافة مخزن"),
  editWarehouse: _m("Edit Warehouse", "تعديل مخزن"),
  warehouseName: _m("Warehouse Name", "اسم المخزن"),
  isDefault: _m("Default Warehouse", "مخزن افتراضي"),
  district: _m("District", "المنطقة"),
  street: _m("Street", "الشارع"),
  selectCountry: _m("Select Country", "اختر الدولة"),
  selectCity: _m("Select City", "اختر المدينة"),
  locationMap: _m("Location Map", "خريطة الموقع"),
  cancel: _m("Cancel", "الغاء"),
  save: _m("Save", "حفظ"),
  saving: _m("Saving...", "جاري الحفظ..."),
  warehouseNameRequired: _m("Warehouse name is required", "اسم المخزن مطلوب"),
  warehouseNameMinLength: _m("Warehouse name must be at least 2 characters", "اسم المخزن يجب أن يكون على الأقل حرفين"),
  countryRequired: _m("Country is required", "الدولة مطلوبة"),
  cityRequired: _m("City is required", "المدينة مطلوبة"),
  districtRequired: _m("District is required", "المنطقة مطلوبة"),
  streetRequired: _m("Street is required", "الشارع مطلوب"),
  notFound: _m("No warehouses found", "لم يتم العثور على مخازن")
});
