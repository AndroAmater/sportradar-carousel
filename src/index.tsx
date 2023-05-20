import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import  { Provider } from 'react-redux'
import { store } from './store/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

