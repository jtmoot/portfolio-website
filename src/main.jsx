import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { chooseFont } from "./lib/font.js";
import "./index.css";
import "./styles/tokens.css";
import "./styles/sheet.css";
import "./styles/iso.css";
import "./styles/creative.css";

document.documentElement.dataset.font = chooseFont(window.location.search);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
