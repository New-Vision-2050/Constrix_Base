export default function LoadingCase() {
  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-10 rounded-lg border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
