import React from "react";
import { useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";
import { Avatar, Image, Badge, Row, Col, Tooltip } from "antd";
import { NotificationOutlined, BellOutlined } from '@ant-design/icons';
import AutoLaTeX from 'react-autolatex';

// helper
import { getUserInfo, cutString } from "helpers/common.helper.js";
import routes from "../../../containers/admin/routes.js";
import jwt_decode from 'jwt-decode';
import config from '../../../configs/index';
import moment from 'moment';
import defaultImage from 'assets/img/avatar.png';
import { BarsOutlined } from '@ant-design/icons';
//redux
import { useDispatch } from "react-redux";
import * as userAction from '../../../redux/actions/user';
import * as notificationAction from '../../../redux/actions/notification';

function Header(props) {

  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownAlert, setDropdownAlert] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const [avatar, setAvatar] = React.useState(defaultImage);

  const location = useLocation();
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const dropdownToggleAlert = (e) => {
    setDropdownAlert(!dropdownAlert);
  };
  const getBrand = () => {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (prop.sub !== undefined) {
        prop.sub.map((item, index) => {
          if (window.location.href.indexOf(item.path) !== -1) {
            brandName = item.name;
          }
          return null;
        })
      }
      else if (window.location.href.indexOf(prop.path) !== -1) {
        brandName = prop.name;
      } else {
        brandName = "Quản lý Luyện thi"
      }
      return null;
    });
    return brandName;
  };

  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  const [state, setState] = React.useState({
    isLogin: false,
    info: {},
    notification: '',
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
        setState(state => ({ ...state, isLogin: true, info: JSON.parse(getUserInfo()) }));
        const json_token = jwt_decode(localStorage.getItem('userToken'));
        if (json_token.role === 1) { // giáo viên
          if (JSON.parse(getUserInfo()).anh_dai_dien !== null)
            setAvatar(config.API_URL + JSON.parse(getUserInfo()).anh_dai_dien)
        } else { // nhân viên
          if (JSON.parse(getUserInfo())[0].anh_dai_dien !== null)
            setAvatar(config.API_URL + JSON.parse(getUserInfo())[0].anh_dai_dien)
        }
    }
  }, [state.isLogin]);

  // gọi api lấy thông báo
  React.useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
      const json_token = jwt_decode(localStorage.getItem('userToken'));
      if (json_token.role === 1) { //giáo viên
        dispatch(notificationAction.getNOTIFICATIONsByUser({}, (res) => {
          if (res.status === 'success') setState({...state, notification: res.data.filter(note => note.loai_quyen === 1)});
        }));
      } else if (json_token.role === 2) { // nhân viên
        dispatch(notificationAction.getNOTIFICATIONs({}, (res) => {
          if (res.status === 'success') setState({...state, 
            notification: res.data.filter(note => note.loai_quyen === 2 && note.nguoi_nhan_id === JSON.parse(getUserInfo())[0].nhan_vien_id)});
        }));
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // sự kiện xử lý xem thông báo
  const handleSeenComment = (thong_bao_id, link) => {
    // cập nhật thông báo đã xem
    const callback = (res) => {
      if (res.status === 'success') {
        if (localStorage.getItem('userToken') !== null) {
          const json_token = jwt_decode(localStorage.getItem('userToken'));
          if (json_token.role === 1) { //giáo viên
            dispatch(notificationAction.getNOTIFICATIONsByUser({}, (res) => {
              if (res.status === 'success') {
                setState({...state, notification: res.data.filter(note => note.loai_quyen === 1)});
                window.location.href = config.BASE_URL + '/teacher/reply?binh_luan_id=' + link.split('/')[link.split('/').length - 1];
              };
            }));
          } else if (json_token.role === 2) { // nhân viên
            dispatch(notificationAction.getNOTIFICATIONs({}, (res) => {
              if (res.status === 'success') {
                setState({...state, notification: res.data.filter(note => note.loai_quyen === 2 && note.nguoi_nhan_id === JSON.parse(getUserInfo())[0].nhan_vien_id)})
                window.location.href = config.BASE_URL + '/admin/reply?binh_luan_id=' + link.split('/')[link.split('/').length - 1];
              };
            }));
          }
        }
        
      }
    }
    dispatch(notificationAction.changeStatusNOTIFICATION({ id: thong_bao_id }, callback));
  };

  const onLogout = () => {
    if (localStorage.getItem('userToken') !== null) {
      const json_token = jwt_decode(localStorage.getItem('userToken'));
      if (json_token.role === 0) { // user fail
        dispatch(userAction.getUserStudent());
      } else if (json_token.role === 1) {
        dispatch(userAction.getUserTeacher());
      } else {
        dispatch(userAction.getUserStaff());
      }
      dispatch(userAction.logoutUser({}, (res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          setState(state => ({ ...state, isLogin: false, info: {} }));
          if (json_token.role === 2) props.history.push('/auth/nhanvien');
          else if (json_token.role === 1) props.history.push('/auth/giaovien');
        }
      }));
    } 
  };

  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "dark"
          : color
      }
      expand="lg" style={{maxHeight:"160px", zIndex: 1}}
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >   
      <Container fluid>
        <div className="navbar-wrapper">
          
          <div className="navbar-toggle" style={{display: 'block'}}>
            <button style={{display: 'block', padding: '0'}}
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => props.onCollapse(!props.collapsed)}
            >
              <BarsOutlined />
            </button>
          </div>
          <NavbarBrand href="/admin/dashboard">{getBrand()}</NavbarBrand>
        </div>
        {/* <NavLink to="/admin/dashboard">
            <img alt="..."  style={{width:'90%'}}
            className="img-no-padding img-responsive"
            src={require("assets/rank/banner.png").default}
            />
        </NavLink> */}
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>

        {/* Alert */}
        <div style={{display: 'flex'}}>
          <Collapse isOpen={isOpen} navbar className="justify-content-end">
            <Nav navbar>
              {state.notification !== '' &&
              <Dropdown nav 
                    isOpen={dropdownAlert}
                    toggle={(e) => dropdownToggleAlert(e)}>
                <DropdownToggle caret nav>
                  <a href="# " onClick={e => e.preventDefault()} className="ant-dropdown-link">
                    <Badge count={state.notification.filter(item => item.trang_thai === false).length} offset={[6, 0]} size="small">
                      <NotificationOutlined />
                    </Badge>
                  </a>
                </DropdownToggle>
                
                <DropdownMenu right style={{width: '500px', textAlign: 'center', overflow: 'scroll', height: '500px'}}>
                  <DropdownItem tag="a">{state.notification.length} thông báo</DropdownItem>
                  {state.notification.map((note, index) => 
                  <DropdownItem key={index} onClick={() => handleSeenComment(note.thong_bao_id, note.link_lien_ket)} 
                    style={{background: !note.trang_thai ? '#f4f2f2' : 'white'}}>
                    <Row>
                      <Col xs={2} md={2} xl={2}>
                        <BellOutlined />
                      </Col>
                      
                      <Col xs={20} md={20} xl={20}>
                        <Tooltip title={<AutoLaTeX>{`${note.noi_dung} <br/> - Gửi lúc: ${moment(note.ngay_tao).isValid() ? moment(new Date(note.ngay_tao)).utc().format(config.DATE_FORMAT_SHORT) : '-'}`}</AutoLaTeX>} color="#2db7f5" placement="bottom">
                          {note.noi_dung.length > 50 ? cutString(note.noi_dung, 50) + ' ... ' : note.noi_dung}  
                        </Tooltip>   
                      </Col>
                    </Row>
                  </DropdownItem>
                  )}
                  <DropdownItem tag="a" onClick={() => {
                    if (localStorage.getItem('userToken') !== null) {
                      const json_token = jwt_decode(localStorage.getItem('userToken'));
                      if (json_token.role === 1) { //giáo viên
                        props.history.push('/teacher/reply')
                      } else if (json_token.role === 2) { // nhân viên
                        props.history.push('/admin/reply')
                      }
                  }}}>Xem tất cả</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              }
            </Nav>
          </Collapse>

          <Collapse isOpen={isOpen} navbar className="justify-content-end">
            <Nav navbar>
              <Dropdown
                nav
                isOpen={dropdownOpen}
                toggle={(e) => dropdownToggle(e)}
                >
                <DropdownToggle caret nav>
                  <Avatar size={48} 
                    src={
                      <Image
                        src={avatar}
                        style={{
                          width: 48,
                        }}
                      />
                    }
                  ></Avatar>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag="a" onClick={() => {
                    if (localStorage.getItem('userToken') !== null) {
                      const json_token = jwt_decode(localStorage.getItem('userToken'));
                      if (json_token.role === 1) { //giáo viên
                        props.history.push('/teacher/profile')
                      } else if (json_token.role === 2) { // nhân viên
                        props.history.push("/admin/profile")
                      }
                  }
                  }}>Tài khoản</DropdownItem>
                  <DropdownItem tag="a" onClick={() => {
                    if (localStorage.getItem('userToken') !== null) {
                      const json_token = jwt_decode(localStorage.getItem('userToken'));
                      if (json_token.role === 1) { //giáo viên
                        props.history.push('/teacher/reply')
                      } else if (json_token.role === 2) { // nhân viên
                        props.history.push('/admin/reply')
                      }
                  }
                  }}>Thông báo</DropdownItem>
                  <DropdownItem tag="a" onClick={() => onLogout()}>Đăng xuất</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;