import AdornedInput from "@/components/shared/AdornedInput";
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

export default function UserFormContent() {
  // declare and define component state and variables
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
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
      await userService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        title: data.title,
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
        <AdornedInput
          fieldName="firstName"
          label="اسم المستخدم الاول"
          errMsg={errors?.firstName?.message ?? ""}
        />
        {/* last name */}
        <AdornedInput
          fieldName="lastName"
          label="اسم المستخدم الاخير"
          errMsg={errors?.lastName?.message ?? ""}
        />
        {/* email */}
        <AdornedInput
          fieldName="email"
          label="البريد الالكتروني"
          errMsg={errors?.email?.message ?? ""}
        />
        {/* phone */}
        <PhoneInput name="phone" />
        {/* title */}
        <CustomSelect
          name="title"
          control={control}
          options={[
            { label: "title 1", value: "tit-1" },
            { label: "title 2", value: "tit-2" },
            { label: "title 3", value: "tit-3" },
          ]}
          placeholder="المسمى الوظيفي"
          error={Boolean(errors.title)}
          errorMessage={errors?.title?.message ?? ""}
        />

        <Button type="submit" className="w-full max-w-sm">
          حفظ
        </Button>
      </form>
    </FormProvider>
  );
}
