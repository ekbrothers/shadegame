import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS here
import "./index.css";
import "./App.css"; // Add this line
import App from "./App";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container); // Create a root using createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
