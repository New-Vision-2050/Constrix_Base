export default function WorkingTimeCardInformation() {
  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <h2 className="text-lg font-bold mb-1">وقت الدوام</h2>
        <p className="text-md">تقرير أسبوعي</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">
          231<span>س</span> 14
          <span>د</span>
        </h3>
        <div className="flex gap-1 items-center">
          <span className="w-3 h-3 bg-green-700 rounded-full" />
          <span className="px-2 py-1 text-sm font-medium text-green-700 rounded-md">
            +18.4%
          </span>
        </div>
      </div>
    </div>
  );
}
