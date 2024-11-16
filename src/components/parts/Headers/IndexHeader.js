
/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
// helper
import { cutString } from "helpers/common.helper";
import jwt_decode from 'jwt-decode';
import config from '../../../configs/index';
import { getUserInfo } from "helpers/common.helper"; 
import { useHistory } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import Hashids from 'hashids';
import AutoLaTeX from 'react-autolatex';
import moment from "moment";
import './header.css';

// reactstrap components
import { Container, Row, Col } from "reactstrap";
import { NavLink } from 'react-router-dom';

// core components
import { Menu, Dropdown, Badge, Tooltip, Modal, Button, Form, Input, notification,
  Avatar, } from 'antd';
import { DownOutlined, BellOutlined, UserOutlined, LockOutlined, EyeTwoTone,
  EyeInvisibleOutlined, BarsOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import SocialLogin from 'components/common/SocialLogin';
import ReCAPTCHA from "react-google-recaptcha";

import * as userAction from '../../../redux/actions/user';
import * as menuAction from '../../../redux/actions/menu';
import * as courseAction from '../../../redux/actions/course';
import * as notificationAction from '../../../redux/actions/notification';
var ps;

function IndexHeader(props) {
  const sidebar = React.useRef();
  const captchaRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const hashids = new Hashids();
  const [visiable, setVisible] = useState(false);
  const sidebarToggle = useRef();

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const [form] = Form.useForm();
  const [state, setState] = useState({
    isLogin: false,
    info: {},
    notification: ''
  });

  const menus = useSelector(state => state.menu.list.result);
  const courses = useSelector(state => state.course.list.result);
  const user = useSelector(state => state.user.user.result);
  const dataMenus = [];

  useEffect(() => {
    const callback = (res) => {
      if (res.status === 'success') {
        dispatch(courseAction.getCourses({ idkct: '', status: 1, search: '' }));
      }
    }
    dispatch(menuAction.getMenus({}, callback));
    if (localStorage.getItem('userToken') !== null) {
      dispatch(notificationAction.getNOTIFICATIONsByUser({}, (res) => {
        if (res.status === 'success') setState({...state, notification: res.data.filter(note => note.loai_quyen === 0)});
      }));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
      const json_token = jwt_decode(localStorage.getItem('userToken'));
      if (json_token) {
          setState(state => ({ ...state, isLogin: true, info: JSON.parse(getUserInfo()) }));
        };
      }  
  }, [state.isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (menus.status === 'success' && courses.status === 'success') {
    menus.data.map((item, index) => {
        if (item.loai_menu_id === 2) {
          let temp = item.kct.map((khoa_hoc, index2) => (
            {...khoa_hoc, key: `/luyen-tap/kinh-doanh/${khoa_hoc.key}  `}
          ))
          dataMenus.push({...item, khoa_hoc: temp});
        } else if (item.loai_menu_id === 5) {
          let temp = [];
          courses.data.map((course, index) => {
            if (Number(item.gia_tri) === course.kct_id)
              temp.push({ key: `/luyen-tap/kiem-tra/${hashids.encode(course.khoa_hoc_id)}`, label: course.ten_khoa_hoc})
          })
          dataMenus.push({...item, khoa_hoc: temp});
        } 
        else {
          dataMenus.push({...item, key: index});
        }
    })
  };

  const onClick = ({ key }) => {  
    if (key === '/auth/logout') {
        dispatch(userAction.logoutUser({}, (res) => {
          if (res.status === 200 && res.statusText === 'OK') {
            setState(state => ({ ...state, isLogin: false, info: {} }));
            history.push('/luyen-tap/trang-chu');
          }
        }));
        
    } else 
      window.location.href = config.BASE_URL + key;
  };

  const menu = (
      <Menu
        onClick={onClick}
        items={[
          {
            label: 'Tài khoản',
            key: '/luyen-tap/nguoi-dung/profile',
          },
          {
            label: 'Khóa học của bạn',
            key: '/luyen-tap/nguoi-dung/khoa-hoc'
          },
          {
            label: 'Hóa đơn của bạn',
            key: '/luyen-tap/nguoi-dung/hoa-don'
          },
          {
            label: 'Đăng xuất',
            key: '/auth/logout',
          },
        ]}
      />
  );
  
  const onClickNote = ({ key }) => {
    window.location.href = config.BASE_URL + key;
  };

  const noti = () => {
    let items = [];
    if (state.notification !== '') {
      state.notification.map((item, index) => {
        console.log(item);
        if (index < 20) {
          items.push({ 
            label:
            <Tooltip title={<AutoLaTeX>{`${item.noi_dung} <br/> - Gửi lúc: ${moment(item.ngay_tao).isValid() ? moment(new Date(item.ngay_tao)).utc().format(config.DATE_FORMAT_SHORT) : '-'}`}</AutoLaTeX>} color="#2db7f5" placement="bottom"> 
              {item.noi_dung.length > 50 ? cutString(item.noi_dung, 50) + ' ... ' : item.noi_dung}
            </Tooltip>,
            key: item.link_lien_ket.split('/').length <= 3 
            ? `/luyen-tap/chi-tiet-luyen-tap${item.link_lien_ket}` // Lớn hơn 2 là đề thi, Bé hơn 2 là chuyên đề
            : item.link_lien_ket.split('/').length === 4 
            ? `/luyen-tap/lam-kiem-tra/${hashids.encode(item.link_lien_ket.split('/')[1])}/${moment().toNow()}/${item.link_lien_ket.split('/')[2]}/${hashids.encode(item.link_lien_ket.split('/')[0])}}`
            : item.link_lien_ket.split('/').length === 5 
            ? `/luyen-tap/lam-kiem-tra/${hashids.encode(item.link_lien_ket.split('/')[0])}/${moment().toNow()}/${item.link_lien_ket.split('/')[2]}/${item.link_lien_ket.split('/')[3]}/${hashids.encode(item.link_lien_ket.split('/')[1])}}`
            : item.link_lien_ket.split('/').length === 6 
            ? `/luyen-tap/lam-kiem-tra/${item.link_lien_ket.split('/')[1]}/${moment().toNow()}/${hashids.encode(item.link_lien_ket.split('/')[0])}/${item.link_lien_ket.split('/')[3]}/${item.link_lien_ket.split('/')[4]}/${hashids.encode(item.link_lien_ket.split('/')[2])}}`
            : null
          })
        }
      })
    };
    return (
      <Menu
          onClick={onClickNote}
          items={items}
      />
    )
  };
  noti();

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });

  const handleOk = () => {
    setVisible(false);
};

  const handleCancel = () => {
      setVisible(false);
  };

  const showModal = () => {
      setVisible(true);
  };

  const renderLogin = () => {
    return (
        <Form form={form} className="login-form app-form" name="login-form" onFinish={onSubmitLogin}>
            <h2 className="form-title">Đăng nhập</h2>
            <Form.Item name="email" rules={[{ required: true, message: 'Bạn chưa nhập email', type: "email" }]}>
                    <Input size="normal" prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item name="mat_khau" rules={[
                  { required: true, message: 'Bạn chưa nhập mật khẩu!' }, 
                  { pattern: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), 
                    message: 'Mật khẩu chưa đúng dạng gồm: Chữ hoa, chữ thường, ký tự đặc biệt, số, ít nhất 8 kí tự' 
                  }
              ]}>
                <Input.Password prefix={<LockOutlined />} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item name="captcha"
                rules={[
                    {
                    required: true,
                    },
                ]}
            >   
                <ReCAPTCHA sitekey={config.CAPTCHA.siteKey} ref={captchaRef} />
            </Form.Item>
            <Form.Item className="center-buttons">
                <Button type="primary" shape="round" htmlType="submit" className="btn-login">
                    Đăng nhập
                </Button>
            </Form.Item>

            <div className="footer-login">
                {/* Social Links */}
                <SocialLogin />
                <div className="forgot-password">
                    Bạn quên mật khẩu?
                    <Button
                    type="link"
                    onClick={() => {
                        window.location.href = config.BASE_URL + '/auth/forgot-password';
                    }}
                    >
                    Lấy lại mật khẩu
                    </Button>
                </div>
                <div className="forgot-password">
                    Bạn chưa có tài khoản?
                    <Button
                    type="link"
                    onClick={() => {
                        window.location.href = config.BASE_URL + '/auth/register';
                    }}
                    >
                    Đăng ký ngay
                    </Button>
                </div>
            </div>
        </Form>
    )
  }

  const onSubmitLogin = (values) => {
    const callback = (res) => {
        if (res.status === 200 && res.statusText === 'OK') {
            setVisible(false);
            
            const json_token = jwt_decode(localStorage.getItem('userToken'));
            if (json_token.role === 0) {
                setTimeout(() => {
                    dispatch(userAction.logoutUser());
                }, 18000000);
                dispatch(userAction.getUserStudent({ hoc_vien_id: json_token.userId, isUpdateStorage: true }, (res) => {
                    if (res.status === 'success') {
                      if (res.data.trang_thai) { 
                         // tài khoản đã kích hoạt
                        if (localStorage.getItem('userToken') !== null)  {
                            notification.success({
                              message: 'Thông báo',
                              description: 'Đăng nhập thành công.',
                            }); 
                            window.location.href = '/luyen-tap/nguoi-dung/khoa-hoc';
                        }        
                      } else {
                        notification.warning({
                            message: 'Tài khoản của bạn chưa được kích hoạt',
                        });
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('userInfo');
                        return;
                      }
                    };
                }));
            } 
            else {
                notification.error({
                    message: 'Tài khoản của bạn không có quyền đăng nhập vào ',
                });
                localStorage.clear();
                return;
            }
        } else {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: 'Bạn vui lòng kiểm tra lại thông tin đăng nhập',
            });
        }
    };
    const token = captchaRef.current.getValue();
    values.token = token;
    captchaRef.current.reset();
    dispatch(userAction.loginUser({ type: 1, login: values }, callback));
  };

  return (
    <div ref={sidebar} className="header-page">
      <Container>
        <Row className="header-logo">
          <NavLink to="/luyen-tap/trang-chu">
            <img alt="..."  style={{maxHeight: '155px', width: '100%'}}
              className="img-no-padding img-responsive"
              src={require("assets/rank/header-logo.png").default}
            />
          </NavLink>
        </Row>
      </Container>
      <div id="wide-nav" className="header-bottom wide-nav nav-dark hide-for-medium">
        <NavLink to="/luyen-tap/trang-chu">
          <img alt="..."  style={{maxHeight: '50px'}} className="img-no-padding img-responsive"
            src={require("assets/rank/enno.png").default}
          />
        </NavLink>
       
        <div className="flex-row container">
          <div className="flex-col hide-for-medium flex-left" style={{marginRight: 0}}>
            <ul className="nav header-nav header-bottom-nav nav-left  nav-divided nav-size-medium nav-spacing-medium nav-uppercase" style={{alignItems: 'center'}}>
              {(dataMenus) && dataMenus.map(({ menu_id, ten_menu, gia_tri, loai_menu_id, khoa_hoc, loai_kct }) => {
                if (loai_menu_id === 1) { // liên kết
                  return (
                    <li key={menu_id}><a href={gia_tri}>{ten_menu}</a></li>
                  )
                } else if (loai_menu_id === 4) { // khóa học
                  return (
                    <li key={menu_id}><a  href={ config.BASE_URL + "/luyen-tap/luyen-tap/" + hashids.encode(gia_tri)}>{ten_menu}</a></li>
                  )
                } else if (loai_menu_id === 2) { // mua bán
                  return (
                    <li key={menu_id}>
                      <Dropdown style={{listStyle: 'none'}} arrow={{ pointAtCenter: true }}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={onClick}
                          items={khoa_hoc}
                        />
                      }>
                        {/* Note: Chỉ điều hướng vơi menu Khóa học */}
                        <a onClick={(e) => window.location.href = config.BASE_URL + '/luyen-tap/trang-chu'}> 
                            {ten_menu}
                            <DownOutlined />
                        </a>
                      </Dropdown>
                    </li>
                  )
                } else if (loai_menu_id === 5) { // thi thử
                  return (
                    <li key={menu_id}>
                      <Dropdown style={{listStyle: 'none'}} arrow={{ pointAtCenter: true }}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={onClick}
                          items={khoa_hoc}
                        />
                      }>
                        {/* Note: Chỉ điều hướng vơi menu Khóa học */}
                        <a onClick={(e) => e.preventDefault()}> 
                            {ten_menu}
                            <DownOutlined />
                        </a>
                      </Dropdown>
                    </li>
                  )
                } else if (loai_menu_id === 3) // Khung chương trình
                  return (
                    <li key={menu_id}><a href={config.BASE_URL + `/luyen-tap/chuong-trinh/${gia_tri}`}>{ten_menu}</a></li>
                  )
              })}
              {!state.isLogin ?
                <>
                  <li><Button type="primary" onClick={() => showModal()} style={{borderRadius: 6}}>Đăng nhập</Button></li>
                  <li><Button type="default" onClick={() => window.location.href = config.BASE_URL + '/auth/register'} style={{borderRadius: 6, background: 'orange', borderColor: 'orange'}}>Đăng ký</Button></li>
                </>
              : 
                <>
                <li>
                  <Dropdown style={{listStyle: 'none'}} overlay={menu} arrow={{ pointAtCenter: true }} placement="bottom">
                    <a onClick={(e) => e.preventDefault()} className="logined">
                        {(localStorage.getItem('userToken') !== null && jwt_decode(localStorage.getItem('userToken')).role === 2) 
                        ? (state.info[0].ho_ten).split(' ')[(state.info[0].ho_ten).split(' ').length - 1] 
                        : (state.info.ho_ten).split(' ')[(state.info.ho_ten).split(' ').length - 1] }
                      <DownOutlined />
                    </a>
                  </Dropdown>
                </li>
                <li>
                  <Badge  count={state.notification !== '' ? (state.notification.filter(item => item.trang_thai === false).length < 20) ? state.notification.filter(item => item.trang_thai === false).length : 0 : 0} offset={[6, 0]} size="small">
                    <Dropdown overlay={noti}>
                      <a onClick={e => e.preventDefault()}>
                        <BellOutlined />
                      </a>
                    </Dropdown>
                  </Badge>
                </li>
                </>
              }
            </ul>          
          </div>
        </div>
        {/* Mobile */}
        <div className="navbar-wrapper navbar-mobile">
          
          <div className="navbar-toggle" style={{display: 'block'}}>
            <button style={{color: '#4c891f'}}
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => onCollapse(!collapsed)}
            >
              <BarsOutlined />
            </button>
          </div>
          {!state.isLogin ?
            <>
              <li><Button type="primary" onClick={() => showModal()} style={{borderRadius: 6}}>Đăng nhập</Button></li>
              <li><Button type="default" onClick={() => window.location.href = config.BASE_URL + '/auth/register'} style={{borderRadius: 6, background: 'orange', borderColor: 'orange'}}>Đăng ký</Button></li>
            </>
            : 
            <>
              <li>
                <Dropdown style={{listStyle: 'none'}} overlay={menu} arrow={{ pointAtCenter: true }} placement="bottom">
                  <a onClick={(e) => e.preventDefault()}>
                      {(localStorage.getItem('userToken') !== null && jwt_decode(localStorage.getItem('userToken')).role === 2) 
                      ? (state.info[0].ho_ten).split(' ')[(state.info[0].ho_ten).split(' ').length - 1] 
                      : (state.info.ho_ten).split(' ')[(state.info.ho_ten).split(' ').length - 1] }
                      <DownOutlined />
                  </a>
                </Dropdown>
              </li>
              <li>
                <Badge  count={state.notification !== '' ? (state.notification.filter(item => item.trang_thai === false).length < 20) ? state.notification.filter(item => item.trang_thai === false).length : 0 : 0} offset={[6, 0]} size="small">
                  <Dropdown overlay={noti}>
                    <a onClick={e => e.preventDefault()}>
                      <BellOutlined />
                    </a>
                  </Dropdown>
                </Badge>
              </li>
            </>
          }
          <div className="nav__overlay" style={{display: collapsed ? 'block' : 'none'}} onClick={() => onCollapse(!collapsed)}></div>

          <nav className="nav__mobile" style={{transform: collapsed ? 'translateX(0)' : 'translateX(-100%)'}}>
            <div className="nav__mobile-logo">
              <a
                href="/luyen-tap/trang-chu"
                className="simple-text logo-mini"
              >
                <Avatar src={require("assets/rank/Logo-enno.png").default} alt="react-logo" size={40} />
              </a>
            </div>
            <div className="nav__mobile-close"><Button icon={<CloseOutlined />} onClick={() => onCollapse(!collapsed)}></Button></div>
            <ul className="header-nav header-bottom-nav nav-left  nav-divided nav-size-medium nav-spacing-medium nav-uppercase nav__mobile-list">
              {(dataMenus) && dataMenus.map(({ menu_id, ten_menu, gia_tri, loai_menu_id, khoa_hoc, loai_kct }) => {
                if (loai_menu_id === 1) { // liên kết
                  return (
                    <li key={menu_id}><a className="nav__mobile-link" style={{width: '100%'}} href={gia_tri}>{ten_menu}</a></li>
                  )
                } else if (loai_menu_id === 4) { // khóa học
                  return (
                    <li key={menu_id}><a className="nav__mobile-link" style={{width: '100%'}} href={ config.BASE_URL + "/luyen-tap/luyen-tap/" + hashids.encode(gia_tri)}>{ten_menu}</a></li>
                  )
                } else if (loai_menu_id === 2) { // mua bán
                  return (
                    <li key={menu_id}>
                      <Dropdown style={{listStyle: 'none'}} arrow={{ pointAtCenter: true }}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={onClick}
                          items={khoa_hoc}
                        />
                      }>
                        {/* Note: Chỉ điều hướng vơi menu Khóa học */}
                        <a className="nav__mobile-link" style={{width: '100%'}} onClick={(e) => window.location.href = config.BASE_URL + '/luyen-tap/trang-chu'}> 
                            {ten_menu}
                            <DownOutlined />
                        </a>
                      </Dropdown>
                    </li>
                  )
                } else if (loai_menu_id === 5) { // thi thử
                  return (
                    <li key={menu_id}>
                      <Dropdown style={{listStyle: 'none'}} arrow={{ pointAtCenter: true }}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={onClick}
                          items={khoa_hoc}
                        />
                      }>
                        {/* Note: Chỉ điều hướng vơi menu Khóa học */}
                        <a className="nav__mobile-link" style={{width: '100%'}} onClick={(e) => e.preventDefault()}> 
                            {ten_menu}
                            <DownOutlined />
                        </a>
                      </Dropdown>
                    </li>
                  )
                } else if (loai_menu_id === 3) // Khung chương trình
                  return (
                    <li key={menu_id}><a className="nav__mobile-link" style={{width: '100%'}} href={config.BASE_URL + `/luyen-tap/chuong-trinh/${gia_tri}`}>{ten_menu}</a></li>
                  )
              })}
            </ul>   
          </nav>
        </div>

      </div> 
      <Modal
          className="cra-auth-modal"
          wrapClassName="cra-auth-modal-container"
          maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
          maskClosable={false}
          footer={null}
          mask={true}
          centered={true}
          visible={visiable}
          onOk={handleOk}
          onCancel={handleCancel}
          width={480}
      >
          {renderLogin()}
      </Modal>   
    </div>
  );
}

export default IndexHeader;
