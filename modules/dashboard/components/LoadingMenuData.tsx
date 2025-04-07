type PropsT = {
  height?: string; // Optional height for the loading menu data
  width?: string; // Optional width for the loading menu data
  itemsNumber?: number; // Optional number of loading items
};

export default function LoadingMenuData(props: PropsT) {
  const { height = "10", width = "full", itemsNumber = 1 } = props;
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: itemsNumber }, (_, index) => (
        <div
          key={index}
          className={`w-${width} h-${height} bg-gray-200 animate-pulse rounded-lg`}
        ></div>
      ))}
    </div>
  );
}
