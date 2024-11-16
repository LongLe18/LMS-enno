import React from "react";

// import { Nav } from "reactstrap";
import { Layout, Menu, Avatar } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
// javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from "perfect-scrollbar";
// import SubMenu from "./Submenu";
import { NavLink, Link } from "react-router-dom";


const { Sider } = Layout;
const { SubMenu } = Menu;

function Sidebar(props) {

  const renderMenu2Levels = (mainMenus, root, magicKey) => {
    return mainMenus.map((main, key) => {
      if (main.hide) return null;
      // const listSubPaths = main.sub ? main.sub.map((item) => item.path.replace('/:id', '')) : [];
      // let isActive = listSubPaths.find((pathStr) => history.location.pathname.includes(pathStr));
      if (main.sub) {
        // const isMagicCase = magicTypes.find((item) => history.location.pathname.includes(item));
        // if (isMagicCase && history.location.pathname.includes(main.id)) {
        //   isActive = true;
        // }
        return (
          <SubMenu
            key={`sub${key}`}
            className={`m-sub`}
            title={
              <a href="/#" onClick={(e) => e.preventDefault()}>
                {main.icon ? main.icon : <PlusSquareOutlined />}
                <span className="nav-text">{main.name}</span>
              </a>
            }
          >
            {renderMenu2Levels(main.sub, false, key)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={root ? key : `sub-${magicKey}-${key}`} className={`m-item`}>
          <Link to={main.path}>
            {main.icon ? main.icon : <PlusSquareOutlined />}
            <span className="nav-text">{main.name}</span>
          </Link>
        </Menu.Item>
      );
    }
    );
  };

  return (
    <Sider trigger={null} width={260} collapsible collapsed={props.collapsed} collapsedWidth={55} breakpoint="md" className="app-sider">
      <Menu className="app-menu" mode="inline" >
        <Menu.Item className="logo" key='100000'>
          <NavLink
            to="/admin/dashboard"
            className="simple-text logo-mini"
          >
            <Avatar src={require("assets/rank/Logo-enno.png").default} alt="react-logo" size={40} />
          </NavLink>
          <NavLink style={{fontSize: '16px', marginLeft: '10px'}}
            to="/admin/dashboard"
            className="simple-text logo-normal"
          >
            Quản Lý luyện thi
          </NavLink>
        </Menu.Item>
        {renderMenu2Levels(props.routes, true)}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
