// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import "./index.css";

const basename = import.meta.env.BASE_URL || "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <RoutesApp />
    </BrowserRouter>
  </React.StrictMode>
);
