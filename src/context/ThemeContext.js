import { createContext } from "react";

const ThemePrefContext = createContext({
  themeDark: false,
  setThemeDarkPref: (_val) => { },
});

export default ThemePrefContext;
