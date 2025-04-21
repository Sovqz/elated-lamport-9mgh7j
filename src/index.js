import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Tetris from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
<React.StrictMode>
  <Tetris />
</React.StrictMode>;
