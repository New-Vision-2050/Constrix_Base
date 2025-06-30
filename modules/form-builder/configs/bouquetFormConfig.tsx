import {FormConfig, useFormStore} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";

export function GetBouquetFormConfig(t:ReturnType<typeof useTranslations>): FormConfig {
    return {
      formId: "bouquet-form",
      title: "اضافة باقة",
      apiUrl: `${baseURL}/bouquets`,
      laravelValidation: {
        enabled: true,
        errorsPath: "errors", // This is the default in Laravel
      },
      sections: [
        {
          collapsible: false,
          fields: [
            {
              name: "name",
              label: "اسم الباقة",
              type: "text",
              placeholder: "اسم الباقة",
              required: true,
            },
            {
              name: "price",
              label: "قيمة الاشتراك",
              type: "number",
              placeholder: "قيمة الاشتراك",
              required: true,
              postfix: (
                <div className="flex items-center px-3 text-gray-500">
                  ر.س
                </div>
              ),
            },
            {
              name: "duration",
              label: "مدة الاشتراك",
              type: "number",
              placeholder: "أدخل مدة الاشتراك",
              required: true,
              defaultValue: "12",
              postfix: (
                <div className="w-full h-full">
                  <select
                    className="rounded-lg p-2 bg-transparent border-0 outline-none"
                    defaultValue="month"
                    onChange={(e) => {
                      useFormStore
                        .getState()
                        .setValues("bouquet-form", {
                          duration_unit: e.target.value,
                        });
                    }}
                  >
                    <option value="day" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      يوم
                    </option>
                    <option value="week" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      أسبوع
                    </option>
                    <option value="month" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      شهر
                    </option>
                    <option value="year" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      سنة
                    </option>
                  </select>
                </div>
              ),
            },
            {
              name: "duration_unit",
              type: "hiddenObject",
              label: "duration_unit",
              defaultValue: "month",
            },
            {
              name: "category",
              label: "مجالات الباقة",
              type: "select",
              placeholder: "اختر مجال الباقة",
              required: true,
              options: [
                { value: "هندسي", label: "هندسي" },
                { value: "إداري", label: "إداري" },
                { value: "مالي", label: "مالي" },
                { value: "تقني", label: "تقني" },
                { value: "تسويقي", label: "تسويقي" },
                { value: "قانوني", label: "قانوني" },
                { value: "طبي", label: "طبي" },
                { value: "تعليمي", label: "تعليمي" },
              ],
            },
            {
              name: "features_count",
              label: "عدد الخدمات",
              type: "number",
              placeholder: "عدد الخدمات المتاحة",
              required: true,
            },
            {
              name: "description",
              label: "وصف الباقة",
              type: "textarea",
              placeholder: "وصف تفصيلي للباقة",
              required: false,
            },
            {
              type: "checkboxGroup",
              name: "features",
              label: "",
              optionsTitle: "الخدمات المتاحة",
              isMulti: true,
              fieldClassName:
                "bg-background border border-border rounded-md p-2",
              dynamicOptions: {
                url: `${baseURL}/services`,
                valueField: "id",
                labelField: "name",
                searchParam: "name",
                paginationEnabled: true,
                pageParam: "page",
                limitParam: "per_page",
                itemsPerPage: 10,
                totalCountHeader: "X-Total-Count",
              },
            },
            {
              name: "status",
              label: "حالة الباقة",
              type: "select",
              placeholder: "اختر حالة الباقة",
              required: true,
              defaultValue: "active",
              options: [
                { value: "active", label: "نشط" },
                { value: "inActive", label: "غير نشط" },
              ],
            },
          ],
        },
      ],
      submitButtonText: "حفظ",
      cancelButtonText: "إلغاء",
      showReset: false,
      resetButtonText: "Clear Form",
      showSubmitLoader: true,
      resetOnSuccess: true,
      showCancelButton: false,
      showBackButton: false,
      editDataTransformer: (data) => {
        return {
          name: data.name,
          price: data.price,
          duration: data.duration,
          category: data.category,
          features_count: data.features_count,
          description: data.description,
          features: data.features,
          status: data.status,
        };
      },

      // Example onSuccess handler
      onSuccess: (values, result) => {
        console.log("Bouquet form submitted successfully with values:", values);
        console.log("Result from API:", result);

        // You can perform additional actions here, such as:
        // - Show a custom notification
        // - Navigate to another page
        // - Update application state
        // - Trigger analytics events
        // - etc.
      },

      // Example onError handler
      onError: (values, error) => {
        console.log("Bouquet form submission failed with values:", values);
        console.log("Error details:", error);

        // You can perform additional actions here, such as:
        // - Show a custom error notification
        // - Log the error to an analytics service
        // - Attempt to recover from the error
        // - etc.
      },

      // No onSubmit handler needed - will use the default handler
    };
}
