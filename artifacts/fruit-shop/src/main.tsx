import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

const apiBaseUrl = import.meta.env.PROD ? "" : "http://localhost:8080";
setBaseUrl(apiBaseUrl);

createRoot(document.getElementById("root")!).render(<App />);