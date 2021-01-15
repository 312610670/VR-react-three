import React from 'react';
// import View from ''
// import Preview from ''
import Design from '../VrViews/Design/index';

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
]

export default routerMap;
