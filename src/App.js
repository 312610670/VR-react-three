import './App.css';
import React from 'react';
import { HashRouter } from 'react-router-dom';

import VrRouters from './views/Routers/index';



function App() {
  return (
    <HashRouter>
      <VrRouters />
    </HashRouter>
  );
}

export default App;
