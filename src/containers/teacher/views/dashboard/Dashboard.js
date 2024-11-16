
import React, { useEffect } from "react";
import './css/dashboard.css';
import config from '../../../../configs/index';
import axios from "axios";

// react plugin used to create charts
import { Link } from "react-router-dom";
// antd components
import { Row, Col, notification } from "antd";

import { TeamOutlined, FileSearchOutlined, RightOutlined, AppstoreOutlined } from '@ant-design/icons';

// redux
import { useDispatch } from "react-redux";
import * as notificationAction from '../../../../redux/actions/notification';

// hooks
import useFetch from "hooks/useFetch";

function Dashboard() {

  const dispatch = useDispatch();

  const [Notification, setNotification] = React.useState([]);
  const [dealer] = useFetch(`/teacher/dealer/user`);
  const [teaching, setTeaching] = React.useState([]);
  const [number, setNumber] = React.useState(0);

  const getTeaching = () => {
    axios({ url: config.API_URL + `/modun/teaching`, headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } })
        .then(
            res => {
                if (res.status === 200 && res.statusText === 'OK') {
                    setTeaching(res.data.data.map((item, index) => ({...item, key: index})));
                    let students = 0;
                    res.data.data.map((item, index) => {
                      students += item.so_luong;
                      return null;
                    })
                    setNumber(students)
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi lấy dữ liệu',
                    })
                }
            }
        )
        .catch(error => notification.error({ message: error.message }));
  };

  useEffect(() => {
    dispatch(notificationAction.getNOTIFICATIONsByUser({}, (res) => {
      if (res.status === 'success') setNotification(res.data.filter(note => note.loai_quyen === 1));
    }));
    getTeaching();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      
      <div className="content">
        <Row className="app-main home-screen" gutter={[30, 30]} style={{paddingLeft: 0}}>
          <Col span={24}>
            <div className="border-box-widget">
              <h2 className="font-weight-5">Thống kê chung</h2>
              <div className="border-box-body">
                <h1 className="welcome-text">CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG QUẢN LÝ THI</h1>
                <Row gutter={[16, 16]}>

                  {teaching.length > 0 && 
                  <>
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <div className="dashboard-stat stat-user">
                        <div className="visual">
                          <TeamOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{teaching.length}</span>
                          </div>
                          <Link to="/teacher/teaching" className="dashboard-stat stat-user">
                            <div className="desc">
                              Số mô-đun <RightOutlined />
                            </div>
                            <span>Giảng dạy</span>
                          </Link>
                        </div>
                      </div>
                    </Col>

                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <div className="dashboard-stat stat-user">
                        <div className="visual">
                          <TeamOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{number}</span>
                          </div>
                          <Link to="/teacher/teaching" className="dashboard-stat stat-user">
                            <div className="desc">
                              Số học viên <RightOutlined />
                            </div>
                            <span>Giảng dạy</span>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  </>
                  }

                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/teacher/reply" className="dashboard-stat stat-image">
                        <div className="visual">
                          <AppstoreOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{Notification.length}</span>
                          </div>
                          <div className="desc">
                            Thông báo <RightOutlined />
                          </div>
                          <span>Giáo viên</span>
                        </div>
                      </Link>
                    </Col>
                  
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/teacher/dealer" className="dashboard-stat stat-table">
                        <div className="visual">
                          <FileSearchOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dealer.length === 0 ? 0 : dealer[0].sl_ma_chua_ban}</span>
                          </div>
                          <div className="desc">
                            Chiết khấu <RightOutlined />
                          </div>
                          <span>Chưa sử dụng</span>
                        </div>
                      </Link>
                    </Col>

                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/teacher/dealer" className="dashboard-stat stat-product">
                        <div className="visual">
                          <AppstoreOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dealer.length === 0 ? 0 : dealer[0].sl_ma_da_ban}</span>
                          </div>
                          <div className="desc">
                            Chiết khấu <RightOutlined />
                          </div>
                          <span>Đã sử dụng</span>
                        </div>
                      </Link>
                    </Col>

                </Row>
                

              </div>
            </div>
          </Col>

        </Row>
      </div>
    </>
  );
}

export default Dashboard;
