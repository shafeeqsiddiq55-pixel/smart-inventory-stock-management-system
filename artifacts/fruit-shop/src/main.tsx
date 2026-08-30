import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

// Backend API URL
setBaseUrl("http://localhost:8080");

createRoot(document.getElementById("root")!).render(<App />);