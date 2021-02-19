import React from 'react';
// import View from ''
// import Preview from ''
import Design from '../VrViews/Design/index';
import DemoBox from '../VrViews/Demo/index'
import ExhibitionView from '../VrViews/ExhibitionView/index'
// 
const routerMap = [
  {
    path: '/',
    redirect: '/vr/design',
    exact: true
  },
  {
    path: '/vr/design',
    component: <Design />,
    exact: true
  },
  {
    path: '/vr/demo',
    component: <DemoBox/>,
  },
  {
    path: '/view',
    component: <ExhibitionView/>,
  },


]

export default routerMap;
