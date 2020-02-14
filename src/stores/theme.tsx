import {
  createMuiTheme,
  MuiThemeProvider,
  Theme
} from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import React, { createContext, useContext, useState } from "react";

export interface ThemeContextProps {
  changeTheme: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextProps>({
  changeTheme: () => {},
  theme: createMuiTheme()
});

export const useTheme = (): ThemeContextProps => useContext(ThemeContext);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ThemeProvider = ({ children }) => {
  const breakpointValues = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  };
  const [type, setType] = useState<PaletteOptions["type"]>("light");
  const [theme, setTheme] = useState(
    createMuiTheme({
      palette: {
        primary: { main: "#484848", light: "#666666" },
        secondary: { main: "#fa6c71", contrastText: "#ffffff" },
        background: { default: "#ffffff" },
        text: { primary: "#484848" },
        type
      },
      breakpoints: {
        values: breakpointValues
      },
      overrides: {
        MuiTooltip: {
          tooltip: {
            fontSize: "1em"
          }
        }
      }
    })
  );

  const changeTheme = () => {
    if (type === "light") {
      setTheme(
        createMuiTheme({
          palette: {
            primary: { main: "#484848", light: "#666666" },
            secondary: { main: "#fa6c71" },
            type: "dark"
          },
          breakpoints: { values: breakpointValues }
        })
      );
      setType("dark");
    } else {
      setTheme(
        createMuiTheme({
          palette: {
            primary: { main: "#484848", light: "#666666" },
            secondary: { main: "#fa6c71" },
            background: { default: "#ffffff" },
            text: { primary: "#484848" },
            type: "light"
          },
          breakpoints: { values: breakpointValues }
        })
      );
      setType("light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        changeTheme,
        theme
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
