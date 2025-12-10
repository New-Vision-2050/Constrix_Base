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
    <div className="flex flex-col gap-4 bg-sidebar p-4 rounded-md border border-border">
      <h2 className="font-bold">{title}</h2>
      <div className="flex items-center justify-center w-full h-10">
        <p className="font-thin text-gray-500">{description}</p>
      </div>
      <div className="flex items-center justify-center w-full h-10">
        {actionsBtn}
      </div>
    </div>
  );
}
