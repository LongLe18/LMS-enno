// others

import React from "react";
import { BrowserRouter, Route, Switch, withRouter, Redirect } from "react-router-dom";
import { ROUTES } from "./router";
import config from '../../configs/index';

export const AppRouter = ({ children }) => {


    return (
        <BrowserRouter basename={config.BASE_URL}>
            <Switch>
                {ROUTES.map((route, key) => {
                    return <Route key={key} path={route.path} component={withRouter(route.component)}/>;
                })}
            </Switch>
            <Route exact path="/">
                <Redirect to="/luyen-tap/trang-chu" />
            </Route>
        </BrowserRouter>
    );
}
  
