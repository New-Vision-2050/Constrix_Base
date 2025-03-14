import ConstrixIcon from "@/public/icons/constrix";
import NewVision from "@/public/icons/new-vision";
import NewVisionWhite from "@/public/icons/new-vision-white";
import { SparklesCore } from "./components/sparkles-core";
import { useTranslations } from "next-intl";
import RenderLocaleSwitch from "@/components/ui/RenderLocaleSwitch";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();
  return (
    <main className="h-screen overflow-hidden relative md:w-full ">
      <div className="w-full bg-[#280B4A] absolute top-0 md:rounded-[100%] md:pt-[550px] pt-[350px]  -translate-y-1/2 -z-10 md:pb-[50px] pb-[40px]">
        <div className="absolute md:top-2/3 top-1/2  md:w-full max-w-5xl start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex md:flex-row flex-col justify-between items-center w-5/6 mx-auto">
          <NewVision className="max-sm:w-12" />
          <h1 className="md:text-4xl text-lg">لوحة التحكم</h1>
          <ConstrixIcon className="max-sm:w-12" />
        </div>
      </div>
      <SparklesCore
        id="tsparticlesfullpage"
        background="#18003A"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-full w-full absolute -z-20"
        particleColor="#FFFFFF"
      />
      <section className="md:w-full min-h-screen flex items-center justify-center w-5/6 mx-auto">
        <div className="w-full max-w-lg rounded-md px-4 py-[20px] bg-background border border-lines/20 ">
          {children}
        </div>
      </section>
      <div className="w-full bg-[#280B4A] absolute bottom-0 md:rounded-[100%] md:pt-[550px] pt-[400px]  translate-y-1/2 -z-10 pb-[50px]">
        <div className=" absolute bottom-2/3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex justify-center items-center gap-2 mt-6 w-full ">
          <p className="text-center md:text-3xl text-sm">
            جميع الحقوق البرمجية محفوظة لشركة نيو فيجن التقنية .
          </p>
          <NewVisionWhite />
        </div>
      </div>
    </main>
  );
}
