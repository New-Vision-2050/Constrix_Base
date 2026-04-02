type PropsT = {
  title?: string;
  subTitle?: string;
  children?: React.PropsWithChildren;
};
export default function NoDataFounded(props: PropsT) {
  // declare and define component state and variables
  const { title, subTitle, children } = props;

  // return component ui
  return (
    <div className="w-full min-h-32 flex items-center justify-center">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-lg font-bold">
          {subTitle || title || "There is No Data Found"}
        </p>
        {children && <>{children}</>}
      </div>
    </div>
  );
}
