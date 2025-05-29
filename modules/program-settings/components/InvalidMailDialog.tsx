import { useModal } from "@/hooks/use-modal";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFormStore, useSheetForm, FormConfig } from "@/modules/form-builder";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { useMemo } from "react";
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
  currentRole?: string;
  formConfig: (
    userId: string,
    branchesIds?: string[],
    roleTwoIds?: string[],
    roleThreeIds?: string[],
    handleOnSuccess?: () => void
  ) => FormConfig;
};

export default function InvalidMailDialog(props: PropsT) {
  //  declare and define component state and variables
  const {
    formId,
    btnText,
    dialogStatement,
    onSuccess,
    formConfig,
    currentRole = UsersTypes.Client,
  } = props;
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const [isOpen, handleOpen, handleClose] = useModal();
  const roles: Role[] = useMemo(() => {
    try {
      return JSON.parse(formValues.roles) || [];
    } catch {
      return [];
    }
  }, [formValues.roles]);

  // get user id
  const userId = formValues?.user_id;

  // branches of same role
  const branches = useMemo(() => {
    return roles?.find((role) => role.role.toString() == currentRole)?.branches;
  }, [roles]);

  const branchesNames = useMemo(() => {
    return branches?.map((ele) => ele.name)?.join(",");
  }, [branches]);

  const branchesIds = useMemo(() => {
    return branches?.map((ele) => ele.id);
  }, [branches]);

  // determine same type exist?
  const sameTypeExist = useMemo(() => {
    return branchesIds && branchesIds?.length > 0;
  }, [branchesIds]);

  const employeeBranchesIds = useMemo(() => {
    return roles
      ?.find((role) => role.role.toString() == UsersTypes.Employee)
      ?.branches?.map((ele) => ele.id.toString());
  }, [roles]);

  const brokerBranchesIds = useMemo(() => {
    return roles
      ?.find((role) => role.role.toString() == UsersTypes.Broker)
      ?.branches?.map((ele) => ele.id.toString());
  }, [roles]);

  const employeeExist = useMemo(() => {
    return employeeBranchesIds && employeeBranchesIds?.length > 0;
  }, [employeeBranchesIds]);

  const brokerExist = useMemo(() => {
    return brokerBranchesIds && brokerBranchesIds?.length > 0;
  }, [brokerBranchesIds]);
  // set correct message
  const message = useMemo(() => {
    return sameTypeExist
      ? `البريد الإلكتروني مسجل لدى الفروع الاتية (${branchesNames ?? "-"}) `
      : `يظهر لدينا ان البريد الإلكتروني مسجل
      ${employeeExist ? "كموظف" : ""}
       ${brokerExist ? "كوسيط" : ""}
      على نفس الشركة. `;
  }, [sameTypeExist, branchesNames, employeeExist, brokerExist]);

  // declare and define the form configuration for retrieving broker data
  const handleSuccess = useMemo(() => {
    return () => {
      handleClose();
      onSuccess?.();
    };
  }, [handleClose, onSuccess]);

  const _config = useMemo(
    () =>
      formConfig(
        userId,
        branchesIds,
        employeeBranchesIds,
        brokerBranchesIds,
        handleSuccess
      ),
    [
      userId,
      branchesIds,
      handleSuccess,
      formConfig,
      employeeBranchesIds,
      brokerBranchesIds,
    ]
  );

  // prepare vars which form builder need
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
  } = useSheetForm({ config: _config });

  console.log("userId, roles", roles, formValues.roles);

  // return the JSX for the component
  return (
    <>
      <p className="text-white">
        {message}
        <span onClick={handleOpen} className="text-primary cursor-pointer">
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
