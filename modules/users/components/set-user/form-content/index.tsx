import CustomSelect from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { userSchema, UserSchemaT } from "@/modules/users/schema/set-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import PhoneInput from "../../../../../components/shared/PhoneField";
import { UserRepository } from "@/modules/users/repositories/UserRepository";
import { UserService } from "@/modules/users/services/UserService";
import { AxiosError } from "axios";
import { useState } from "react";
import { useSetUserLookupsCxt } from "../context/SetUserLookups";
import InputField from "@/components/shared/InputField";
import TimeZoneDialog from "../change-time-zone";

type PropsT = {
  companyId?: string;
};

export default function UserFormContent({ companyId }: PropsT) {
  // declare and define component state and variables
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const [countryCode, setCountryCode] = useState("");
  const { jobTitles } = useSetUserLookupsCxt();
  const form = useForm<UserSchemaT>({
    resolver: zodResolver(userSchema),
    defaultValues: {},
    mode: "onBlur",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // declare and define component methods
  const onSubmit = async (data: UserSchemaT) => {
    try {
      console.log("datadata", data);
      await userService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        title: data.title,
        companyId,
        countryCode,
      });

      // Show error message
      toast.success("Success", {
        description: "User Created Successfully",
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

  // return our component ui
  return (
    <FormProvider {...form}>
      {/* Sonner Toast Provider */}
      <Toaster position="bottom-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* first name */}
        <InputField
          required={true}
          fieldName="firstName"
          label="اسم المستخدم الاول"
          placeholder="اسم المستخدم الاول"
          errMsg={errors?.firstName?.message ?? ""}
        />
        {/* last name */}
        <InputField
          required={true}
          fieldName="lastName"
          label="اسم المستخدم الاخير"
          placeholder="اسم المستخدم الاخير"
          errMsg={errors?.lastName?.message ?? ""}
        />
        {/* email */}
        <InputField
          required={true}
          fieldName="email"
          label="البريد الالكتروني"
          placeholder="البريد الالكتروني"
          errMsg={errors?.email?.message ?? ""}
        />
        {/* phone */}
        <PhoneInput
          name="phone"
          required={true}
          errMsg={errors?.phone?.message ?? ""}
          setCountryCode={setCountryCode}
        />
        {/* title */}
        <CustomSelect
          name="title"
          required={true}
          control={control}
          options={jobTitles?.map((ele) => ({
            label: ele.name,
            value: ele.id,
          }))}
          placeholder="المسمى الوظيفي"
          error={Boolean(errors.title)}
          errorMessage={errors?.title?.message ?? ""}
        />

        {/* Change Time Zone ? */}
        <div className="flex items-center mb-4 text-lg font-medium">
          <input
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-[#140F35] border-gray-300 rounded-sm "
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-lg font-medium text-[#e7e3fc61] dark:text-gray-300"
          >
            لتأكيد تغيير المنطقة الزمنية،
          </label>
          <TimeZoneDialog />.
        </div>

        <Button type="submit" className="w-full max-w-sm">
          حفظ
        </Button>
      </form>
    </FormProvider>
  );
}
