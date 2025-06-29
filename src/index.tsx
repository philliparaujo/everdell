import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import BackgroundContainer from "./components/BackgroundContainer";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Router>
      <BackgroundContainer>
        <App />
      </BackgroundContainer>
    </Router>
  </React.StrictMode>,
);
