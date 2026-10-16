import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.ts";
import { DialogProvider } from "./Context/DialogueContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </DialogProvider>
  </StrictMode>,
);
