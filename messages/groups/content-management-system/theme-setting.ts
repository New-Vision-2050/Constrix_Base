import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemThemeSettingMessages = new MessagesGroup({
    common: new MessagesGroup({
        palette: _m("Color Palette", "لوحة ألوان"),
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
    borderRadius: new MessagesGroup({
        title: _m("Border Radius", "نصف قطر الحدود"),
        label: _m("Boundary (border radius)", "الحدود (نصف قطر الحدود)"),
        borderRadiusLabel: _m("Boundary (border radius)", "الحدود (نصف قطر الحدود)"),
        borderRadiusMin: _m("Border radius must be 0 or greater", "يجب أن يكون نصف قطر الحدود 0 أو أكثر"),
        borderRadiusMax: _m("Border radius must not exceed 50px", "يجب أن يكون نصف قطر الحدود أقل من 50px"),
    }),
    typography: new MessagesGroup({
        title: _m("Typography", "النصوص"),
        htmlFontSize: _m("HTML Font Size", "حجم خط HTML"),
        fontSize: _m("Font Size", "حجم الخط"),
        fontFamily: _m("Font Family", "عائلة الخطوط"),
        fontWeightLight: _m("Font Weight Light", "وزن الخط الخفيف"),
        fontWeightRegular: _m("Font Weight Regular", "وزن الخط العادي"),
        fontWeightMedium: _m("Font Weight Medium", "وزن الخط المتوسط"),
        fontWeightBold: _m("Font Weight Bold", "وزن الخط الغامق"),
    }),
    colorPickerPopover: new MessagesGroup({
        save: _m("Save", "حفظ"),
        cancel: _m("Cancel", "إلغاء"),
        invalidHex: _m("Invalid hex color", "اللون غير صالح")
    }),
    saveChanges: _m("Save Changes", "حفظ التعديلات"),
});

