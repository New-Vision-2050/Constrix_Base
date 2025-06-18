import { FormConfig, useFormStore } from "@/modules/form-builder";
import InvalidMailDialog from "./InvalidMailDialog";
import { UsersTypes } from "../../constants/users-types";

type PropsT = {
  formId: string;
  currentRole?: string;
  formConfig: (
    userId: string,
    branchesIds?: string[],
    roleTwoIds?: string[], //client
    roleThreeIds?: string[], //broker
    handleOnSuccess?: () => void
  ) => FormConfig;
  handleCloseForm?: () => void;
};

export default function RetrieveClientBrokerData(props: PropsT) {
  // extract data from props
  const { formId, handleCloseForm, currentRole, formConfig } = props;

  // reach form values
  const formValues = useFormStore((state) => state.forms[formId]?.values);

  // handle set user data in employee form
  const handleClick = () => {
    // prepare vars
    const payload = JSON.parse(formValues.payload);
    const phone = (payload?.phone as string) ?? "";
    const residence = (payload?.identity as string) ?? "";
    const name = (payload?.name as string) ?? "";
    const country_id = (payload?.country_id as string) ?? "";
    console.log("payload_payload", payload);
    // set data
    useFormStore.getState().setValues(formId, { phone });
    useFormStore.getState().setValues(formId, { name });
    useFormStore.getState().setValues(formId, { residence });
    useFormStore.getState().setValues(formId, { country_id });

    // set error to null
    useFormStore.getState().setError(formId, "email", null);
  };

  if (formValues?.employee_in_company == 1)
    return (
      <InvalidMailDialog
        formId={formId}
        dialogStatement="البريد الإلكتروني أدناه مضاف مسبقًا"
        onSuccess={() => {
          handleCloseForm?.();
        }}
        btnText={currentRole === UsersTypes.Client?`لأضافته كعميل لفرع أخر أضغط هنا`:`لأضافته كوسيط لفرع أخر أضغط هنا`}
        currentRole={currentRole ?? UsersTypes.Broker}
        formConfig={formConfig}
      />
    );

  return (
    <p className="text-white">
      الموظف مسجل لدي شركة أخري{" "}
      <span onClick={handleClick} className="text-primary cursor-pointer">
        أضغط هنا لأسترجاع
      </span>
    </p>
  );
}
