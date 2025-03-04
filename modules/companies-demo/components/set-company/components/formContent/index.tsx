import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SetCompanySchema } from "@/modules/companies-demo/schema/SetCompany";
import CustomSelect from "./fields/CustomSelect";
import { Input } from "@/components/ui/input";
import PhoneInput from "./fields/PhoneField";
import { CompanyService } from "@/modules/companies-demo/services/CompanyService";
import { CompanyRepository } from "@/modules/companies-demo/repositories/CompanyRepository";

export default function SetCompanyFormContent() {
  const companyRepository = new CompanyRepository();
  const companyService = new CompanyService(companyRepository);
  const form = useForm<SetCompanySchema>({
    defaultValues: {},
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: SetCompanySchema) => {
    try {
      console.log("Submitted Data:", data, errors);
      companyService.createCompany({
        name: data.name,
        email: data.email,
        phone: data.phone,
        countryId: data.countryId,
        companyTypeId: data.companyTypeId,
        companyFieldId: data.companyFieldId,
        generalManagerId: data.generalManagerId,
        registrationTypeId: data.registrationTypeId,
        registrationNo: data.registrationNo,
        classificationNo: data.classificationNo,
      });
    } catch (error) {
      console.log("error in onsubmit", error);
    }
  };

  // Watching fields
  const countryId = watch("countryId");
  const companyTypeId = watch("companyTypeId");
  const companyFieldId = watch("companyFieldId");
  const registrationTypeId = watch("registrationTypeId");
  const registrationNo = watch("registrationNo");
  const classificationNo = watch("classificationNo");
  const name = watch("name");
  const generalManagerId = watch("generalManagerId");
  const email = watch("email");
  const phone = watch("phone");

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* country */}
        <CustomSelect
          name="countryId"
          control={control}
          options={[
            { label: "Country 1", value: "com-1" },
            { label: "Country 2", value: "com-2" },
            { label: "Country 3", value: "com-3" },
          ]}
          placeholder="دولة الشركة"
          error={Boolean(errors.countryId)}
          errorMessage={errors?.countryId?.message ?? ""}
        />

        {/* company type - appears only if countryId is selected */}
        {countryId && (
          <CustomSelect
            name="companyTypeId"
            control={control}
            options={[
              { label: "كيان 1", value: "com-1" },
              { label: "كيان 2", value: "com-2" },
              { label: "كيان 3", value: "com-3" },
            ]}
            placeholder="كيان الشركة"
            error={Boolean(errors.companyTypeId)}
            errorMessage={errors?.companyTypeId?.message ?? ""}
          />
        )}

        {/* company field type - appears only if companyTypeId is selected */}
        {companyTypeId && (
          <CustomSelect
            name="companyFieldId"
            control={control}
            options={[
              { label: "مجال 1", value: "com-1" },
              { label: "مجال 2", value: "com-2" },
              { label: "مجال 3", value: "com-3" },
            ]}
            placeholder="مجال الشركة"
            error={Boolean(errors.companyFieldId)}
            errorMessage={errors?.companyFieldId?.message ?? ""}
          />
        )}

        {/* register type - appears only if companyFieldId is selected */}
        {companyFieldId && (
          <CustomSelect
            name="registrationTypeId"
            control={control}
            options={[
              { label: "نوع تسجيل 1", value: "com-1" },
              { label: "نوع تسجيل 2", value: "com-2" },
              { label: "نوع تسجيل 3", value: "com-3" },
            ]}
            placeholder="نوع التسجيل"
            error={Boolean(errors.registrationTypeId)}
            errorMessage={errors?.registrationTypeId?.message ?? ""}
          />
        )}

        {/* register field - appears only if registrationTypeId is selected */}
        {registrationTypeId &&
          (registrationTypeId === "com-1" ? (
            <Input
              variant="secondary"
              type="text"
              label="رقم السجل التجاري يبدء بـ (1-4-7)"
              {...register("registrationNo")}
            />
          ) : (
            <Input
              variant="secondary"
              type="text"
              label="رقم التصنيف"
              {...register("classificationNo")}
            />
          ))}

        {/* company name - appears only if registrationNo or classificationNo is filled */}
        {(registrationNo || classificationNo) && (
          <Input
            variant="secondary"
            type="text"
            label="اسم الشركة"
            {...register("name")}
            error={errors?.registrationTypeId?.message ?? ""}
          />
        )}

        {/* general manager - appears only if name is filled */}
        {name && (
          <CustomSelect
            name="generalManagerId"
            control={control}
            options={[
              { label: "مدير 1", value: "com-1" },
              { label: "مدير 2", value: "com-2" },
              { label: "مدير 3", value: "com-3" },
            ]}
            placeholder="مدير الدعم"
            error={Boolean(errors.generalManagerId)}
            errorMessage={errors?.generalManagerId?.message ?? ""}
          />
        )}

        {/* company email - appears only if generalManagerId is selected */}
        {generalManagerId && (
          <Input
            variant="secondary"
            type="email"
            label="البريد الالكتروني"
            {...register("email")}
            error={errors?.email?.message ?? ""}
          />
        )}

        {email && <PhoneInput name="phone" />}

        {/* user name - appears only if email is filled */}
        {phone && (
          <Input
            variant="secondary"
            type="text"
            label="اسم المستخدم"
            {...register("userName")}
            error={errors?.userName?.message ?? ""}
          />
        )}

        {/* submit button - appears only if userName is filled */}
        {watch("userName") && (
          <Button type="submit" className="w-full max-w-sm">
            تحقق من البيانات
          </Button>
        )}
      </form>
    </FormProvider>
  );
}
