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
    <main className="min-h-screen flex flex-col bg-[#18003A] relative overflow-hidden">
      {/* Language switcher */}
      <div className="fixed top-4 end-4 z-50">
        <RenderLocaleSwitch />
      </div>
      
      {/* Background particles */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="#18003A"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="fixed inset-0 w-full h-full"
        particleColor="#FFFFFF"
      />
      
      {/* Header with logos */}
      <header className="w-full bg-[#280B4A] pt-8 pb-16 rounded-b-[50%] z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="order-3 md:order-1 mt-2 md:mt-0 scale-75 md:scale-100">
            <ConstrixIcon />
          </div>
          <h1 className="order-2 md:order-2 text-xl md:text-4xl text-center">{t("Login.Control_panel")}</h1>
          <div className="order-1 md:order-3 mb-2 md:mb-0 scale-75 md:scale-100">
            <NewVision />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg rounded-md px-3 sm:px-4 py-5 sm:py-7 bg-background border border-lines/20">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-[#280B4A] pb-8 pt-16 rounded-t-[50%] z-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 text-center sm:text-start">
          <p className="text-xs sm:text-sm">{t("Login.Copyright")}</p>
          <div className="scale-75 sm:scale-100">
            <NewVisionWhite />
          </div>
        </div>
      </footer>
    </main>
  );
}
