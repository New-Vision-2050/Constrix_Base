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
    <main className="h-screen overflow-hidden relative ">
      <RenderLocaleSwitch />

      <div className="w-full bg-[#280B4A] absolute top-0 rounded-[100%] pt-[530px] -translate-y-1/2 -z-10">
        <div className="absolute top-2/3 w-full max-w-5xl start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex justify-between items-end">
          <NewVision />
          <h1 className="text-4xl">{t("Login.Control_panel")}</h1>
          <ConstrixIcon />
        </div>
      </div>
      <div className="w-full bg-[#280B4A] absolute bottom-0 rounded-[100%] pt-[530px] translate-y-1/2 -z-10">
        <div className="absolute bottom-2/3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex justify-center items-center gap-5">
          <p>جميع الحقوق البرمجية محفوظة لشركة نيو فيجن التقنية .</p>
          <NewVisionWhite />
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
      <section className="w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg rounded-md px-4 py-7 bg-background border border-lines/20 ">
          {children}
        </div>
      </section>
    </main>
  );
}
