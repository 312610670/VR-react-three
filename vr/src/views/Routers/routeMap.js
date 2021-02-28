import React from 'react';
// import View from ''
// import Preview from ''
import AdminList from '../Admin/AdminList/index'



import Design from '../VrViews/Design/index';
import DemoBox from '../VrViews/Demo/index'
import ExhibitionView from '../VrViews/ExhibitionView/index'

import DesignVrProject from '../OnLineProject/Design/index';
import DemoBoxVrProject from '../OnLineProject/Demo/index'
import ExhibitionViewVrProject from '../OnLineProject/ExhibitionView/index'



// 
const routerMap = [
  {
    path: '/',
    redirect: '/vr/design/:id',
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
    path: '/vr/view',
    component: <ExhibitionView/>,
  },
  {
    path: '/admin',
    component: <AdminList />,
    exact: false
  },

  {
    path: '/on-line/design',
    component: <DesignVrProject />,
    exact: false
  },
  {
    path: '/on-line/Exhibition',
    component: <ExhibitionViewVrProject />,
    exact: true
  },
  {
    path: '/on-line/Demo',
    component: <DemoBoxVrProject />,
    exact: true
  },

]

export default routerMap;
