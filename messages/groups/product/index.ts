import { _m, MessagesGroup } from "../../types";

export const productMessages = new MessagesGroup({
  singular: _m("Product", "منتج"),
  plural: _m("Products", "المنتجات"),
  fields: new MessagesGroup({
    productName: _m("Product Name", "اسم المنتج"),
    productDescription: _m("Product Description", "وصف المنتج"),
    productCode: _m("Product Code (Serial)", "كود المنتج (السيريال)"),
    status: _m("Status", "الحالة"),
    category: _m("Category", "القسم"),
    subCategory: _m("Sub Category", "قسم الفرعي"),
    subSubCategory: _m("Sub Sub Category", "قسم فرعي فرعي"),
    brand: _m("Brand", "العلامة التجارية"),
    country: _m("Country", "الدولة"),
    productType: _m("Product Type", "نوع المنتح"),
    unit: _m("Unit", "الوحدة"),
    gender: _m("Gender", "النوع"),
    warehouse: _m("Warehouse", "المخزن"),
    unitPrice: _m("Unit Price", "السعر الوحدة "),
    minOrderQuantity: _m("Minimum Order Quantity", "الحد الادنى لكمية الطلب"),
    currentStock: _m("Current Stock Quantity", "كمية المخزون الحالية"),
    discountType: _m("Discount Type", "نوع الخصم"),
    discountAmount: _m("Discount Amount", "مبلغ الخصم "),
    taxAmount: _m("Tax Amount (%)", "مبلغ الضريبة (%)"),
    priceIncludesVat: _m("Price Includes VAT", "السعر يشمل الضريبة"),
    calculateShippingCost: _m("Calculate Shipping Cost", "حساب تكلفة الشحن "),
    shippingCost: _m("Shipping Cost", "تكلفة الشحن "),
    metaTitle: _m("Meta Title", "عنوان ميتا"),
    metaDescription: _m("Meta Description", "وصف ميتا"),
    metaKeywords: _m("Meta Keywords", "كلمات مفتاحية ميتا"),
    metaPhoto: _m("Meta Photo", "صورة ميتا"),
    productVideo: _m("Product Video", "فيديو المنتج")
  }),
  placeholders: new MessagesGroup({
    selectCategory: _m("Select Category", "اختر القسم"),
    selectMainCategoryFirst: _m("Select Main Category First", "اختر القسم الرئيسي أولاً"),
    selectSubCategoryFirst: _m("Select Sub Category First", "اختر القسم الفرعي أولاً"),
    selectSubCategory: _m("Select Sub Category", "اختر القسم الفرعي"),
    selectSubSubCategory: _m("Select Sub Sub Category", "اختر القسم الفرعي الفرعي"),
    selectBrand: _m("Select Brand", "اختر العلامة التجارية"),
    selectCountries: _m("Select Countries", "اختر الدول"),
    selectType: _m("Select Type", "اختر النوع"),
    selectUnit: _m("Select Unit", "اختر الوحدة"),
    selectWarehouse: _m("Select Warehouse", "اختر المخزن"),
    selectDiscountType: _m("Select Discount Type", "اختر نوع الخصم"),
    loading: _m("Loading...", "جاري التحميل..."),
    videoUrl: _m("example@youtube.com", "example@youtube.com")
  }),
  options: new MessagesGroup({
    normal: _m("Normal", "عادي"),
    serial: _m("Serial", "رقمي"),
    male: _m("Male", "ذكر"),
    female: _m("Female", "انثى"),
    all: _m("All", "الكل"),
    amount: _m("Amount", "مبلغ"),
    percentage: _m("Percentage", "نسبة مئوية")
  }),
  messages: new MessagesGroup({
    noSubCategories: _m("No sub categories available", "لا توجد أقسام فرعية"),
    noSubSubCategories: _m("No sub sub categories available", "لا توجد أقسام فرعية فرعية"),
    notFound: _m("Product not found", "المنتج غير موجود"),
    updating: _m("Updating data...", "جاري تحديث البيانات..."),
    preparing: _m("Preparing data...", "جاري تجهيز البيانات..."),
    uploading: _m("Uploading data to server...", "جاري رفع البيانات إلى الخادم..."),
    completing: _m("Completing operation...", "جاري إتمام العملية..."),
    updateSuccess: _m("Updated successfully!", "تم التحديث بنجاح!")
  }),
  actions: new MessagesGroup({
    backToList: _m("Back to List", "العودة إلى القائمة"),
    updateProduct: _m("Update Product", "تحديث المنتج")
  }),
  sections: new MessagesGroup({
    generalSettings: _m("General Settings", "الاعداد العام"),
    pricingAndOthers: _m("Pricing and Others", "التسعير وغيرها"),
    productImages: _m("Product Images", "صور المنتج"),
    productVideo: _m("Product Video", "فيديو المنتج"),
    seoSection: _m("SEO Section", "قسم تحسين محركات البحث")
  }),
  seo: new MessagesGroup({
    recommendedSize: _m("Recommended size 3MB", "الحجم الموصى به 3MB")
  }),
  dialog: new MessagesGroup({
    actions: new MessagesGroup({
      cancel: _m("Cancel", "إلغاء"),
      saving: _m("Saving...", "جاري الحفظ...")
    }),
    add: new MessagesGroup({
      title: _m("Add Regular Product", "إضافة منتج عادي"),
      success: _m("Product created successfully", "تم إنشاء المنتج بنجاح"),
      error: _m("An error occurred while creating the product", "حدث خطأ أثناء إنشاء المنتج"),
      fields: new MessagesGroup({
        name: new MessagesGroup({
          label: _m("Product Name", "اسم المنتج"),
          placeholder: _m("iPhone", "هاتف ايفون")
        }),
        price: new MessagesGroup({
          label: _m("Product Price", "سعر المنتج"),
          placeholder: _m("1600", "1600")
        }),
        sku: new MessagesGroup({
          label: _m("Product Code", "رمز المنتج"),
          placeholder: _m("16AAFF206", "16AAFF206")
        }),
        description: new MessagesGroup({
          label: _m("Product Description", "وصف المنتج"),
          placeholder: _m("Description of this product which may be a line or exceed that with...", "وصف هذا المنتج الذي قد يكون سطرا أو يتجاوز ذلك بـ...")
        }),
        stock: new MessagesGroup({
          label: _m("Stock Quantity", "كمية المخزون")
        }),
        warehouse: new MessagesGroup({
          label: _m("Warehouse", "المستودع")
        }),
        category: new MessagesGroup({
          label: _m("Category", "الفئة")
        }),
        brand: new MessagesGroup({
          label: _m("Brand", "العلامة التجارية")
        }),
        subCategory: new MessagesGroup({
          label: _m("Sub Category", "الفئة الفرعية")
        }),
        type: new MessagesGroup({
          label: _m("Product Type", "نوع المنتج"),
          physical: _m("Physical", "مادي"),
          digital: _m("Digital", "رقمي")
        }),
        requiresShipping: new MessagesGroup({
          label: _m("Requires Shipping", "يتطلب الشحن")
        }),
        unlimitedQuantity: new MessagesGroup({
          label: _m("Unlimited Quantity", "كمية غير محدودة")
        }),
        isTaxable: new MessagesGroup({
          label: _m("Taxable", "خاضع للضريبة")
        }),
        priceIncludesVat: new MessagesGroup({
          label: _m("Price Includes VAT", "السعر شامل الضريبة")
        }),
        vatPercentage: new MessagesGroup({
          label: _m("VAT Percentage", "نسبة الضريبة")
        }),
        vatSettings: new MessagesGroup({
          exemptFromTax: _m("Product is tax exempt", "المنتج معفى من الضريبة")
        }),
        isVisible: new MessagesGroup({
          label: _m("Visible", "عرض المنتج على المتجر"),
          description: _m("If you choose not to display the product in the store, the product will be saved in products and will not be shown to the user in your store", "في حالة عدم اختيارك عرض المنتج على المتجر سيتم حفظ المنتج في المنتجات ولن يتم اظهاره للمستخدم على المتجر الخاص بك")
        }),
        mainImage: new MessagesGroup({
          label: _m("Product Image", "صورة المنتج"),
          uploadText: _m("Upload Image", "رفع صورة"),
          dragText: _m("Maximum image size: 2160 × 2160 - 3MB", "اقصى حجم للصورة: 2160 × 2160 - 3MB"),
          remove: _m("Remove", "إزالة")
        }),
        otherImages: new MessagesGroup({
          label: _m("Other Images", "صور أخرى")
        }),
        taxes: new MessagesGroup({
          label: _m("Taxes", "الضرائب"),
          vatSettings: _m("VAT Settings", "إعدادات القيمة المضافة"),
          countryId: _m("Country ID", "رقم الدولة"),
          country: _m("Country", "الدولة"),
          taxNumber: _m("Tax Number", "الرقم الضريبي"),
          taxPercentage: _m("Tax Percentage", "نسبة الضريبة"),
          isActive: _m("Active", "تفعيل"),
          noTaxes: _m("No taxes added. Click 'Add' to add a new tax.", "لا توجد ضرائب مضافة. انقر على \"إضافة\" لإضافة ضريبة جديدة.")
        }),
        details: new MessagesGroup({
          label: _m("Product Details", "تفاصيل المنتج"),
          labelField: _m("Label", "التسمية"),
          valueField: _m("Value", "القيمة")
        }),
        customFields: new MessagesGroup({
          label: _m("Custom Fields", "حقول مخصصة"),
          fieldName: _m("Field Name", "اسم الحقل"),
          fieldValue: _m("Field Value", "قيمة الحقل")
        }),
        seo: new MessagesGroup({
          label: _m("SEO Settings", "إعدادات محركات البحث"),
          metaTitle: _m("Meta Title", "عنوان الميتا"),
          metaDescription: _m("Meta Description", "وصف الميتا"),
          metaKeywords: _m("Meta Keywords", "كلمات الميتا المفتاحية")
        })
      }),
      actions: new MessagesGroup({
        seo: _m("Search Engine Optimization", "تحسين محركات البحث"),
        additionalDetails: _m("Additional Product Details", "تفاصيل اضافية للمنتج"),
        customFields: _m("Custom Fields", "حقول مخصصة"),
        save: _m("Save", "حفظ"),
        saving: _m("Saving...", "جاري الحفظ..."),
        cancel: _m("Cancel", "الغاء")
      })
    }),
    edit: new MessagesGroup({
      title: _m("Edit Product", "تعديل منتج"),
      success: _m("Product edited successfully", "تم تعديل المنتج بنجاح"),
      error: _m("An error occurred while editing the product", "حدث خطأ أثناء تعديل المنتج")
    })
  }),
  validation: new MessagesGroup({
    nameAr: _m("Arabic name is required", "الاسم باللغة العربية مطلوب"),
    nameEn: _m("English name is required", "الاسم باللغة الإنجليزية مطلوب"),
    descriptionAr: _m("Arabic description is required", "الوصف باللغة العربية مطلوب"),
    descriptionEn: _m("English description is required", "الوصف باللغة الإنجليزية مطلوب"),
    sku: _m("Product code is required", "رمز المنتج مطلوب"),
    category: _m("Main category field is required", "حقل الفئة الرئيسية مطلوب"),
    type: _m("Product type is required", "نوع المنتج مطلوب"),
    warehouse: _m("Warehouse ID is required", "معرف المستودع مطلوب"),
    unit: _m("Unit of measurement is required", "وحدة القياس مطلوبة"),
    price: _m("Price field is required", "حقل السعر مطلوب"),
    gender: _m("Target gender is required", "الجنس المستهدف مطلوب"),
    minOrderQuantity: _m("Minimum order quantity is required", "الحد الأدنى لكمية الطلب مطلوب"),
    discountType: _m("Discount type is required", "نوع الخصم مطلوب"),
    discountValue: _m("Discount value must be a positive number", "يجب أن تكون قيمة الخصم رقماً موجباً"),
    vatPercentage: _m("VAT percentage must be between 0 and 100", "يجب أن تكون نسبة ضريبة القيمة المضافة بين 0 و 100"),
    fillRequired: _m("Please fill all required fields correctly", "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"),
    name: new MessagesGroup({
      required: _m("Product name is required", "اسم المنتج مطلوب")
    }),
    description: new MessagesGroup({
      required: _m("Product description is required", "وصف المنتج مطلوب")
    }),
    stock: new MessagesGroup({
      negative: _m("Quantity cannot be negative", "الكمية لا يمكن أن تكون سالبة")
    }),
    mainImage: new MessagesGroup({
      required: _m("Main image is required", "الصورة الرئيسية مطلوبة")
    }),
    taxes: new MessagesGroup({
      country: new MessagesGroup({
        required: _m("Country must be selected", "يجب اختيار الدولة")
      }),
      taxNumber: new MessagesGroup({
        required: _m("Tax number is required", "رقم الضريبة مطلوب")
      }),
      taxPercentage: new MessagesGroup({
        range: _m("Tax percentage must be between 0 and 100", "نسبة الضريبة يجب أن تكون بين 0 و 100")
      })
    }),
    details: new MessagesGroup({
      label: new MessagesGroup({
        required: _m("Label is required", "التسمية مطلوبة")
      }),
      value: new MessagesGroup({
        required: _m("Value is required", "القيمة مطلوبة")
      })
    }),
    customFields: new MessagesGroup({
      fieldName: new MessagesGroup({
        required: _m("Field name is required", "اسم الحقل مطلوب")
      }),
      fieldValue: new MessagesGroup({
        required: _m("Field value is required", "قيمة الحقل مطلوبة")
      })
    })
  })
});
