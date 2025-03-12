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
    <main className="h-screen overflow-hidden relative">
      <div className="absolute top-4 end-4 z-10">
        <RenderLocaleSwitch />
      </div>

      {/* Top curved background */}
      <div className="w-full bg-[#280B4A] absolute top-0 rounded-[100%] pt-[530px] -translate-y-1/2 -z-10">
        <div className="absolute top-2/3 w-full max-w-5xl start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 px-4">
          <div className="hidden sm:block">
            <NewVision />
          </div>
          <h1 className="text-2xl md:text-4xl text-center">{t("Login.Control_panel")}</h1>
          <div className="hidden sm:block">
            <ConstrixIcon />
          </div>
        </div>
      </div>
      
      {/* Bottom curved background */}
      <div className="w-full bg-[#280B4A] absolute bottom-0 rounded-[100%] pt-[530px] translate-y-1/2 -z-10">
        <div className="absolute bottom-2/3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 px-4 text-center sm:text-start">
          <p className="text-xs sm:text-sm">جميع الحقوق البرمجية محفوظة لشركة نيو فيجن التقنية .</p>
          <div className="scale-75 sm:scale-100">
            <NewVisionWhite />
          </div>
        </div>
      </div>
      
      {/* Background particles */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="#18003A"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-full w-full absolute -z-20"
        particleColor="#FFFFFF"
      />
      
      {/* Main content */}
      <section className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-md px-3 sm:px-4 py-5 sm:py-7 bg-background border border-lines/20">
          {children}
        </div>
      </section>
    </main>
  );
}
