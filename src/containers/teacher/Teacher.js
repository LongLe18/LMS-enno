import React, { useState } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";
import { Layout } from "antd";
import DemoNavbar from "../../components/parts/Navbars/AdminNavbar.js";
import Sidebar from "../../components/parts/Sidebar/Sidebar";

import routes from "./routes.js";

var ps;
const { Content } = Layout;

function TeacherPage(props) {
  const myRouters = [];
  routes.forEach((router) => {
    if (router.path && router.render) {
      myRouters.push(router);
    }
    if (router.sub && router.sub.length > 0) {
      router.sub.forEach((subRouter) => {
        if (subRouter.path && subRouter.render) {
          myRouters.push(subRouter);
        }
      });
    }
  });

  const mainPanel = React.useRef();
  const location = useLocation();
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  React.useEffect(() => {
  }, [collapsed]);
  
  return (
    <Layout className="blue-theme">
      <Sidebar
        {...props}
        routes={routes}
        collapsed={collapsed}
      />
      <Content className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} onCollapse={onCollapse} collapsed={collapsed}/>
        <br/><br/>
        <Switch>
          {myRouters.map((prop, key) => {
            return (
              <Route
                path={prop.path}
                render={prop.render}
                key={key}
              />
            );
          })}
        </Switch>
        {/* <Footer fluid /> */}
      </Content>
    </Layout>
  );
}

export default TeacherPage;
