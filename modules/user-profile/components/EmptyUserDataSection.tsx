type PropsT = {
  title: string;
  description: string;
  actionsBtn?: React.ReactNode;
};

export default function EmptyUserDataSection({
  title,
  description,
  actionsBtn,
}: PropsT) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">{title}</h2>
      <div className="flex items-center justify-center w-full h-10">
        <p className="font-semibold">{description}</p>
      </div>
      <div className="flex items-center justify-center w-full h-10">
        {actionsBtn}
      </div>
    </div>
  );
}
