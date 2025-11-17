import { _m, MessagesGroup } from "../../types";

export const errorsMessages = new MessagesGroup({
  Authentication: new MessagesGroup({
    Title: _m("Authentication Error", "خطأ في المصادقة"),
    SessionExpired: _m("Your session has expired. Please log in again.", "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى."),
    InvalidCredentials: _m("Invalid username or password", "اسم المستخدم أو كلمة المرور غير صحيحة"),
    InvalidIdentifier: _m("Invalid identifier or not found", "المعرف غير صحيح أو غير موجود"),
    UserNotFound: _m("This user is invalid", "هذا المستخدم غير صحيح"),
    GenericError: _m("An error occurred", "حدث خطأ")
  }),
  Authorization: new MessagesGroup({
    Title: _m("Access Denied", "تم رفض الوصول"),
    Message: _m("You don't have permission to access this page", "ليس لديك صلاحية للوصول إلى هذه الصفحة"),
    GoBack: _m("Go Back", "العودة"),
    GoHome: _m("Go to Home", "الذهاب إلى الرئيسية")
  }),
  Back: _m("Back", "رجوع")
});
