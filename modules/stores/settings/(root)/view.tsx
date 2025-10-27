"use client";

export default function StoreSettingsView() {
  // Settings cards data based on the design
  const settingsCards = [
    {
      title: "طرق الدفع",
      description: "اضافة وتعديل طرق الدفع المتاحة",
    },
    {
      title: "اللغة والعملات",
      description: "اللغة العربية - ريال سعودي",
    },
    {
      title: "تصميم المتجر",
      description: "اختيار وتعديل تصميم المتجر",
    },
    {
      title: "بيانات المتجر",
      description: "تعديل بيانات متجر ابعاد الرؤية",
    },
    {
      title: "الشروط والاحكام",
      description: "تعديل شروط واحكام الاستخدام",
    },
    {
      title: "ادارة المخازن",
      description: "اضافة وتعديل مخازن المتجر",
    },
    {
      title: "الشحن والتوصيل",
      description: "اضافة وتعديل طرق الشحن والتوصيل",
    },
    {
      title: "ايام المناسبات",
      description: "تحديد ايام المناسبات الخاصة بالمتجر",
    },
    {
      title: "اعدادات الفاتورة",
      description: "تخصيص الفاتورة للعميل",
    },
    {
      title: "خصائص الطلبات والمنتجات",
      description: "ادارة خصائص الطلبات والمنتجات",
    },
    {
      title: "الحقول المخصصة",
      description: "ادارة الحقول المخصصة للمنتج",
    },
    {
      title: "اتمام عملية الشراء",
      description: "ادارة مخاطة اتمام عملية الشراء",
    },
    {
      title: "ادارة الرسائل",
      description: "ادارة ورسائل المتجر",
    },
    {
      title: "ادارة فريق العمل",
      description: "ادارة اعضاء فريق العمل ومهامهم",
    },
    {
      title: "مركز المساعدة",
      description: "ادارة طرق مساعدة العميل",
    },
    {
      title: "تذاكر الدعم",
      description: "ادارة تذاكر الدعم الخاصة بالعملاء",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 bg-sidebar p-6 rounded-2xl shadow-md">
        <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
          <div className="text-sm text-center text-gray-700">
            لا يلزم تحميل لوجو الشركة
          </div>
        </div>
        <div className="h-full grow">
          <h4 className="text-3xl font-bold text-primary-foreground mb-4">
            ابعاد الرؤية للاستشارات الهندسية
          </h4>
          <p className="text-gray-600 mt-1">تاريخ الانشاء: 04/05/2024</p>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsCards.map((card, index) => (
          <div
            key={index}
            className="bg-sidebar transition-colors cursor-pointer rounded-lg p-6 shadow-sm border  hover:shadow-md"
          >
            <div className="flex flex-col items-start text-start space-y-3">
              {/* <div className="text-3xl mb-2">{card.icon}</div> */}
              <h3 className="font-semibold text-sidebar-foreground text-lg">
                {card.title}
              </h3>
              <p className="text-sidebar-primary-foreground text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
