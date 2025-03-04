import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SetCompanySchema } from "@/modules/companies-demo/schema/SetCompany";
import CustomSelect from "./fields/CustomSelect";
import { Input } from "@/components/ui/input";

export default function SetCompanyFormContent() {
  const { control, handleSubmit, register } = useForm<SetCompanySchema>({
    defaultValues: {},
  });

  const onSubmit = (data: SetCompanySchema) => {
    console.log("Submitted Data:", data);
  };

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
      {/* company type */}
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
      {/* company field type */}
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
      {/* register type   */}
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
      {/* register field */}
      <Input
        variant="secondary"
        type="text"
        label="رقم السجل التجاري يبدء بـ (1-4-7)"
        {...register("registrationNo")}
      />
      {/* company name */}
      <Input
        variant="secondary"
        type="text"
        label="اسم الشركة"
        {...register("companyName")}
      />
      {/* general manager  */}
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
      {/* company email */}
      <Input
        variant="secondary"
        type="email"
        label="البريد الالكتروني"
        {...register("companyEmail")}
      />
      {/* user name  */}
      <Input
        variant="secondary"
        type="text"
        label="اسم المستخدم"
        {...register("userName")}
      />
      {/* submit button */}
      <Button type="submit" className="w-full max-w-sm">
        تحقق من البيانات
      </Button>
    </form>
  );
}
