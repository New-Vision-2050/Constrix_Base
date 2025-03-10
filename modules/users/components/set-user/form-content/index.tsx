import { userSchema, UserSchemaT } from "@/modules/users/schema/set-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Toaster } from "sonner";

export default function UserFormContent() {
  // declare and define component state and variables
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
    console.log("submitted data", data);
  };

  // return our component ui
  return (
    <FormProvider {...form}>
      {/* Sonner Toast Provider */}
      <Toaster position="bottom-right" richColors />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 py-4"
      ></form>
    </FormProvider>
  );
}
