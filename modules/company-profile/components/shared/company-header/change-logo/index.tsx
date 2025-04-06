"use client";

import AutoHeight from "@/components/animation/auto-height";

import { useForm } from "react-hook-form";

import { AlertCircle, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface FormValues {
  image: FileList;
}

interface IChangeLogo {
  handleClose: () => void;
}

const ChangeLogo = ({ handleClose }: IChangeLogo) => {
  const rules = [
    "حجم الصورة لا يتعدى 5 ميجابايت.",
    "اختر الحجم المناسب للصورة (مثل 1920x1080 بكسل).",
    "تأكد من أن الخلفية بيضاء.",
  ];
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

  const onSubmit = (data: FormValues) => {
    const file = data.image[0];

    if (file.size > 5 * 1024 * 1024) {
      setError("image", {
        type: "manual",
        message: "حجم الصورة يتجاوز 5 ميجابايت",
      });
      return;
    }

    console.log("uploaded...");
    handleClose();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-10 ">
        <div className="grid grid-cols-2 items-center">
          <div className="space-y-3 text-right">
            <ul className="list-decimal pr-5 space-y-2 text-sm">
              {rules.map((rule) => (
                <li key={rule} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                  <p className="text-lg">{rule}</p>
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
                accept="image/*"
                className="hidden"
                {...register("image", {
                  required: "الرجاء اختيار صورة",
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
        <Button type="submit" className="w-32">
          حفظ
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
