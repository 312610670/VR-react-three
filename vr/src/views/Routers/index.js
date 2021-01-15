import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routerMap from './routeMap';

console.log(routerMap, '-routerMap')

const VrRouters = () => {
  return (
    <Switch>
      {
        routerMap.map((r) => 
           r.redirect ? (
            <Route exact={r.exact} path={r.path} key={r.path}>
                <Redirect to={r.redirect} />
            </Route>
          ) : (
            r.hasLayout ? (
              <Route exact={r.exact} path={r.path} key={r.path}>
                {/* {() => <Layout>{r.component}</Layout>} */}
              </Route>
            ) : (
                <Route exact={r.exact} path={r.path} key={r.path}>
                  {() => r.component}
                </Route>
              )
          )
        )
        }
    </Switch>
  )
}

export default VrRouters