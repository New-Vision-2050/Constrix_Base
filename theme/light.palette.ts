import { PaletteOptions } from "@mui/material";
import { green } from "@mui/material/colors";

export const LightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#ec4899",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#646368",
    lightest: "#64636833",
  },
  background: {
    default: "#ffffff",
    paper: "#f2f2fd",
  },
  success: {
    main: green.A400,
  },
  text: {
    primary: "#3f3f46",
    secondary: "#7c8fb0",
  },
};
