import * as React from "react";
import * as ReactDOM from 'react-dom/client'

import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import "./index.css";
import App from "./App";
import {apolloClient} from "./apollo/client";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
);







// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
