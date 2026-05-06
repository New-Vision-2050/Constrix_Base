import { _m, MessagesGroup } from "../../types";

export const deleteEmailMessages = new MessagesGroup({
  Title: _m("Delete Email Address", "حذف عنوان البريد الإلكتروني"),
  Description: _m(
    "Fill in the form below to request deletion of your email address from our system.",
    "أدخل البيانات أدناه لتقديم طلب حذف عنوان بريدك الإلكتروني من نظامنا."
  ),
  FirstName: _m("First Name", "الاسم الأول"),
  LastName: _m("Last Name", "الاسم الأخير"),
  Email: _m("Email Address", "البريد الإلكتروني"),
  Submit: _m("Submit Request", "إرسال الطلب"),
  Loading: _m("Sending...", "جاري الإرسال..."),
  SuccessTitle: _m("Request Sent Successfully", "تم إرسال الطلب بنجاح"),
  SuccessMessage: _m(
    "Your request has been received. Your data is currently under review for deletion.",
    "تم استلام طلبك. بياناتك قيد المراجعة حالياً تمهيداً للحذف."
  ),
  ContactInfo: _m(
    "If you wish to follow up on your request, please contact the company directly.",
    "إذا كنت ترغب في متابعة طلبك، يرجى التواصل مع الشركة مباشرةً."
  ),
});
