import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { _store } from "./_store";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { Flowbite } from "flowbite-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // Durée de blocage des requêtes en millisecondes (60 000 ms = 1 minute)
    },
  },
  devTools: true, // Activer les outils de développement de React Query
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={_store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Flowbite>
            <App />
          </Flowbite>
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
