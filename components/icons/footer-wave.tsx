import { alpha, darken, lighten, useTheme } from "@mui/material";
import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export function FooterWave({ color = "#0099ff", ...rest }: Props) {
  const {
      palette: { mode, primary, background },
    } = useTheme(),
    dark = mode === "dark",
    l = dark ? lighten : darken,
    d = dark ? darken : lighten;

  const color1 = d(color, 0.1),
    color2 = d(color, 0.3),
    color3 = alpha(primary.main, 0.025);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" {...rest}>
      <path
        fill={background.paper}
        fill-opacity="1"
        d="M0,64L48,85.3C96,107,192,149,288,149.3C384,149,480,107,576,101.3C672,96,768,128,864,128C960,128,1056,96,1152,112C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  );
}
