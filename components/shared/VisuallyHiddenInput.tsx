import { forwardRef } from "react";

const VisuallyHiddenInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className="absolute w-px h-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 clip-rect"
    />
  );
});

VisuallyHiddenInput.displayName = "VisuallyHiddenInput";

export default VisuallyHiddenInput;
