
import React, { useEffect } from "react";
import './css/dashboard.css';
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';

// react plugin used to create charts
import { Link } from "react-router-dom";
// antd components
import { Row, Col, Avatar, Table } from "antd";

import { TeamOutlined, FileSearchOutlined, RightOutlined, AppstoreOutlined } from '@ant-design/icons';

// redux
import { useSelector, useDispatch } from "react-redux";
import * as examActions from '../../../../redux/actions/exam';
import * as userAction from '../../../../redux/actions/user';
import * as courseAction from '../../../../redux/actions/course';

function Dashboard() {
  const dataUser = [];
  const dataStudentNotActive = [];
  const dataTeacher = [];
  const dataCourses = [];
  const dataDoing = [];
  const dataDone = [];

  const dispatch = useDispatch();

  const students = useSelector(state => state.user.listUser.result);
  const teachers = useSelector(state => state.user.listTeacher.result);

  const courses = useSelector(state => state.course.list.result);

  const exams = useSelector(state => state.exam.list.result);

  useEffect(() => {
    // dispatch(userAction.getStaffs({ search: '', startDay: '', endDay: '', status: '', pageIndex: 0, pageSize: 100000 }));
    dispatch(userAction.getStudents({ search: '', startDay: '', endDay: '', status: '', pageIndex: 1, pageSize: 100000, province: '' }));
    dispatch(userAction.getTeachers({ idMajor: '', status: '', startDay: '', endDay: '', search: '' }));
    dispatch(courseAction.filterCourses({ status: '', search: '', start: '', end: '', pageIndex: 1, pageSize: 10000000}));
    dispatch(examActions.filterExam({ idCourse: '', idModule: '', idThematic: '', status: '', search: '', 
            start: '', end: '', idType: '', publish: '', offset: '', limit: '1000000' }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (students.status === 'success' && teachers.status === 'success') {
    students.data.map((student) => { 
      if (student.trang_thai === 2) {
        dataStudentNotActive.push({ ...student, 'vai_tro': 'học viên', 'key': student.ngay_tao, 'id': student.hoc_vien_id }); 
      }
      return null; 
    })
    // staffs.data.map((staff) => { dataUser.push({ ...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id }); return null; })
    students.data.map((student) => { dataUser.push({ ...student, 'vai_tro': 'học viên', 'key': student.ngay_tao, 'id': student.hoc_vien_id }); return null; })
    teachers.data.map((teacher) => { dataTeacher.push({ ...teacher, 'vai_tro': 'giáo viên', 'key': teacher.giao_vien_id, 'id': teacher.giao_vien_id }); return null; })
  }

  if (courses.status === 'success') {
    courses.data.map((module, index) => dataCourses.push({...module, 'key': index}))
  };

  if (exams.status === 'success') {
    exams.data.map((exam, index) => {
      if (exam.xuat_ban === 0) 
          dataDoing.push({...exam, key: index})
      else 
          dataDone.push({...exam, key: index});   
      return null
    }) 
  }

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

                  {dataUser.length > 0 && 
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <div className="dashboard-stat stat-user">
                        <div className="visual">
                          <TeamOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dataUser.length}</span>
                          </div>
                          <Link to="/admin/account/student" className="dashboard-stat stat-user">
                            <div className="desc">
                              Tài khoản <RightOutlined />
                            </div>
                            <span>Học viên</span>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  }

                  {dataTeacher.length > 0 && 
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/admin/account/teacher" className="dashboard-stat stat-image">
                        <div className="visual">
                          <AppstoreOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dataTeacher.length}</span>
                          </div>
                          <div className="desc">
                            Tài khoản <RightOutlined />
                          </div>
                          <span>Giáo viên</span>
                        </div>
                      </Link>
                    </Col>
                  }
                  
                  {(dataStudentNotActive.length >= 0 ) && 
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/admin/account/student/2" className="dashboard-stat stat-table">
                        <div className="visual">
                          <FileSearchOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dataStudentNotActive.length}</span>
                          </div>
                          <div className="desc">
                            TK Học viên <RightOutlined />
                          </div>
                          <span>Chưa kích hoạt</span>
                        </div>
                      </Link>
                    </Col>
                  }

                  {dataCourses.length > 0 && 
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/admin/thematic/course" className="dashboard-stat stat-image">
                        <div className="visual">
                          <AppstoreOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dataCourses.length}</span>
                          </div>
                          <div className="desc">
                            Khóa học <RightOutlined />
                          </div>
                        </div>
                      </Link>
                    </Col>
                  }
                
                  {(dataDoing.length > 0 && dataDone.length > 0 ) && 
                    <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                      <Link to="/admin/question/exam" className="dashboard-stat stat-product">
                        <div className="visual">
                          <FileSearchOutlined />
                        </div>
                        <div className="detail">
                          <div className="number">
                            <span>{dataDone.length + dataDoing.length}</span>
                          </div>
                          <div className="desc">
                            Đề thi <RightOutlined />
                          </div>
                        </div>
                      </Link>
                    </Col>
                  }
                  {/* <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                    <div className="dashboard-stat stat-product">
                      <div className="visual">
                        <FileTextOutlined />
                      </div>
                      <div className="detail">
                        <div className="number">
                          <span>0</span>
                        </div>
                        <Link to="/posts" className="dashboard-stat stat-product">
                          <div className="desc">
                            Tài liệu <RightOutlined />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </Col> */}

                </Row>
                

              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={24} xl={12} xxl={12} style={{paddingLeft: 0}}>
            <div className="border-box-widget">
              <h2 className="font-weight-5">Tài khoản mới</h2>
              <div className="border-box-body">

                {dataUser.length > 0 && 
                  <Table
                    size="small"
                    columns={[
                      {
                        title: 'Ảnh đại diện',
                        dataIndex: 'anh_dai_dien',
                        render: (anh_dai_dien) => {
                          return <Avatar src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage} size={50} shape='circle' />
                        },
                      },
                      {
                        title: 'Họ và tên',
                        dataIndex: 'ho_ten',
                      },
                      {
                        title: 'E-mail',
                        dataIndex: 'email',
                      },
                    ]}
                    dataSource={dataUser}
                    pagination={{ pageSize: 5 }}
                  />
                }
              </div>
            </div>
          </Col>
                
          <Col xs={24} sm={24} md={24} xl={12} xxl={12}>
            <div className="border-box-widget">
              <h2 className="font-weight-5">Đề thi chưa xuất bản</h2>
              <div className="border-box-body">

                {dataDoing.length > 0 && 
                <Table
                  size="small"
                  columns={[
                    {
                      title: 'Ảnh đại diện',
                      dataIndex: 'anh_dai_dien',
                      width: '20%',
                      render: (anh_dai_dien, row) => {
                        return <Avatar src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage} size={50} shape='circle' />
                      },
                    },
                    {
                      title: 'Tên đề thi',
                      dataIndex: 'ten_de_thi',
                      render: (ten_de_thi, de_thi) => {
                        return <Link to={`/admin/exam/detail/${de_thi.de_thi_id}`}>{ten_de_thi}</Link>
                      }
                    },
                  ]}
                  dataSource={dataDoing}
                  pagination={{ pageSize: 5 }}
                />
                }
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
