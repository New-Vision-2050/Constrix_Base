import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemThemeSettingMessages = new MessagesGroup({
    common: new MessagesGroup({
        save: _m("Save", "حفظ"),
        cancel: _m("Cancel", "إلغاء"),
        primary: _m("Primary", "الاساسي"),
        contrast: _m("Contrast", "نص التباين"),
        light: _m("Light", "فاتح"),
        dark: _m("Dark", "داكن"),
        primaryColor: _m("Primary Color", "اللون الاساسي"),
        secondaryColor: _m("Secondary Color", "اللون الثانوي"),
        infoColor: _m("Info Color", "اللون المعلوماتي"),
        warningColor: _m("Warning Color", "اللون التحذيري"),
        errorColor: _m("Error Color", "اللون الخطأ"),
        textColor: _m("Text Color", "اللون النصي"),
    }),
    basicInfo: new MessagesGroup({
        title: _m("Basic Info", "البيانات الاساسية"),
        iconLabel: _m("Website Icon", "أيقونة الموقع"),
        urlLabel: _m("Website URL", "عنوان الموقع"),
    }),
    borderRadiusLabel: _m("Boundary (border radius)", "الحدود (نصف قطر الحدود)"),
    borderRadiusMin: _m("Border radius must be 0 or greater", "يجب أن يكون نصف قطر الحدود 0 أو أكثر"),
    borderRadiusMax: _m("Border radius must not exceed 50px", "يجب أن يكون نصف قطر الحدود أقل من 50px"),

});

