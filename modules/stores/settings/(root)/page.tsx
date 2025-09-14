"use client";

export default function StoreSettingsPage() {
  // Settings cards data based on the design
  const settingsCards = [
    {
      title: "طرق الدفع",
      description: "اضافة وتعديل طرق الدفع المتاحة",
      icon: "💳",
    },
    {
      title: "اللغة والعملات",
      description: "اللغة العربية - ريال سعودي",
      icon: "🌐",
    },
    {
      title: "تصميم المتجر",
      description: "اختيار وتعديل تصميم المتجر",
      icon: "🎨",
    },
    {
      title: "بيانات المتجر",
      description: "تعديل بيانات متجر ابعاد الرؤية",
      icon: "🏪",
    },
    {
      title: "الشروط والاحكام",
      description: "تعديل شروط واحكام الاستخدام",
      icon: "📋",
    },
    {
      title: "ادارة المخازن",
      description: "اضافة وتعديل مخازن المتجر",
      icon: "🏬",
    },
    {
      title: "الشحن والتوصيل",
      description: "اضافة وتعديل طرق الشحن والتوصيل",
      icon: "🚚",
    },
    {
      title: "ايام المناسبات",
      description: "تحديد ايام المناسبات الخاصة بالمتجر",
      icon: "🎉",
    },
    {
      title: "اعدادات الفاتورة",
      description: "تخصيص الفاتورة للعميل",
      icon: "📄",
    },
    {
      title: "خصائص الطلبات والمنتجات",
      description: "ادارة خصائص الطلبات والمنتجات",
      icon: "📦",
    },
    {
      title: "الحقول المخصصة",
      description: "ادارة الحقول المخصصة للمنتج",
      icon: "⚙️",
    },
    {
      title: "اتمام عملية الشراء",
      description: "ادارة مخاطة اتمام عملية الشراء",
      icon: "✅",
    },
    {
      title: "ادارة الرسائل",
      description: "ادارة ورسائل المتجر",
      icon: "✉️",
    },
    {
      title: "ادارة فريق العمل",
      description: "ادارة اعضاء فريق العمل ومهامهم",
      icon: "👥",
    },
    {
      title: "مركز المساعدة",
      description: "ادارة طرق مساعدة العميل",
      icon: "❓",
    },
    {
      title: "تذاكر الدعم",
      description: "ادارة تذاكر الدعم الخاصة بالعملاء",
      icon: "🎫",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            اعداد الرؤية للاستشارات الهندسية
          </h1>
          <p className="text-gray-600 mt-1">تاريخ الانشاء: 04/05/2024</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">العراق</span>
          <span className="text-gray-600">الفاتورة</span>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <span className="text-2xl">📄</span>
          </div>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsCards.map((card, index) => (
          <div
            key={index}
            className="bg-sidebar hover:bg-gray-50 transition-colors cursor-pointer rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
