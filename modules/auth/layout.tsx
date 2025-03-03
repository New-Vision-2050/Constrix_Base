import ConstrixIcon from "@/public/icons/constrix";
import NewVision from "@/public/icons/new-vision";
import NewVisionWhite from "@/public/icons/new-vision-white";
import { SparklesCore } from "./components/sparkles-core";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen overflow-hidden relative w-[90%] mx-auto">
      <div className="w-full md:bg-[#280B4A] absolute top-0 rounded-[100%] md:pt-[400px] pt-[150px]  -translate-y-1/2 -z-10 pb-[50px]">
        <div className="absolute top-2/3 w-full max-w-5xl start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex justify-evenly items-center ">
          <NewVision />
          <h1 className="md:text-4xl text-xl">لوحة التحكم</h1>
          <ConstrixIcon />
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
        <div className="w-full max-w-lg rounded-md px-4 py-[20px] bg-background border border-lines/20 ">
          {children}
        </div>
      </section>
      <div className="w-full md:bg-[#280B4A] absolute bottom-0 rounded-[100%] md:pt-[400px] pt-[150px] translate-y-1/2 -z-10 pb-[50px]">
        <div className="absolute bottom-2/3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex justify-center items-center gap-5 mt-6 w-full ">
          <p className="text-center md:text-3xl text-xl">
            جميع الحقوق البرمجية محفوظة لشركة نيو فيجن التقنية .
          </p>
          <NewVisionWhite />
        </div>
      </div>
    </main>
  );
}
