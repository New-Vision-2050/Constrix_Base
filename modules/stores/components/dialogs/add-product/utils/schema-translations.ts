// This module helps with schema translations
// Since we can't use hooks in schema definitions, we use a fallback system

interface TranslationMap {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translationMap: TranslationMap = {
  "product.validation.name.required": {
    en: "Product name is required",
    ar: "اسم المنتج مطلوب",
  },
  "product.validation.description.required": {
    en: "Product description is required",
    ar: "وصف المنتج مطلوب",
  },
  "product.validation.price.required": {
    en: "Price must be a positive number",
    ar: "السعر يجب أن يكون رقم موجب",
  },
  "product.validation.sku.required": {
    en: "Product code is required",
    ar: "رمز المنتج مطلوب",
  },
  "product.validation.stock.negative": {
    en: "Quantity cannot be negative",
    ar: "الكمية لا يمكن أن تكون سالبة",
  },
  "product.validation.warehouse.required": {
    en: "Warehouse is required",
    ar: "المستودع مطلوب",
  },
  "product.validation.category.required": {
    en: "Category is required",
    ar: "الفئة مطلوبة",
  },
  "product.validation.type.invalid": {
    en: "Product type must be physical or digital",
    ar: "نوع المنتج يجب أن يكون مادي أو رقمي",
  },
  "product.validation.vatPercentage.range": {
    en: "VAT percentage must be between 0 and 100",
    ar: "نسبة الضريبة يجب أن تكون بين 0 و 100",
  },
  "product.validation.mainImage.required": {
    en: "Main image is required",
    ar: "الصورة الرئيسية مطلوبة",
  },
  "product.validation.taxes.country.required": {
    en: "Country must be selected",
    ar: "يجب اختيار الدولة",
  },
  "product.validation.taxes.taxNumber.required": {
    en: "Tax number is required",
    ar: "رقم الضريبة مطلوب",
  },
  "product.validation.taxes.taxPercentage.range": {
    en: "Tax percentage must be between 0 and 100",
    ar: "نسبة الضريبة يجب أن تكون بين 0 و 100",
  },
  "product.validation.details.label.required": {
    en: "Label is required",
    ar: "التسمية مطلوبة",
  },
  "product.validation.details.value.required": {
    en: "Value is required",
    ar: "القيمة مطلوبة",
  },
  "product.validation.customFields.fieldName.required": {
    en: "Field name is required",
    ar: "اسم الحقل مطلوب",
  },
  "product.validation.customFields.fieldValue.required": {
    en: "Field value is required",
    ar: "قيمة الحقل مطلوبة",
  },
};

// Get translation based on locale or fallback to Arabic (default)
export const getSchemaTranslation = (
  key: string,
  locale: string = "ar"
): string => {
  const translation = translationMap[key];
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return locale === "en" ? translation.en : translation.ar;
};

// Create schemas with locale-specific translations
export const createTranslatedSchemas = (locale: string = "ar") => {
  const t = (key: string) => getSchemaTranslation(key, locale);

  return {
    getTranslation: t,
  };
};
