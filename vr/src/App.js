import './App.css';
import React from 'react';
import { HashRouter } from 'react-router-dom';

import VrRouters from './views/Routers/index';

import DemoBox from './views/VrViews/Demo/index'
function App() {
  return (
    <HashRouter>
      {/* <VrRouters /> */}
    <DemoBox/>
    </HashRouter>
  );
}

export default App;
