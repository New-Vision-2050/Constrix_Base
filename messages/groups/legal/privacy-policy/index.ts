import { _m, MessagesGroup } from "../../../types";

export const privacyPolicyMessages = new MessagesGroup({
  title: _m("Privacy Policy", "سياسة الخصوصية"),
  metaDescription: _m(
    "Learn how we collect, use, store, and protect your information.",
    "تعرف على كيفية جمع معلوماتك واستخدامها وتخزينها وحمايتها."
  ),
  lastUpdated: _m("Last Updated", "آخر تحديث"),
  updatedDate: _m("May 3, 2026", "3 مايو 2026"),
  intro: _m(
    "This Privacy Policy explains how our application collects, uses, stores, and protects your information when you use our services.",
    "توضح سياسة الخصوصية هذه كيفية جمع تطبيقنا واستخدامه وتخزينه وحماية معلوماتك عند استخدام خدماتنا."
  ),
  onThisPage: _m("On this page", "في هذه الصفحة"),
  sectionsNavAriaLabel: _m(
    "Privacy policy sections",
    "أقسام سياسة الخصوصية"
  ),
  sectionSuffix: _m("section", "قسم"),
  contactUs: _m("Contact Us", "تواصل معنا"),
  contactDescription: _m(
    "Questions about this Privacy Policy",
    "أسئلة حول سياسة الخصوصية"
  ),
  contactBody: _m(
    "If you have any questions regarding this Privacy Policy, please contact us at:",
    "إذا كانت لديك أي أسئلة بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر:"
  ),
  sections: new MessagesGroup({
    informationWeCollect: new MessagesGroup({
      title: _m("Information We Collect", "المعلومات التي نجمعها"),
      accountInformation: _m("Account Information", "معلومات الحساب"),
      accountBody: _m(
        "We may collect your name, email address, phone number, and account details when you register or use our services.",
        "قد نجمع اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وتفاصيل حسابك عند التسجيل أو استخدام خدماتنا."
      ),
      locationInformation: _m("Location Information", "معلومات الموقع"),
      locationBody: _m(
        "Our application may request access to your device location in order to provide location-based features such as attendance verification, navigation, nearby services, or other functionality within the app.",
        "قد يطلب تطبيقنا الوصول إلى موقع جهازك لتوفير ميزات تعتمد على الموقع مثل التحقق من الحضور، والتنقل، والخدمات القريبة، أو وظائف أخرى داخل التطبيق."
      ),
      locationNote: _m(
        "Location data is collected only while required for these features and is not used for advertising purposes.",
        "يتم جمع بيانات الموقع فقط عند الحاجة لهذه الميزات ولا تُستخدم لأغراض إعلانية."
      ),
      deviceInformation: _m("Device Information", "معلومات الجهاز"),
      deviceBody: _m(
        "We may collect device information including device model, operating system version, app version, crash logs, and diagnostic information.",
        "قد نجمع معلومات الجهاز بما في ذلك طراز الجهاز وإصدار نظام التشغيل وإصدار التطبيق وسجلات الأعطال ومعلومات التشخيص."
      ),
    }),
    howWeUse: new MessagesGroup({
      title: _m("How We Use Your Information", "كيف نستخدم معلوماتك"),
      provideServices: _m(
        "Provide and maintain our services.",
        "تقديم خدماتنا والحفاظ عليها."
      ),
      verifyAttendance: _m(
        "Verify attendance or location-based actions.",
        "التحقق من الحضور أو الإجراءات المرتبطة بالموقع."
      ),
      improvePerformance: _m(
        "Improve application performance.",
        "تحسين أداء التطبيق."
      ),
      customerSupport: _m(
        "Respond to customer support requests.",
        "الرد على طلبات دعم العملاء."
      ),
      security: _m(
        "Ensure security and prevent fraud.",
        "ضمان الأمان ومنع الاحتيال."
      ),
      legalObligations: _m(
        "Comply with legal obligations.",
        "الامتثال للالتزامات القانونية."
      ),
    }),
    dataSharing: new MessagesGroup({
      title: _m("Data Sharing", "مشاركة البيانات"),
      body: _m(
        "We do not sell your personal information. Information may be shared only with trusted service providers who assist us in operating our services or when required by law.",
        "لا نبيع معلوماتك الشخصية. قد تُشارَك المعلومات فقط مع مزودي خدمات موثوقين يساعدوننا في تشغيل خدماتنا أو عندما يقتضي القانون ذلك."
      ),
    }),
    dataSecurity: new MessagesGroup({
      title: _m("Data Security", "أمن البيانات"),
      body: _m(
        "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.",
        "نطبق تدابير تقنية وتنظيمية معقولة لحماية معلوماتك الشخصية من الوصول أو الإفصاح أو التعديل أو الإتلاف غير المصرح به."
      ),
    }),
    dataRetention: new MessagesGroup({
      title: _m("Data Retention", "الاحتفاظ بالبيانات"),
      body: _m(
        "We retain your information only for as long as necessary to provide our services or comply with legal obligations.",
        "نحتفظ بمعلوماتك فقط للمدة اللازمة لتقديم خدماتنا أو الامتثال للالتزامات القانونية."
      ),
    }),
    yourRights: new MessagesGroup({
      title: _m("Your Rights", "حقوقك"),
      body: _m(
        "Depending on your location, you may have the right to access, update, correct, or delete your personal information by contacting us.",
        "بحسب موقعك، قد يكون لك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو تصحيحها أو حذفها من خلال التواصل معنا."
      ),
    }),
    childrensPrivacy: new MessagesGroup({
      title: _m("Children's Privacy", "خصوصية الأطفال"),
      body: _m(
        "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children.",
        "خدماتنا غير موجهة للأطفال دون سن 13 عامًا. ولا نجمع عن قصد معلومات شخصية من الأطفال."
      ),
    }),
    thirdPartyServices: new MessagesGroup({
      title: _m("Third-Party Services", "خدمات الطرف الثالث"),
      body: _m(
        "Our application may use third-party services such as analytics, authentication, cloud hosting, push notifications, and mapping providers. These services may process information in accordance with their own privacy policies.",
        "قد يستخدم تطبيقنا خدمات طرف ثالث مثل التحليلات والمصادقة والاستضافة السحابية والإشعارات الفورية ومزودي الخرائط. وقد تعالج هذه الخدمات المعلومات وفقًا لسياسات الخصوصية الخاصة بها."
      ),
    }),
    policyChanges: new MessagesGroup({
      title: _m("Changes to This Privacy Policy", "التغييرات على سياسة الخصوصية"),
      body: _m(
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated revision date.",
        "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات في هذه الصفحة مع تاريخ التحديث."
      ),
    }),
  }),
});
