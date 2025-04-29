import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";

type PropsT = {
  offer?: JobOffer;
};

export const JobOfferFormConfig = ({ offer }: PropsT) => {
  const { user } = useUserProfileCxt();
  const { handleRefetchJobOffer } = useFunctionalContractualCxt();

  const jobOfferFormConfig: FormConfig = {
    formId: `job-offer-data-form-${offer?.id}`,
    sections: [
      {
        fields: [
          {
            name: "job_offer_number",
            label: "رقم العرض",
            type: "text",
            placeholder: "رقم العرض",
            required: true,
            validation: [
              {
                type: "required",
                message: "رقم العرض مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الارسال",
            type: "date",
            name: "date_send",
            placeholder: "تاريخ الارسال",
            maxDate: {
              formId: `job-offer-data-form-${offer?.id}`,
              field: 'date_accept'
            },
            validation: [
              {
                type: "required",
                message: "تاريخ الارسال مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الموافقة",
            type: "date",
            name: "date_accept",
            placeholder: "تاريخ الموافقة",
            minDate: {
              formId: `job-offer-data-form-${offer?.id}`,
              field: 'date_send'
            },
            validation: [
              {
                type: "required",
                message: "تاريخ الموافقة مطلوب",
              },
            ],
          },
          {
            label: "ارفاق العرض",
            type: "file",
            name: "file",
            placeholder: "job_offer.pdf",
          },
        ],
      },
    ],
    initialValues: {
      job_offer_number: offer?.job_offer_number,
      date_send: offer?.date_send,
      date_accept: offer?.date_accept,
      file: offer?.files,
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchJobOffer();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const dateSend = new Date(formData?.date_send as string);
      const dateAccept = new Date(formData?.date_accept as string);

      //job_offer_number,date_send,date_accept,file,user_id

      const body = {
        ...formData,
        user_id: user?.user_id,
        date_send: formatDateYYYYMMDD(dateSend),
        date_accept: formatDateYYYYMMDD(dateAccept),
      };

      const response = await apiClient.post(`/job_offers`, serialize(body));

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return jobOfferFormConfig;
};
