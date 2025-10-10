import { useSheetForm } from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import FormBuilder from "@/modules/form-builder/components/FormBuilder";
import { getCreateNewDirConfig } from "./CreateNewDirConfig";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { useMemo } from "react";

interface PropsType {
  onClose: () => void;
}
export default function CreateNewDirForm({ onClose }: PropsType) {
  const { refetchDocs, editedDoc, parentId, setEditedDoc } = usePublicDocsCxt();
  const t = useTranslations("docs-library.publicDocs.createNewDirDialog");

  const onSuccessFn = () => {
    onClose();
    setEditedDoc(undefined);
    refetchDocs();
  };

  const _config = useMemo(
    () => getCreateNewDirConfig(t, onSuccessFn, editedDoc, parentId),
    [editedDoc, parentId]
  );

  // form builder vars
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

  // create individual client form
  return (
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
  );
}
