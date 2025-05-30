import { useModal } from "@/hooks/use-modal";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFormStore, useSheetForm, FormConfig } from "@/modules/form-builder";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { useMemo, useState } from "react";
import ErrorDialog from "@/components/shared/error-dialog";
import { UsersTypes } from "../constants/users-types";

type Branch = {
  id: string;
  name: string;
};

type Role = {
  branches: Branch[];
  role: number;
};

type PropsT = {
  formId: string;
  btnText?: string;
  dialogStatement?: string;
  errorStatement?: string;
  onSuccess?: () => void;
  formConfig: (
    userId: string,
    branchesIds?: string[],
    handleOnSuccess?: () => void
  ) => FormConfig;
};
export default function EmployeeInvalidMailDialog(props: PropsT) {
  //  declare and define component state and variables
  const {
    formId,
    btnText,
    dialogStatement,
    onSuccess,
    formConfig,
  } = props;

  const [isOpen, handleOpen, handleClose] = useModal();
  const formValues = useFormStore((state) => state.forms[formId]?.values);

  // user id
  const userId = formValues?.user_id;

  // retrieve roles
  const roles: Role[] = useMemo(() => {
    try {
      return JSON.parse(formValues.roles) || [];
    } catch {
      return [];
    }
  }, [formValues.roles]);

  // branches of same role
  const branches = useMemo(() => {
    return roles?.find((role) => role.role.toString() == UsersTypes.Employee)
      ?.branches;
  }, [roles]);

  const branchesIds = useMemo(() => {
    return branches?.map((ele) => ele.id);
  }, [branches]);

  // determine same type exist?
  const sameTypeExist = useMemo(() => {
    return branchesIds && branchesIds?.length > 0;
  }, [branchesIds]);
  const employeeInCompany = useMemo(
    () => Boolean(formValues?.employee_in_company) && Boolean(sameTypeExist),
    [formValues, sameTypeExist]
  );
  const [openEmployeeErr, setOpenEmployeeErr] = useState(employeeInCompany);

  // determine other types
  const clientBranches = useMemo(() => {
    return roles?.find((role) => role.role.toString() == UsersTypes.Client)
      ?.branches;
  }, [roles]);

  const brokerBranches = useMemo(() => {
    return roles?.find((role) => role.role.toString() == UsersTypes.Broker)
      ?.branches;
  }, [roles]);

  const clientExist = useMemo(() => {
    return clientBranches && clientBranches?.length > 0;
  }, [clientBranches]);

  const brokerExist = useMemo(() => {
    return brokerBranches && brokerBranches?.length > 0;
  }, [brokerBranches]);

  //sameTypeExist
  const message = useMemo(() => {
    return employeeInCompany
      ? `الأيميل مسجل كموظف مسبقأ فى الشركة`
      : `البريد الإلكتروني مسجل مسبقا 
      ${clientExist ? "كعميل" : ""} 
      ${brokerExist ? "كوسيط" : ""}`;
  }, [employeeInCompany, brokerExist, clientExist]);

  // declare and define the form configuration for retrieving broker data
  const _config = useMemo(
    () =>
      formConfig(userId, branchesIds, () => {
        handleClose();
        onSuccess?.();
      }),
    [userId, branchesIds]
  );

  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    setTouched,
    handleSubmit,
    handleCancel,
    resetForm,
    isWizard,
    isAccordion,
    isStepBased,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData,
    clearFiledError,
  } = useSheetForm({
    config: _config,
  });

  // return the JSX for the component
  return (
    <>
      <ErrorDialog
        isOpen={openEmployeeErr}
        handleClose={() => setOpenEmployeeErr(false)}
        desc={`الموظف مسجل بالفعل فى الشركة مسبقأ`}
      />
      <p className="text-white">
        {message}
        <span
          onClick={() => {
            if (employeeInCompany) setOpenEmployeeErr(true);
            else handleOpen();
          }}
          className="text-primary cursor-pointer"
        >
          {btnText || "اضغط هنا"}
        </span>
      </p>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:min-w-[25rem] gap-8 min-h-[22rem]">
          <DialogTitle className="flex justify-center items-center">
            <InfoIcon
              additionClass="text-primary text-lg"
              width="55"
              height="55"
            />
          </DialogTitle>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col">
              <p className="font-bold text-lg text-center">
                {dialogStatement}
                <br />(<span className="text-primary">{formValues?.email}</span>
                )؟
              </p>
              {/* RetrieveBrokerFormConfig */}
              <FormBuilder
                config={_config}
                values={values}
                errors={errors}
                touched={touched}
                isSubmitting={isSubmitting}
                submitSuccess={submitSuccess}
                submitError={submitError}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                resetForm={resetForm}
                setValue={setValue}
                setTouched={setTouched}
                isWizard={isWizard}
                isAccordion={isAccordion}
                isStepBased={isStepBased}
                currentStep={currentStep}
                totalSteps={totalSteps}
                goToNextStep={goToNextStep}
                goToPrevStep={goToPrevStep}
                goToStep={goToStep}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                submitCurrentStep={submitCurrentStep}
                isSubmittingStep={isSubmittingStep}
                stepResponses={stepResponses}
                getStepResponseData={getStepResponseData}
                clearFiledError={clearFiledError}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
