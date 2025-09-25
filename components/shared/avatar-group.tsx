import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AvatarGroupProps = {
  fullName?: string | null;
  src?: string;
  alt?: string;
};

const getInitials = (name: string | null | undefined) => {
  if (!name) return "";
  const parts = name.toUpperCase().trim().split(/\s+/);
  if (parts.length > 1) {
    return parts[0][0] + "\u200C" + parts[parts.length - 1][0];
  }
  return parts[0][0];
};

export const AvatarGroup = ({
  fullName,
  src,
  alt,
  ...props
}: AvatarGroupProps) => {
  return (
    <Avatar {...props}>
      {src ? <AvatarImage src={src} alt={alt || fullName || ""} /> : null}
      <div className="flex flex-col items-center gap-2">
        <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
      </div>
    </Avatar>
  );
};
