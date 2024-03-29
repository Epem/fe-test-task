import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { api } from "./state/api";

// import 'tailwindcss/tailwind.css';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<App />}> </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
