import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AvatarGroupProps = {
  fullName: string;
  src?: string;
  alt?: string;
};

const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  const firstLetter = words[0]?.[0] || "";
  const lastLetter = words.length > 1 ? words[words.length - 1][0] : "";
  return (firstLetter + lastLetter).toUpperCase();
};

export const AvatarGroup = ({
  fullName,
  src,
  alt,
  ...props
}: AvatarGroupProps) => {
  return (
    <Avatar {...props}>
      {src ? <AvatarImage src={src} alt={alt || fullName} /> : null}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  );
};
