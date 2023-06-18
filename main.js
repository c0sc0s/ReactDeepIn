import { createRoot } from "./src/react-dom/root";
import { jsx } from "./src/react/jsx";

const root = createRoot(document.getElementById("root"));

const test = jsx("div", {
  children: "Hello",
});

root.render(test);
