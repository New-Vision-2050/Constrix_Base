import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SetCompanySchema } from "@/modules/companies-demo/schema/SetCompany";
import CustomSelect from "./fields/CustomSelect";
import { Input } from "@/components/ui/input";

export default function SetCompanyFormContent() {
  const { control, handleSubmit, watch, register } = useForm<SetCompanySchema>({
    defaultValues: {},
  });

  const onSubmit = (data: SetCompanySchema) => {
    console.log("Submitted Data:", data);
  };

  // Watching fields
  const countryId = watch("countryId");
  const companyTypeId = watch("companyTypeId");
  const companyFieldId = watch("companyFieldId");
  const registrationTypeId = watch("registrationTypeId");
  const registrationNo = watch("registrationNo");
  const classificationNo = watch("classificationNo");
  const companyName = watch("companyName");
  const generalManagerId = watch("generalManagerId");
  const companyEmail = watch("companyEmail");

  console.log("registrationTypeId", registrationTypeId);

  return (
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
          {...register("companyName")}
        />
      )}

      {/* general manager - appears only if companyName is filled */}
      {companyName && (
        <CustomSelect
          name="generalManagerId"
          control={control}
          options={[
            { label: "مدير 1", value: "com-1" },
            { label: "مدير 2", value: "com-2" },
            { label: "مدير 3", value: "com-3" },
          ]}
          placeholder="مدير الدعم"
        />
      )}

      {/* company email - appears only if generalManagerId is selected */}
      {generalManagerId && (
        <Input
          variant="secondary"
          type="email"
          label="البريد الالكتروني"
          {...register("companyEmail")}
        />
      )}

      {/* user name - appears only if companyEmail is filled */}
      {companyEmail && (
        <Input
          variant="secondary"
          type="text"
          label="اسم المستخدم"
          {...register("userName")}
        />
      )}

      {/* submit button - appears only if userName is filled */}
      {watch("userName") && (
        <Button type="submit" className="w-full max-w-sm">
          تحقق من البيانات
        </Button>
      )}
    </form>
  );
}
