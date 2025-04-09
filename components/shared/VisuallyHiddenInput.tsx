export default function VisuallyHiddenInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="absolute w-px h-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 clip-rect"
    />
  );
}
