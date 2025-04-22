type PropsT = { value: number };
export default function ContractStatusProgressBar({ value }: PropsT) {
  return (
    <div className="w-full h-2 bg-pink-200 rounded-full overflow-hidden">
      <div className="h-full bg-pink-500" style={{ width: `${value}%` }}></div>
    </div>
  );
}
