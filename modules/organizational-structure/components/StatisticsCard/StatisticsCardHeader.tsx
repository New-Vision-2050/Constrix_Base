type PropsT = {
  title?: string | number;
  number?: string | number;
  description?: string | number;
  icon?: JSX.Element;
};

export default function StatisticsCardHeader(props: PropsT) {
  const { title, icon, description, number } = props;

  return (
    <div className="flex items-center gap-2">
      {/* icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: `linear-gradient(0deg, var(--Buttons-States-Green-Background, #38484A), var(--Buttons-States-Green-Background, #38484A)),
                 linear-gradient(0deg, rgba(48, 51, 78, 0.88), rgba(48, 51, 78, 0.88))`,
        }}
      >
        {icon}
      </div>
      {/* title & description */}
      <div>
        <p className="text-lg ">{title}</p>
        <p className="text-sm font-thin">
          <span className="text-lg font-bold">{number+' '}</span>
          {description}
        </p>
      </div>
    </div>
  );
}
