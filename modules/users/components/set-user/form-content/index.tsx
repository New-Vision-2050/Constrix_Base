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
import { useMemo, useState } from "react";
import { useSetUserLookupsCxt } from "../context/SetUserLookups";
import InputField from "@/components/shared/InputField";
import TimeZoneDialog from "../change-time-zone";
import { useCreateBuilderCxt } from "@/features/create-builder/context/create-builder-cxt";
import { EMAIL_EXIST } from "@/modules/users/constants/end-points";
import RecivedUserDataDialog from "../retrieved-user-data";

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
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { handleManuelCloseSheet } = useCreateBuilderCxt();
  const emailError = useMemo(() => {
    if (errors?.email) {
      const mailErr = errors?.email?.message?.split("#");
      return mailErr;
    }
  }, [errors?.email]);

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
        takeTimeZone: data.takeTimeZone,
        country: data.country,
        timeZone: data.timeZone,
        currency: data.currency,
        lang: data.lang,
      });

      // Show error message
      toast.success("Success", {
        description: "User Created Successfully",
        duration: 3000,
        dismissible: true,
      });

      // close sheet
      handleManuelCloseSheet();
    } catch (error) {
      const axError = error as AxiosError;
      const errorMessage =
        axError?.message ?? "Please check your inputs and try again.";
      const backErrors = error?.response?.data?.errors,
        errorMessages: string[] = [];

      if (typeof backErrors === "object" && backErrors !== null) {
        for (const [key, value] of Object.entries(backErrors)) {
          console.log(`${key}: ${value}`);
          if (Array.isArray(value)) {
            errorMessages.push(...value);
          }
        }
      }

      // Show error message
      toast.error(`Failed | ${axError.status}`, {
        description: (
          <div className="flex flex-col gap-2">
            <p className="text-md">{errorMessage}</p>
            <ul>
              {errorMessages?.map((ele) => (
                <li key={ele}>{ele}</li>
              ))}
            </ul>
          </div>
        ),
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
          errMsg={errors.email ? EMAIL_EXIST : ""}
        />
        {emailError?.[0] === EMAIL_EXIST && (
          <RecivedUserDataDialog uId={emailError?.[1]} companyId={companyId} />
        )}
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
            {...register("takeTimeZone")}
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
