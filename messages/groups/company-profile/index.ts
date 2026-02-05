import {_m, MessagesGroup} from "../../types";

export const companyProfileMessages = new MessagesGroup({
    header: new MessagesGroup({
        placeholder: new MessagesGroup({
            userName: _m("user name", "اسم المستخدم"),
            jobTitle: _m("job title", "الوظيفة"),
            address: _m("address", "العنوان"),
            appointmentDate: _m("Appointment Date", "تاريخ التعيين"),
            image: _m("A 6*4 white background image is required.", "يلزم اضافة صورة خلفية بيضاء 6*4")
        }),
        uploadPhoto: new MessagesGroup({
            title: _m("Upload Image", "أضافة صورة"),
            actions: new MessagesGroup({
                checkLabel: _m("Check Image", "التحقق من الصورة"),
                loadingLabel: _m("Loading...", "جاري التنفيذ..."),
                saveLabel: _m("Save", "حفظ"),
                attachmentLabel: _m("Attach", "ارفاق"),
                title: new MessagesGroup({
                    upload: _m("upload image firstly", "قم برفع الصورة أولأ"),
                    validate: _m("validate Image", "تحقق من الصورة"),
                    save: _m("Save Image", "رفع الصورة")
                })
            }),
            rules: new MessagesGroup({
                rule1: _m("Image size must not exceed 5 MB.", "حجم الصورة لا يتعدى 5 ميجابايت."),
                rule2: _m("Choose an appropriate image size (e.g., 1920x1080 pixels).", "اختر الحجم المناسب للصورة (مثل 1920x1080 بكسل)."),
                rule3: _m("Make sure the background is white.", "تأكد من أن الخلفية بيضاء.")
            })
        })
    }),
    tabs: new MessagesGroup({
        profile: _m("Profile", "الملف الشخصي"),
        contract: _m("Employment Contract", "عقد العمل"),
        attendance: _m("Attendance Policy", "سياسة الحضور"),
        usersActions: _m("User Actions", "اجراءات المستخدم"),
        contractTabs: new MessagesGroup({
            personalTab: _m("Personal Data", "البيانات الشخصية"),
            academicAndExperience: _m("Academic and Experience Data", "البيانات الاكاديمية والخبرة"),
            employmentAndContractalData: _m("Employment and Contractual Data", "البيانات الوظيفية والتعاقدية"),
            financialPrivileges: _m("Financial Benefits", "الامتيازات المالية"),
            contractManagement: _m("Contract Management", "ادارة العقد")
        }),
        verticalLists: new MessagesGroup({
            personalList: new MessagesGroup({
                personalData: _m("Personal Data", "البيانات الشخصية"),
                bankingData: _m("Banking Information", "المعلومات البنكية"),
                connectionData: _m("Contact Information", "معلومات الاتصال"),
                iqamaData: _m("Residence Information", "معلومات الاقامة")
            }),
            academicAndExperienceList: new MessagesGroup({
                qualification: _m("Qualification", "المؤهل"),
                summary: _m("Brief Overview", "نبذه مختصرة"),
                experiences: _m("Previous Experience", "الخبرات السابقة"),
                courses: _m("Educational Courses", "الكورسات التعليمية"),
                certifications: _m("Professional Certifications", "الشهادات المهنية"),
                cv: _m("CV", "السيرة الذاتية")
            })
        }),
        branches: new MessagesGroup({
            assignUsersDialog: new MessagesGroup({
                title: _m("", "صلاحية التعديل علي الفرع"),
                description: _m("", "أعطاء المستخدمين صلاحية التعديل علي الفرع"),
                cancel: _m("", "الغاء"),
                assign: _m("", "تعيين"),
                searchUsers: _m("", "البحث عن مستخدمين"),
                managerNote: _m("", "مدير الشركة :"),
                branchManager: _m("", "مدير الفرع :")
            })
        })
    }),
    branches: new MessagesGroup({
        assignUsersDialog: new MessagesGroup({
            title: _m("Branch Edit Permission", ""),
            description: _m("Give users permission to edit this branch", ""),
            cancel: _m("Cancel", ""),
            assign: _m("Assign", ""),
            searchUsers: _m("Search users", ""),
            managerNote: _m("Company Manager", ""),
            branchManager: _m("Branch Manager :", "")
        })
    }),
    officialDocs: new MessagesGroup({
        docsSettingsDialog: new MessagesGroup({
            title: _m("Document Settings", "اعدادات المستند"),
            addDoc: _m("Add Document", "اضافة مستند"),
            docName: _m("Document Type Name", "اسم نوع المستند"),
            notifySettings: _m("Notification Settings", "اعدادات الاشعارات"),
            shareSettings: _m("Share Settings", "اعدادات المشاركة"),
            cancel: _m("Cancel", "الغاء"),
            save: _m("Save", "حفظ"),
            update: _m("Update", "تعديل"),
            delete: _m("Delete", "حذف"),
            confirm: _m("Confirm", "تأكيد"),
            deleteConfirm: _m("Confirm Delete", "تأكيد الحذف"),
            deleteQuestion: _m("Are you sure you want to delete?", "هل أنت متاكد من الحذف؟"),
            deleteSuccess: _m("deleted successfully", "تم حذف بنجاح"),
            deleteError: _m("Failed to delete", "فشل حذف"),
            deleteConfirmMessage: _m("Are you sure you want to delete this document type?", "تأكيد حذف نوع المستند"),
            errorCase: new MessagesGroup({
                title: _m("Failed to load document types", "فشل في تحميل أنواع المستندات"),
                description: _m("Please check your connection and try again.", "يرجى التحقق من اتصالك ومحاولة مرة أخرى."),
                retry: _m("Retry", "إعادة المحاولة")
            }),
            notifyLoadingCase: _m("Loading notification settings...", "جاري تحميل إعدادات الإشعارات..."),
            notifyErrorCase: new MessagesGroup({
                title: _m("Failed to load notification settings", "فشل في تحميل إعدادات الإشعارات"),
                description: _m("Please check your connection and try again.", "يرجى التحقق من اتصالك ومحاولة مرة أخرى."),
                retry: _m("Retry", "إعادة المحاولة")
            }),
            form: new MessagesGroup({
                title: _m("Notification Settings", "اعدادات الاشعارات"),
                type: _m("Notification Type (Arabic)*", "نوع الاشعار (عبر)*"),
                typePlaceholder: _m("Select notification type", "اختر نوع الاشعار"),
                email: _m("Email", "البريد الالكتروني"),
                emailPlaceholder: _m("Enter email", "ادخل البريد الالكتروني"),
                emailInvalid: _m("Email is invalid", "البريد الالكتروني غير صحيح"),
                sms: _m("SMS", "الرسائل النصية"),
                both: _m("Both", "كلاهما"),
                phone: _m("Phone", "رقم الجوال"),
                phonePlaceholder: _m("Enter phone number", "ادخل رقم الجوال"),
                phoneInvalid: _m("Phone number is invalid", "رقم الجوال غير صحيح"),
                reminder_type: _m("Number of reminder repetitions", "عدد مرات تكرار الاشعارات"),
                reminder_typePlaceholder: _m("Select number of reminder repetitions", "اختر عدد مرات تكرار الاشعارات"),
                daily: _m("Daily", "يومي"),
                weekly: _m("Weekly", "أسبوعي"),
                monthly: _m("Monthly", "شهري"),
                message: _m("Message", "نص الرسالة"),
                messagePlaceholder: _m("Enter message", "ادخل نص الرسالة"),
                submitButtonText: _m("Save Settings", "حفظ الاعدادات")
            })
        })
    })
});
