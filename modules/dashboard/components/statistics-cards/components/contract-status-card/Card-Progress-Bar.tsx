                            type PropsT = {
  totalDays: number;
  trialDays: number;
  noticeDays: number;
  passedDays: number;
};

export default function ContractStatusProgressBar({
  totalDays,
  trialDays,
  noticeDays,
  passedDays,
}: PropsT) {
  if (totalDays <= 0) return null;

  const clamped = Math.min(Math.max(passedDays, 0), totalDays);

  const effectiveTrial = Math.min(Math.max(trialDays, 0), totalDays);
  const effectiveNotice = Math.min(Math.max(noticeDays, 0), totalDays - effectiveTrial);
  const effectiveMain = Math.max(0, totalDays - effectiveTrial - effectiveNotice);

  const trialStart = 0;
  const mainStart = effectiveTrial;
  const noticeStart = effectiveTrial + effectiveMain;

  const isComplete = clamped >= totalDays;

  const trialWidthPct = (effectiveTrial / totalDays) * 100;
  const mainWidthPct = (effectiveMain / totalDays) * 100;
  const noticeWidthPct = (effectiveNotice / totalDays) * 100;

  const trialFillPct =
    effectiveTrial > 0
      ? Math.min(100, Math.max(0, ((clamped - trialStart) / effectiveTrial) * 100))
      : 0;
  const mainFillPct =
    effectiveMain > 0
      ? Math.min(100, Math.max(0, ((clamped - mainStart) / effectiveMain) * 100))
      : 0;
  const noticeFillPct =
    effectiveNotice > 0
      ? Math.min(100, Math.max(0, ((clamped - noticeStart) / effectiveNotice) * 100))
      : 0;

  const inTrial = effectiveTrial > 0 && clamped >= trialStart && clamped < mainStart;
  const inMain = effectiveMain > 0 && clamped >= mainStart && clamped < noticeStart;
  const inNotice = effectiveNotice > 0 && clamped >= noticeStart;

  const dot = (color: string, fillPct: number) => (
    <div
      className={`absolute w-2.5 h-2.5 ${color} border-2 border-white rounded-full shadow z-10`}
      style={{
        top: "50%",
        left: `${fillPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );

  return (
    <div className="flex w-full gap-0.5">
      {effectiveTrial > 0 && (
        <div className="relative h-2" style={{ width: `${trialWidthPct}%` }}>
          <div className="absolute inset-0 overflow-hidden rounded-l-full bg-amber-500">
            <div
              className="absolute h-1 bg-blue-600 top-1/2 -translate-y-1/2 rounded-full"
              style={{ width: `${trialFillPct}%` }}
            />
          </div>
        </div>
      )}

      {effectiveMain > 0 && (
        <div className="relative h-2" style={{ width: `${mainWidthPct}%` }}>
          <div
            className={`absolute inset-0 overflow-hidden bg-pink-500 ${effectiveTrial <= 0 ? "rounded-l-full" : ""} ${effectiveNotice <= 0 ? "rounded-r-full" : ""}`}
          >
            <div
              className="absolute h-1 bg-blue-600 top-1/2 -translate-y-1/2 rounded-full"
              style={{ width: `${mainFillPct}%` }}
            />
          </div>
        </div>
      )}

      {effectiveNotice > 0 && (
        <div className="relative h-2" style={{ width: `${noticeWidthPct}%` }}>
          <div className="absolute inset-0 overflow-hidden rounded-r-full bg-red-500">
            <div
              className="absolute h-1 bg-blue-600 top-1/2 -translate-y-1/2 rounded-full"
              style={{ width: `${noticeFillPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
