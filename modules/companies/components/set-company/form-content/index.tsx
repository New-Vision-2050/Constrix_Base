import { FormProvider, useForm } from "react-hook-form";
import { CompanyRepository } from "../../../repositories/CompanyRepository";
import { CompanyService } from "../../../services/CompanyService";
import { companySchema, SetCompanySchema } from "../../../schema/SetCompany";
import CustomSelect from "./components/CustomSelect";
import { Button } from "@/components/ui/button";
import AdornedInput from "./components/StartAdornedInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompanyFormLookupsCxt } from "../context/form-lookups";

export default function SetCompanyFormContent() {
  // control and state for
  const companyRepository = new CompanyRepository();
  const companyService = new CompanyService(companyRepository);
  const { countries, fields, users } = useCompanyFormLookupsCxt();
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
  const onSubmit = (data: SetCompanySchema) => {
    console.log("Data Submitted", data);
    try {
      companyService.createCompany({
        name: data.name,
        domainName: data.domainName,
        countryId: data.countryId,
        companyFieldId: data.companyFieldId,
        supportNvEmployeeId: data.supportNvEmployeeId,
      });
    } catch (error) {
      console.log("error in onsubmit", error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* country */}
        <CustomSelect
          name="countryId"
          control={control}
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
          options={fields?.map((ele) => ({ label: ele.name, value: ele.id }))}
          placeholder="النشاط"
          error={Boolean(errors.companyFieldId)}
          errorMessage={errors?.companyFieldId?.message ?? ""}
        />

        {/* company name */}
        <AdornedInput
          fieldName="name"
          label="الاسم التجاري"
          errMsg={errors?.name?.message ?? ""}
        />
        {/* domain name */}
        <AdornedInput
          fieldName="domainName"
          label="الاسم المختصر"
          sAdornment=".constrix.com"
          errMsg={errors?.domainName?.message ?? ""}
        />

        {/* support employee */}
        <CustomSelect
          name="supportNvEmployeeId"
          control={control}
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
