import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useTranslations } from "next-intl";

type PropsT = {
  offer?: JobOffer;
};


export const JobOfferFormConfig = ({ offer }: PropsT) => {
  const t = useTranslations("JobOffer");
  const { user } = useUserProfileCxt();
  const { handleRefetchJobOffer } = useFunctionalContractualCxt();
  const jobOfferFormConfig: FormConfig = {
    formId: `job-offer-data-form-${offer?.id}`,
    sections: [
      {
        fields: [
          {
            name: "job_offer_number",
            label: t("OfferNumber"),
            type: "text",
            placeholder: t("OfferNumber"),
            validation: [
              {
                type: "required",
                message: t("OfferNumberRequired"),
              },
            ],
          },
          {
            label: t("SendDate"),
            type: "date",
            name: "date_send",
            placeholder: t("SendDate"),
            validation: [
              {
                type: "required",
                message: t("SendDateRequired"),
              },
            ],
          },
          {
            label: t("ApprovalDate"),
            type: "date",
            name: "date_accept",
            placeholder: t("ApprovalDate"),
            validation: [
              {
                type: "required",
                message: t("ApprovalDateRequired"),
              },
            ],
          },
          {
            label: t("AttachOffer"),
            type: "image",
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
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
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
