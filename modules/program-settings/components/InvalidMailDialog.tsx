import { useModal } from "@/hooks/use-modal";
import InfoIcon from "@/public/icons/InfoIcon";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFormStore, useSheetForm, FormConfig } from "@/modules/form-builder";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { useMemo } from "react";

type Branch = {
  id: string;
  name: string;
};

type PropsT = {
  formId: string;
  btnText?: string;
  dialogStatement?: string;
  errorStatement?: string;
  onSuccess?: () => void;
  formConfig: (userId: string, branchesIds?: string[], handleOnSuccess?: () => void) => FormConfig;
};
export default function InvalidMailDialog(props: PropsT) {
  //  declare and define component state and variables
  const {
    formId,
    btnText,
    dialogStatement,
    errorStatement,
    onSuccess,
    formConfig
  } = props;
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const [isOpen, handleOpen, handleClose] = useModal();
  const branches: Branch[] = useMemo(() => {
    try {
      return JSON.parse(formValues.branches) || [];
    } catch {
      return [];
    }
  }, [formValues.branches]);

  const branchesIds: string[] = useMemo(() => {
    if (!branches || branches.length === 0) return [];
    return branches.map((branch: Branch) => branch.id);
  }, [branches]);
  const userId = formValues?.user_id;
  const _errorStatement =
    errorStatement ??
    (branches.length > 0
      ? `
          البريد الإلكتروني مسجل لدى الفروع الاتية (${branches
            .map((branch: Branch) => branch.name)
            .join(", ")}) لإضافته في فرع أخر.
        `
      : `البريد الإلكتروني مسجل مسبقا`);

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
      <p className="text-white">
        {_errorStatement}
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
