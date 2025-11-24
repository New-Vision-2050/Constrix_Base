import { PaletteOptions } from "@mui/material";
import { green } from "@mui/material/colors";

export const DarkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#ec4899",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#8785A2",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#170038",
    darkest: "#000000",
    paper: "#140f34",
    medTransparent: "rgba(30, 41, 59, 0.5)",
  },
  success: {
    main: green.A400,
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#7c8fb0",
  },
};
