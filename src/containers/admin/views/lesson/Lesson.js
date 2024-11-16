
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from '../../../../configs/index';
import moment from "moment";
// react plugin for creating notifications over the dashboard
import { Table, Tag, Button, Row, Col, notification, Space, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

// component
import AppFilter from "components/common/AppFilter";
// import Loading from '../../../components/parts/Loading/Loading';
import EllipsisTooltip from "components/common/EllipsisTooltip";

// redux
import * as lessonActions from '../../../../redux/actions/lesson';
import * as courseActions from '../../../../redux/actions/course';
import { useSelector, useDispatch } from "react-redux";


function Lesson() {
  const data = [];
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Tên bài giảng',
      dataIndex: 'ten_bai_giang',
      key: 'ten_bai_giang',
      responsive: ['md'],
    },
    {
      title: 'Mô tả',
      dataIndex: 'mo_ta',
      key: 'mo_ta',
      responsive: ['md'],
        onCell: () => {
          return {
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 200,
            }
          }
        },
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
    },
    {
      title: 'Loại bài giảng',
      dataIndex: 'loai_bai_giang',
      key: 'loai_bai_giang',
      responsive: ['md'],
      width: 150
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      responsive: ['md'],
      render: (trang_thai) => (
        <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
          {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
        </Tag>
      ),
    },
    {
      title: 'Tên chuyên đề',
      dataIndex: 'ten_chuyen_de',
      key: 'ten_chuyen_de',
      responsive: ['md'],
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      responsive: ['md'],
      render: (date) => (
        moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
      )
    },
    {
      title: 'Tùy chọn',
      key: 'bai_giang_id',
      dataIndex: 'bai_giang_id',
      // Redirect view for edit
      render: (bai_giang_id) => (
        <Space size="middle">
          <Link to={ "/admin/detailLesson/" + bai_giang_id} type="button" className="ant-btn ant-btn-round ant-btn-primary">Xem</Link>
          <Button shape="round" type="danger" onClick={() => DeleteThematic(bai_giang_id)}>Xóa</Button> 
        </Space>
      ),
    },
  ];

  const [filter, setFilter] = useState({
    khoa_hoc_id: '',
    mo_dun_id: '',
    chuyen_de_id: '',
    trang_thai: 2,
    search: '',
    start: '',
    end: '',
  });

  const lessons = useSelector(state => state.lesson.list.result);
  // const loadingLesson = useSelector(state => state.lesson.list.loading);
  const erorrLesson = useSelector(state => state.lesson.list.erorr);

  const courses = useSelector(state => state.course.list.result);

  useEffect(() => {
    dispatch(lessonActions.filterLessons({ idCourse: '', idModule: filter.mo_dun_id, idThematic: filter.chuyen_de_id, status: '', search: filter.search, 
      start: filter.start, end: filter.end}));
    dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  
  if (lessons.status === 'success') {
    lessons.data.map((lesson, index) => {
      data.push({...lesson, key: index});
      return null
    }) 
  }

  const DeleteThematic = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chán muốn xóa Bài giảng này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        const callback = (res) => {
          if (res.statusText === 'OK' && res.status === 200) {
            dispatch(lessonActions.filterLessons({ idCourse: '', idModule: filter.mo_dun_id, idThematic: filter.chuyen_de_id, status: '', search: filter.search, 
                start: filter.start, end: filter.end}));
            notification.success({
              message: 'Thành công',
              description: 'Xóa bài giảng thành công',
            })
          } else {
            notification.error({
              message: 'Thông báo',
              description: 'Xóa bài giảng thất bại',
            })
          };
        }
        dispatch(lessonActions.DeleteLesson({ idLesson: id }, callback))
      },
    });
  };

  const onFilterChange = (field, value) => {
    if (field === 'ngay') {
      setFilter((state) => ({ ...state, start: value[0] }));  
      setFilter((state) => ({ ...state, end: value[1] }));  
    }
    else {
      setFilter((state) => ({ ...state, [field]: value }));  
    }
  };

  useEffect(() => {
    dispatch(lessonActions.filterLessons({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, idThematic: filter.chuyen_de_id, status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
      start: filter.start, end: filter.end }));
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <div className="content">
        <Row className="app-main">
          <Col xl={24} className="body-content">
            <Row>
              <Col xl={24} sm={24} xs={24}>
                {courses.status === "success" &&
                    <AppFilter
                      title="Bài giảng"
                      isShowCourse={true}
                      isShowModule={true}
                      isShowThematic={true}
                      isShowStatus={true}
                      isShowSearchBox={true}
                      isShowDatePicker={true}
                      isRangeDatePicker={true}
                      courses={courses.data}
                      onFilterChange={(field, value) => onFilterChange(field, value)}
                   />
                }
               
              </Col>
            </Row>
            <Row className="select-action-group" gutter={[8, 8]}>
              <Col xl={12} sm={12} xs={24}>
                
              </Col>
              <Col xl={12} sm={12} xs={24} className="right-actions">
                <Link to="/admin/lesson/addcate">
                  <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action">
                    Thêm mới bài giảng
                  </Button>
                </Link>
              </Col>

            </Row>
          </Col>
        </Row>
        {/* {loadingLesson && <LoadingCustom/>} */}
          <Table className="table-striped-rows" columns={columns} dataSource={data} />
        {erorrLesson && notification.error({
          message: 'Thông báo',
          description: 'Lấy dữ liệu bài giảng thất bại',
        })}
      </div>
  );
}

export default Lesson;
