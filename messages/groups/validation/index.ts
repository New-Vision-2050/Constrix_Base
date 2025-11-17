import { _m, MessagesGroup } from "../../types";

export const validationMessages = new MessagesGroup({
  Required: _m("This field is required", "هذا الحقل مطلوب"),
  MinLength: _m("Must be at least {min} characters", "يجب أن يكون طول النص {min} أحرف على الأقل"),
  InvalidEmail: _m("Invalid email address", "البريد الإلكتروني غير صالح"),
  InvalidPhone: _m("Invalid phone number, must be in the format 05xxxxxxxx", "رقم الهاتف غير صالح، يجب أن يكون بصيغة 05xxxxxxxx"),
  Password: new MessagesGroup({
    MinLength: _m("Password must be at least 8 characters", "يجب أن تكون كلمة المرور بطول 8 أحرف على الأقل"),
    UpperCase: _m("Password must contain at least one uppercase letter", "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"),
    SpecialChar: _m("Password must contain at least one special character", "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل"),
    Required: _m("Password is required", "يجب إدخال كلمة المرور")
  }),
  PasswordMatch: _m("Passwords must match", "يجب أن تتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور"),
  EmailMatch: _m("Email addresses must match", "يجب أن تتطابق البريد الالكتروني الجديد مع تأكيد البريد الالكتروني"),
  OTP: _m("Temporary password is required", "يجب إدخال كلمة المرور المؤقتة")
});
