import ChangeMobileFlow from "@/modules/auth/components/change-mobile-flow";

export default function ChangeMobilePage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-background border border-lines/20 px-10 py-12 shadow-2xl">
        <ChangeMobileFlow />
      </div>
    </div>
  );
}
