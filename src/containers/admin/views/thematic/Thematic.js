
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import config from '../../../../configs/index';

import * as thematicActions from '../../../../redux/actions/thematic';
import * as courseActions from '../../../../redux/actions/course';
// react plugin for creating notifications over the dashboard

import { Table, Tag, Button, Space, Col, Row  } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
// import Loading from '../../../components/parts/Loading/Loading';
import AppFilter from "components/common/AppFilter";
import { notification } from 'antd';
import EllipsisTooltip from "components/common/EllipsisTooltip";


const Thematic = () => {
    const data = [];
    let history = useHistory();
    const dispatch = useDispatch();

    const thematics = useSelector(state => state.thematic.list.result);
    // const loading = useSelector(state => state.thematic.list.loading);
    const error = useSelector(state => state.thematic.list.error);

    const courses = useSelector(state => state.course.list.result);

    const columns = [
      {
        title: 'Tên chuyên đề',
        dataIndex: 'ten_chuyen_de',
        key: 'ten_chuyen_de',
        responsive: ['md'],
      },
      {
        title: 'Lớp',
        dataIndex: 'ten_lop',
        key: 'ten_lop',
        responsive: ['lg'],
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
              maxWidth: 250,
            }
          }
        },
        render: (text) => <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
      },
      {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
        responsive: ['lg'],
        render: (trang_thai) => (
          <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
            {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
          </Tag>
        ),
      },
      {
        title: 'Tên Module',
        dataIndex: 'ten_mo_dun',
        key: 'ten_mo_dun',
        responsive: ['lg'],
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
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        responsive: ['lg'],
        render: (date) => (
          moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
        )
      },
      {
        title: 'Tùy chọn',
        key: 'chuyen_de_id',
        dataIndex: 'chuyen_de_id',
        render: (chuyen_de_id) => (
          <Space size="middle">
            <Button shape="round" type="primary" onClick={() => history.push("/admin/lesson/cate/" + chuyen_de_id)}>Xem</Button>
          </Space>
        ),
      },
    ];

    const [filter, setFilter] = useState({
      khoa_hoc_id: '',
      mo_dun_id: '',
      trang_thai: 2,
      search: '',
      start: '',
      end: '',
    });

    useEffect(() => {
      dispatch(thematicActions.filterThematics({ idCourse: '', idModule: filter.mo_dun_id, status: '', search: filter.search, 
        start: filter.start, end: filter.end}));
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
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
      dispatch(thematicActions.filterThematics({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
        start: filter.start, end: filter.end }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    if (thematics.status === 'success') {
      thematics.data.map((thematic, index) => data.push({...thematic, 'key': index}))
    }

    return (
      <>
      {/* {loading && <LoadingCustom/>} */}
        <div className="content">
        <Row className="app-main">
            <Col xl={24} className="body-content">
              <Row>
                <Col xl={24} sm={24} xs={24}>
                {courses.status === "success" &&
                  <AppFilter
                    title="Danh sách chuyên đề"
                    isShowCourse={true}
                    isShowModule={true}
                    isShowThematic={false}
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
              </Col>
          </Row>
          <Row className="select-action-group" gutter={[8, 8]}>
            <Col xl={12} sm={12} xs={24}>
              
            </Col>
            <Col xl={12} sm={12} xs={24} className="right-actions">
              <Link to="/admin/lesson/cate">
                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action">
                  Thêm mới chuyên đề
                </Button>
              </Link>
            </Col>

          </Row>
            
          <Table className="table-striped-rows" columns={columns} dataSource={data}/>
        </div>
      {error && notification.error({
        message: 'Thông báo',
        description: 'Lấy dữ liệu chuyên đề thất bại',
      })}
      </>
    );
}

export default Thematic;


