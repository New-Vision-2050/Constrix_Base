import { Backdrop, CircularProgress } from "@mui/material";
import { ComponentProps } from "react";

function LoadingBackdrop({
  children,
  style,
  ...props
}: ComponentProps<typeof Backdrop>) {
  return (
    <Backdrop {...props} style={{ zIndex: 10000, color: "white", ...style }}>
      <CircularProgress size={64} color="inherit" />
    </Backdrop>
  );
}

export default LoadingBackdrop;
