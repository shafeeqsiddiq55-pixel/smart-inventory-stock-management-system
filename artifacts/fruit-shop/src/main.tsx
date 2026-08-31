import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

// Backend API URL
setBaseUrl("https://smart-inventory-stock-management-system.onrender.com");

createRoot(document.getElementById("root")!).render(<App />);