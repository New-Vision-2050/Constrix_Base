"use client";
import { FormProvider, useForm } from "react-hook-form";
import { CompanyRepository } from "../../../repositories/CompanyRepository";
import { CompanyService } from "../../../services/CompanyService";
import { companySchema, SetCompanySchema } from "../../../schema/SetCompany";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompanyFormLookupsCxt } from "../context/form-lookups";
import { toast, Toaster } from "sonner";
import { AxiosError } from "axios";
import CustomSelect from "@/components/shared/CustomSelect";
import InputField from "../../../../../components/shared/InputField";
import InputFieldWithAdorned from "../../../../../components/shared/InputFieldWithAdorned";

export default function SetCompanyFormContent() {
  // control and state for
  const companyRepository = new CompanyRepository();
  const companyService = new CompanyService(companyRepository);
  const { countries, fields, users, onModuleClose } =
    useCompanyFormLookupsCxt();
  const form = useForm<SetCompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {},
    mode: "onBlur",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // component helpers
  const onSubmit = async (data: SetCompanySchema) => {
    try {
      const response = await companyService.createCompany({
        name: data.name,
        domainName: data.domainName,
        countryId: data.countryId,
        companyFieldId: data.companyFieldId,
        supportNvEmployeeId: data.supportNvEmployeeId,
      });

      if (Boolean(onModuleClose)) onModuleClose?.(response);

      // Show error message
      toast.success("Success", {
        description: "Company Created Successfully",
        duration: 3000,
        dismissible: true,
      });
    } catch (error) {
      const axError = error as AxiosError;
      // Show error message
      toast.error("Failed", {
        description:
          axError?.message ?? "Please check your inputs and try again.",
        duration: 3000,
        dismissible: true,
      });
    }
  };

  return (
    <FormProvider {...form}>
      {/* Sonner Toast Provider */}
      <Toaster position="bottom-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* country */}
        <CustomSelect
          name="countryId"
          control={control}
          required={true}
          options={countries?.map((ele) => ({
            label: ele.name,
            value: ele.id,
          }))}
          placeholder="دولة الشركة"
          error={Boolean(errors.countryId)}
          errorMessage={errors?.countryId?.message ?? ""}
        />
        {/* field */}
        <CustomSelect
          name="companyFieldId"
          control={control}
          required={true}
          options={fields?.map((ele) => ({ label: ele.name, value: ele.id }))}
          placeholder="النشاط"
          error={Boolean(errors.companyFieldId)}
          errorMessage={errors?.companyFieldId?.message ?? ""}
        />

        {/* company name */}
        <InputField
          required={true}
          fieldName="name"
          label="الاسم التجاري"
          placeholder="الاسم التجاري"
          errMsg={errors?.name?.message ?? ""}
        />
        {/* domain name */}
        <InputFieldWithAdorned
          required={true}
          fieldName="domainName"
          label="الاسم المختصر"
          placeholder="الاسم المختصر"
          endAdornment={<p>.constrix.com</p>}
          errMsg={errors?.domainName?.message ?? ""}
        />

        {/* support employee */}
        <CustomSelect
          name="supportNvEmployeeId"
          control={control}
          required={true}
          options={users?.map((ele) => ({ label: ele.name, value: ele.id }))}
          placeholder="مسؤول الدعم"
          error={Boolean(errors.supportNvEmployeeId)}
          errorMessage={errors?.supportNvEmployeeId?.message ?? ""}
        />

        {/* next */}
        <Button type="submit" className="w-full max-w-sm">
          التالي
        </Button>
      </form>
    </FormProvider>
  );
}
