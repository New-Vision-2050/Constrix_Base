import { FormConfig, useFormStore } from "@/modules/form-builder";
import EmployeeInvalidMailDialog from "./EmployeeInvalidMailDialog";

type PropsT = {
  formId: string;
  dialogStatement?: string;
  formConfig: (
    userId: string,
    branchesIds?: string[],
    roleTwoIds?: string[], //client
    roleThreeIds?: string[], //broker
    handleOnSuccess?: () => void
  ) => FormConfig;
  handleCloseForm?: () => void;
};

export default function RetrieveEmployeeData(props: PropsT) {
  // extract data from props
  const { formId, handleCloseForm, dialogStatement, formConfig } = props;

  // reach form values
  const formValues = useFormStore((state) => state.forms[formId]?.values);

  // handle set user data in employee form
  const handleClick = () => {
    // prepare vars
    const payload = JSON.parse(formValues.payload);
    const phone = (payload?.phone as string) ?? "";
    const name = (payload?.name as string) ?? "";
    const first_name = name?.split(" ")?.[0];
    const last_name = name?.split(" ")?.slice(1).join(" ");
    const country_id = (payload?.country_id as string) ?? "";
    console.log("payload_payload", payload);
    // set data
    useFormStore.getState().setValues(formId, { phone });
    useFormStore.getState().setValues(formId, { first_name });
    useFormStore.getState().setValues(formId, { last_name });
    useFormStore.getState().setValues(formId, { country_id });
    useFormStore.getState().setValues(formId, { mailReceived: true });

    // set error to null
    useFormStore.getState().setError(formId, "email", null);
  };

  if (formValues?.employee_in_company == 1)
    return (
      <EmployeeInvalidMailDialog
        formId={formId}
        dialogStatement={
          dialogStatement || "البريد الإلكتروني أدناه مضاف مسبقًا"
        }
        onSuccess={() => {
          handleCloseForm?.();
        }}
        formConfig={formConfig}
      />
    );

  return (
    <p className="text-white">
      الموظف مسجل لدي شركة أخري {" "}
      <span onClick={handleClick} className="text-primary cursor-pointer">
        أضغط هنا لأسترجاع
      </span>
    </p>
  );
}
