export type ListItemType = {
  avatarSrc: string;
  title: string;
  subtitle: string;
  chipLabel: string;
  chipColor: "primary" | "secondary";
};

export default function SingleListItem({ item }: { item: ListItemType }) {
  return (
    <div className="flex items-center gap-4">
      {/* <CustomAvatar variant="rounded" src={item.avatarSrc} size={38} /> */}
      <img
        src={item.avatarSrc}
        alt="item image"
        width={38}
        className="rounded-full"
      />
      <div className="flex justify-between items-center w-full flex-wrap gap-x-4 gap-y-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-medium">{item.title}</p>
          <div className="flex items-center gap-2">
            <i className="ri-calendar-line text-base text-gray-500" />
            <p className="text-sm text-gray-500">{item.subtitle}</p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-sm font-medium rounded-full ${
            item.chipColor === "primary"
              ? "bg-pink-300 text-pink-600"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {item.chipLabel}
        </span>
      </div>
    </div>
  );
}
