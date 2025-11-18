import { _m, MessagesGroup } from "../../types";

export const requestsMessages = new MessagesGroup({
  title: _m("Requests", "الطلبات"),
  singular: _m("Request", "طلب"),
  plural: _m("Requests", "الطلبات"),
  dialog: new MessagesGroup({
    title: _m("Edit Request Status", "تعديل حالة الطلب"),
    statusLabel: _m("Order Status", "حالة الطلب"),
    selectStatus: _m("Select Status", "اختر الحالة"),
    save: _m("Save", "حفظ"),
    saving: _m("Saving...", "جاري الحفظ..."),
    cancel: _m("Cancel", "الغاء")
  }),
  table: new MessagesGroup({
    orderId: _m("Order ID", "معرف الطلب"),
    orderSerial: _m("Order Serial", "رقم الطلب"),
    orderNumber: _m("Product Count", "عدد المنتجات"),
    customerInfo: _m("Customer Info", "معلومات العميل"),
    orderDate: _m("Order Date", "تاريخ الطلب"),
    store: _m("Store", "المتجر"),
    status: _m("Status", "الحالة"),
    totalAmount: _m("Total Amount", "المبلغ الإجمالي"),
    completedOrders: _m("Completed Orders", "الطلبات المكتملة"),
    actions: _m("Actions", "اجراءات")
  }),
  status: new MessagesGroup({
    pending: _m("Pending", "قيد الانتظار"),
    confirmed: _m("Confirmed", "مؤكد"),
    processing: _m("Processing", "قيد المعالجة"),
    out_for_delivery: _m("Out for Delivery", "خارج للتوصيل"),
    delivered: _m("Delivered", "تم التوصيل"),
    returned: _m("Returned", "مرتجع"),
    failed: _m("Failed", "فشل"),
    canceled: _m("Canceled", "ملغي")
  }),
  success: new MessagesGroup({
    statusUpdated: _m("Request status updated successfully", "تم تحديث حالة الطلب بنجاح")
  }),
  errors: new MessagesGroup({
    fetchStatusesFailed: _m("Failed to fetch status options", "فشل في تحميل خيارات الحالة"),
    selectStatus: _m("Please select a status", "الرجاء اختيار حالة"),
    updateFailed: _m("Failed to update request status", "فشل في تحديث حالة الطلب")
  }),
  addNewRequest: _m("Add New Request", "إضافة طلب جديد"),
  createSuccess: _m("Request created successfully", "تم إنشاء الطلب بنجاح"),
  createError: _m("Failed to create request", "فشل في إنشاء الطلب"),
  form: new MessagesGroup({
    customerType: _m("Customer", "العميل"),
    existingCustomer: _m("Existing Customer", "عميل جديد"),
    guestCustomer: _m("Guest Customer", "عميل حالي"),
    selectCustomer: _m("Customer", "العميل"),
    selectCustomerPlaceholder: _m("Select Customer", "اختر العميل"),
    customerName: _m("Name", "الاسم"),
    customerNamePlaceholder: _m("Enter customer name", "أدخل اسم العميل"),
    customerNameRequired: _m("Customer name is required", "اسم العميل مطلوب"),
    paymentMethod: _m("Payment Method", "وسيلة الدفع"),
    selectPaymentMethod: _m("Select Payment Method", "اختر وسيلة الدفع"),
    paymentMethodRequired: _m("Payment method is required", "وسيلة الدفع مطلوبة"),
    country: _m("Country", "الدولة"),
    selectCountry: _m("Select Country", "اختر الدولة"),
    countryRequired: _m("Country is required", "الدولة مطلوبة"),
    phoneNumber: _m("Phone Number", "رقم الهاتف"),
    phoneNumberPlaceholder: _m("Enter phone number", "أدخل رقم الهاتف"),
    customerPhoneRequired: _m("Phone number is required", "رقم الهاتف مطلوب"),
    customerEmail: _m("Email", "البريد الإلكتروني"),
    customerEmailPlaceholder: _m("Enter email address", "أدخل البريد الإلكتروني"),
    orderDescription: _m("Order Description", "وصف الحالة"),
    orderDescriptionPlaceholder: _m("Enter order description", "أدخل وصف الطلب"),
    product: _m("Product", "المنتج"),
    selectProduct: _m("Select Product", "اختر المنتج"),
    productRequired: _m("Product is required", "المنتج مطلوب"),
    quantity: _m("Quantity", "الكمية"),
    quantityRequired: _m("Quantity is required", "الكمية مطلوبة"),
    shippingAddress: _m("Shipping Address", "عنوان الشحن"),
    shippingAddressPlaceholder: _m("Enter shipping address", "أدخل عنوان الشحن"),
    shippingAddressRequired: _m("Shipping address is required", "عنوان الشحن مطلوب"),
    customerEmailInvalid: _m("Invalid email address", "البريد الإلكتروني غير صحيح")
  })
});
