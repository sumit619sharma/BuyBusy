import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthContext from "./context/authContext";
import ProductContext from "./context/productContext";
import { Provider } from 'react-redux';
import { store } from './store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  {/* <React.StrictMode> */}
    {/* <AuthContext>
      <ProductContext> */}
        <App />
      {/* </ProductContext>
    </AuthContext> */}
  {/* </React.StrictMode> */}
  </Provider>
);
