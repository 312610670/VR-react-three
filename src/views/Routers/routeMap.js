import React from 'react'
// import View from ''
// import Preview from ''

const AdminList = React.lazy(() => import('../Admin/AdminList/index'))
const Design = React.lazy(() => import('../VrViews/Design/index'))
const DemoBox = React.lazy(() => import('../VrViews/Demo/index'))
const Hexagon = React.lazy(() => import('../VrViews/Demo/Hexagon'))

const ExhibitionView = React.lazy(() => import('../VrViews/ExhibitionView/index'))
const DesignVrProject = React.lazy(() => import('../OnLineProject/Design/index'))
const DemoBoxVrProject = React.lazy(() => import('../OnLineProject/Demo/index'))
const ExhibitionViewVrProject = React.lazy(() => import('../OnLineProject/ExhibitionView/index'))

// import AdminList from '../Admin/AdminList/index'
// import Design from '../VrViews/Design/index'
// import DemoBox from '../VrViews/Demo/index'
// import Hexagon from '../VrViews/Demo/Hexagon'
// import ExhibitionView from '../VrViews/ExhibitionView/index'
// import DesignVrProject from '../OnLineProject/Design/index'
// import DemoBoxVrProject from '../OnLineProject/Demo/index'
// import ExhibitionViewVrProject from '../OnLineProject/ExhibitionView/index'

//
const routerMap = [
    {
        path: '/',
        redirect: '/admin',
        exact: true,
    },
    {
        path: '/vr/design',
        component: <Design />,
        exact: true,
    },
    {
        path: '/vr/demo',
        component: <DemoBox />,
    },
    {
        path: '/vr/Hexagon',
        component: <Hexagon />,
    },
    {
        path: '/vr/view',
        component: <ExhibitionView />,
    },
    {
        path: '/admin',
        component: <AdminList />,
        exact: false,
    },

    {
        path: '/on-line/design',
        component: <DesignVrProject />,
        exact: false,
    },
    {
        path: '/on-line/Exhibition',
        component: <ExhibitionViewVrProject />,
        exact: true,
    },
    {
        path: '/on-line/Demo',
        component: <DemoBoxVrProject />,
        exact: true,
    },
]

export default routerMap
