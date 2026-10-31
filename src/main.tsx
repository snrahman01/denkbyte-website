import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { config } from "./data";
import "./styles.css";

// Apply brand colors from site.config.json as CSS variables (--color-*, see styles.css).
const { colors } = config.branding;
const root = document.documentElement;
root.style.setProperty("--color-primary", colors.primary);
root.style.setProperty("--color-secondary", colors.secondary);
root.style.setProperty("--color-accent", colors.accent);
root.style.setProperty("--color-dark", colors.dark);
root.style.setProperty("--color-light", colors.light);
root.style.setProperty("--color-text", colors.text);
root.style.setProperty("--color-text-light", colors.text_light);

document.title = `${config.company.name} | Planspiel Course`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
