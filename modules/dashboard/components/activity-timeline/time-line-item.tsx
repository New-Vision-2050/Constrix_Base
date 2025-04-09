type PropsT = {
  title: string;
  time: string;
  description: string;
  descriptionContent?: React.ReactNode;
  pointBgColorClass: string;
};

export default function TimeLineItem(props: PropsT) {
  const { title, time, description, descriptionContent, pointBgColorClass } = props;
  
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 ${pointBgColorClass} rounded-full`}
        ></div>
        <div className="w-px bg-gray-300 h-full"></div>
      </div>
      <div className="flex-grow ">
        <div className="flex justify-between flex-wrap gap-4 mb-2">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <p className="mb-2">{description}</p>
        <div className="flex items-center gap-2 px-3 py-1">
          {descriptionContent}
        </div>
      </div>
    </div>
  );
}
