import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { _store } from "./_store";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Provider } from "react-redux";
import { Flowbite } from "flowbite-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000, 
    },
  },
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
          <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
