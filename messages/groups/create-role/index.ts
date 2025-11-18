import { _m, MessagesGroup } from "../../types";

export const createRoleMessages = new MessagesGroup({
  title: _m("Create Role", "إنشاء دور"),
  editTitle: _m("Edit Role", "تعديل الدور"),
  roleName: _m("Role Name", "اسم الدور"),
  roleNamePlaceholder: _m("Enter role name", "أدخل اسم الدور"),
  roleNameRequired: _m("Role name is required", "اسم الدور مطلوب"),
  roleNameMinLength: _m("Role name must be at least 3 characters", "يجب أن يكون اسم الدور على الأقل 3 أحرف"),
  permissions: _m("Permissions", "الصلاحيات"),
  selectAll: _m("Select All", "تحديد الكل"),
  deselectAll: _m("Deselect All", "إلغاء تحديد الكل"),
  permissionsRequired: _m("At least one permission must be selected", "يجب تحديد صلاحية واحدة على الأقل"),
  loading: _m("Loading...", "جاري التحميل..."),
  creating: _m("Creating...", "جاري الإنشاء..."),
  updating: _m("Updating...", "جاري التحديث..."),
  createRole: _m("Create Role", "إنشاء الدور"),
  updateRole: _m("Update Role", "تحديث الدور"),
  reset: _m("Reset", "إعادة تعيين"),
  selectedCount: _m("selected", "محدد"),
  roleCreatedSuccessfully: _m("Role created successfully", "تم إنشاء الدور بنجاح"),
  roleUpdatedSuccessfully: _m("Role updated successfully", "تم تحديث الدور بنجاح"),
  errorCreatingRole: _m("Error creating role", "خطأ في إنشاء الدور"),
  errorUpdatingRole: _m("Error updating role", "خطأ في تحديث الدور"),
  errorLoadingRole: _m("Error loading role data", "خطأ في تحميل بيانات الدور"),
  roleNotFound: _m("Role not found", "لم يتم العثور على الدور")
});
