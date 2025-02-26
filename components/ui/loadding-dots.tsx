import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  variant = "white",
}: {
  variant?: "white" | "blue";
}) => {
  let bgColor;

  switch (variant) {
    case "blue":
      bgColor = "bg-primary";
      break;
    case "white":
    default:
      bgColor = "bg-white";
      break;
  }

  return (
    <span className="flex items-center justify-center gap-1">
      <span
        className={cn(
          "w-2.5 h-2.5 block rounded-full animate-bounce [animation-duration:0.7s]",
          bgColor
        )}
      ></span>
      <span
        className={cn(
          "w-2.5 h-2.5 block rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:-0.1s]",
          bgColor
        )}
      ></span>
      <span
        className={cn(
          "w-2.5 h-2.5 block rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:-0.2s]",
          bgColor
        )}
      ></span>
    </span>
  );
};

export default LoadingSpinner;
