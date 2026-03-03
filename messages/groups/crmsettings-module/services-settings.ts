import { _m, MessagesGroup } from "@/messages/types";

export const servicesSettingsMessages = new MessagesGroup({
  services: _m("Services", "الخدمات"),
  servicesList: _m("Services List", "قائمة الخدمات"),
  noServices: _m("No services found", "لا توجد خدمات"),
  addService: _m("Add Service", "إضافة خدمة"),
  addNewService: _m("Add New Service", "إضافة خدمة جديدة"),
  editService: _m("Edit Service", "تعديل الخدمة"),
  deleteService: _m("Delete Service", "حذف الخدمة"),
  action: _m("Action", "إجراء"),
  form: new MessagesGroup({
    serviceName: _m("Service Name", "اسم الخدمة"),
    serviceNamePlaceholder: _m("Enter service name", "أدخل اسم الخدمة"),
    selectServices: _m("Select Services", "اختر الخدمات"),
    save: _m("Save", "حفظ"),
  }),
  validation: new MessagesGroup({
    nameRequired: _m("Service name is required", "اسم الخدمة مطلوب"),
    servicesRequired: _m("At least one service must be selected", "يجب اختيار خدمة واحدة على الأقل"),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
  }),
  success: new MessagesGroup({
    created: _m("Service created successfully", "تم إضافة الخدمة بنجاح"),
    updated: _m("Service updated successfully", "تم تحديث الخدمة بنجاح"),
  }),
  error: new MessagesGroup({
    createFailed: _m("Error creating service", "حدث خطأ أثناء إضافة الخدمة"),
    updateFailed: _m("Error updating service", "حدث خطأ أثناء تحديث الخدمة"),
  }),
  // Service categories
  engineeringConstructions: _m("Engineering constructions", "إنشاءات هندسية"),
  buildings: _m("Buildings", "مباني"),
  commercialCenters: _m("Commercial centers", "مراكز تجارية"),
  parks: _m("Parks", "منتزهات"),
  gardens: _m("Gardens", "حدائق"),
});
