"use client";

import AutoHeight from "@/components/animation/auto-height";

import { useForm } from "react-hook-form";

import { AlertCircle, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import validCompanyProfileImage from "@/modules/company-profile/service/validate-company-image";
import { cn } from "@/lib/utils";
import uploadCompanyImage from "@/modules/company-profile/service/upload-company-image";
import { deleteCookie, getCookie } from "cookies-next";
import { useParams } from "@i18n/navigation";

interface FormValues {
  image: FileList;
}

interface IChangeLogo {
  handleClose: () => void;
}

interface ValidationRule {
  sentence: string;
  sub_title: string | null;
  status: number;
  validate: string;
}

const ChangeLogo = ({ handleClose }: IChangeLogo) => {
  const queryClient = useQueryClient();
  const { company_id }: { company_id: string | undefined } = useParams();

  const [valid, setValid] = useState(false);

  const [rules, setRules] = useState<ValidationRule[]>([
    {
      sentence: "حجم الصورة يجب أن لا يتعدى 5 ميجابايت",
      sub_title: null,
      status: 0,
      validate: "required",
    },
    {
      sentence: "أبعاد الصورة غير صحيحة. يجب أن تكون الأبعاد بين  1920*1080",
      sub_title: null,
      status: 0,
      validate: "required",
    },
    {
      sentence: "تأكد ان الخلفية بيضاء",
      sub_title: null,
      status: 0,
      validate: "required",
    },
  ]);

  const { mutate: mutateValidation, isPending: isValidationPending } =
    useMutation({
      mutationFn: async (file: File) =>
        await validCompanyProfileImage(file, company_id),
    });

  const { mutate: mutateUpload, isPending: isUploadPending } = useMutation({
    mutationFn: async (file: File) =>
      await uploadCompanyImage(file, company_id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm<FormValues>();

  const imageFile = watch("image")?.[0];
  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;

  useEffect(() => {
    const test = rules.every((rules) => rules.status === 1);
    setValid(test);
  }, [rules]);

  const onSubmit = (data: FormValues) => {
    const file = data.image[0];

    if (file.size > 5 * 1024 * 1024) {
      setError("image", {
        type: "manual",
        message: "حجم الصورة يتجاوز 5 ميجابايت",
      });
      return;
    }

    if (!valid) {
      // Just validate
      mutateValidation(file, {
        onSuccess: () => {
          setRules((prev) =>
            prev.map((rule) => ({
              ...rule,
              status: 1,
            }))
          );
          setValid(true); // Allow next submit to proceed with upload
        },
        onError: (err: any) => {
          const messageObj = err?.response?.data?.message;
          const newRule = Object.values(messageObj).filter(
            (item) =>
              item !== null && typeof item === "object" && !Array.isArray(item)
          );
          setRules(newRule as ValidationRule[]);
          setValid(false);
        },
      });
    } else {
      mutateUpload(file, {
        onSuccess: () => {
          deleteCookie("company-data");
          window.location.reload();
          handleClose();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-10 ">
        <div className="grid grid-cols-2 items-center">
          <div className="space-y-3 text-right">
            <ul className="list-decimal pr-5 space-y-2 text-sm">
              {rules.map((rule) => (
                <li key={rule.sentence} className="flex items-center gap-2">
                  <AlertCircle
                    className={cn(
                      "w-4 h-4  shrink-0",
                      Boolean(rule.status)
                        ? "text-green-500"
                        : "text-yellow-400"
                    )}
                  />
                  <p className="text-lg">{rule.sentence}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 bg-sidebar rounded-2xl aspect-square items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <div className="w-40 h-32 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    width={160}
                    height={128}
                  />
                ) : (
                  <UploadCloud className="w-16 h-16" />
                )}
              </div>
            </div>

            <label className="w-32 px-4 py-2 border border-primary rounded-lg cursor-pointer text-center text-sm">
              ارفاق
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.gif,.svg"
                className="hidden"
                {...register("image", {
                  required: "الرجاء اختيار صورة",
                  validate: {
                    format: (fileList) => {
                      if (!fileList?.[0]) return true;
                      const validFormats = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/gif",
                        "image/svg+xml",
                      ];
                      return (
                        validFormats.includes(fileList[0].type) ||
                        "يجب أن يكون حقل logo ملفًا من نوع: jpeg, jpg, png, gif, svg."
                      );
                    },
                  },
                })}
              />
            </label>
          </div>
        </div>

        <AutoHeight condition={!!errors.image}>
          <div className="text-red-500 text-sm text-right">
            {errors?.image?.message as string}
          </div>
        </AutoHeight>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <Button
          type="submit"
          className="w-32"
          loading={isValidationPending || isUploadPending}
        >
          {valid ? "حفظ" : " تحقق من الصوره"}
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="w-32"
          onClick={handleClose}
        >
          الغاء
        </Button>
      </div>
    </form>
  );
};

export default ChangeLogo;
