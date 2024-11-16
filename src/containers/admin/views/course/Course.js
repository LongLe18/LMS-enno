import React, { useEffect, useState } from 'react';

import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import moment from "moment";
// react plugin for creating notifications over the dashboard
import { Table, Tag, Button, Row, Col, notification, Space, Avatar, Form, Input, 
  Upload, message, DatePicker, Select, Modal, Pagination } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// component
import AppFilter from "components/common/AppFilter";
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import { useSelector, useDispatch } from "react-redux";

const { Dragger } = Upload;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Course = () => {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const formDefault = {
        ten_khoa_hoc: '',
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
        kct_id: 1,
    };

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'anh_dai_dien',
            key: 'anh_dai_dien',
            responsive: ['lg'],
            render: (src) => (
              <Avatar src={src !== null ? config.API_URL + src : defaultImage} size={50} shape='circle' />
            )
        },
        {
          title: 'Tên khóa học',
          dataIndex: 'ten_khoa_hoc',
          key: 'ten_khoa_hoc',
          responsive: ['md'],
        },
        {
          title: 'Khung chương trình',
          dataIndex: 'ten_khung_ct',
          key: 'ten_khung_ct',
          responsive: ['md'],
          render: (ten_khung_ct, khoa_hoc) => (
            khoa_hoc?.khung_chuong_trinh?.ten_khung_ct
          )
        },
        {
          title: 'Trạng thái',
          dataIndex: 'trang_thai',
          key: 'trang_thai',
          responsive: ['md'],
          render: (trang_thai) => (
            <Tag color={trang_thai === true ? 'green' : 'red'} key={trang_thai}>
              {trang_thai === true ? "Đang hoạt động" : "Đã dừng"}
            </Tag>
          ),
        },
        {
          title: 'Ngày bắt đầu',
          dataIndex: 'ngay_bat_dau',
          key: 'ngay_bat_dau',
          responsive: ['md'],
          render: (date) => (
            moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
          )
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngay_ket_thuc',
            key: 'ngay_ket_thuc',
            responsive: ['md'],
            render: (date) => (
              moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
            )
          },
        {
          title: 'Tùy chọn',
          key: 'khoa_hoc_id',
          dataIndex: 'khoa_hoc_id',
          // Redirect view for edit
          render: (khoa_hoc_id) => (
            <Space size="middle">
              <Button  type="button" onClick={() => EditCourse(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
              <Button shape="round" type="danger" onClick={() => DeleteCourse(khoa_hoc_id)} >Xóa</Button> 
            </Space>
          ),
        },
    ];

    // props for upload image
    const propsImage = {
        name: 'file',
        action: '#',
  
        beforeUpload: file => {
          const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
          if (!isPNG) {
            message.error(`${file.name} có định dạng không phải là png/jpg`);
          }
          // check dung lượng file trên 1mb => không cho upload
          let size = true;
          if (file.size > 1024000) {
            message.error(`${file.name} dung lượng file quá lớn`);
            size = false;
          }
          return (isPNG && size) || Upload.LIST_IGNORE;
        },
  
        onChange(info) {
          setState({ ...state, fileImg: info.file.originFileObj });
        },
  
        async customRequest(options) {
          const { onSuccess } = options;
    
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        },
  
        onRemove(e) {
          console.log(e);
          setState({ ...state, fileImg: '' });
        },
    };

    const [state, setState] = useState({
        form: formDefault,
        idCourse: 1,
        fileImg: '',
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
        isEdit: false,
        courseData: {},
    })

    const [filter, setFilter] = useState({
      trang_thai: 2,
      search: '',
      start: '',
      end: '',
      kct_id: ''
    });
    const [pageIndex, setPageIndex] = useState(1);
    
    const courses = useSelector(state => state.course.list.result);
    const programmes = useSelector(state => state.programme.list.result);
    // const loading = useSelector(state => state.course.list.loading);
    const error = useSelector(state => state.course.list.error);

    const course = useSelector(state => state.course.item.result);
    const loadingCourse = useSelector(state => state.course.item.loading);

    useEffect(() => {
      dispatch(programmeAction.getProgrammes({ status: '' }));
      dispatch(courseAction.filterCourses({ status: '', search: filter.search, 
        start: filter.start, end: filter.end, pageIndex: pageIndex}, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((module, index) => {
              return {...module, 'key': index};
            }));
            setData([...res.data]);
            form.resetFields();
          }
        }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
      dispatch(courseAction.filterCourses({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
        start: filter.start, end: filter.end, kct_id: filter.kct_id, pageIndex: pageIndex }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((module, index) => {
              return {...module, 'key': index};
            }));
            setData([...res.data]);
          }
      }));
  }, [pageIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderProgramme = () => {
      let options = [];
        if (programmes.status === 'success') {
            options = programmes.data.map((programme) => (
                <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                placeholder="Chọn khung chương trình"
            >
            {options}
            </Select>
      );
    };

    const renderStatus = () => {
        return (
          <Select disabled={!state.isEdit}
            placeholder="Chọn trạng thái"
          >
            <Option value={true} >Đang hoạt động</Option>
            <Option value={false} >Đã dừng</Option>
          </Select>
        );
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
      dispatch(courseAction.filterCourses({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
        start: filter.start, end: filter.end, kct_id: filter.kct_id, pageIndex: pageIndex }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((module, index) => {
              return {...module, 'key': index};
            }));
            setData([...res.data]);
          }
        }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeStart = (value, dateString) => {
        setState({...state, ngay_bat_dau: dateString[0], ngay_ket_thuc: dateString[1] });
    };

    const EditCourse = (id) => {
        dispatch(courseAction.getCourse({ id: id }))
        setState({ ...state, isEdit: true, idCourse: id });
        let body = document.getElementsByClassName('cate-form-block')[0];
        body.scrollIntoView();
    }

    useEffect(() => {
        if (course.status === 'success') {
            setState({ ...state, ngay_bat_dau: course.data.ngay_bat_dau, ngay_ket_thuc: course.data.ngay_ket_thuc });
            course.data = {
                ...course.data,
                ngay_bat_dau: [course.data.ngay_bat_dau !== null ? moment(course.data.ngay_bat_dau, "YYYY/MM/DD") : null, 
                        course.data.ngay_ket_thuc !== null ? moment(course.data.ngay_ket_thuc, "YYYY/MM/DD") : null],
            }           
          form.setFieldsValue(course.data);
        }
    }, [course]);  // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const createCourse = (values) => {

        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              form.resetFields();
              setState({ ...state, isEdit: false });
              dispatch(courseAction.filterCourses({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
                start: filter.start, end: filter.end, pageIndex: pageIndex }, (res) => {
                  if (res.status === 'success') {
                    res.data = (res.data.map((module, index) => {
                      return {...module, 'key': index};
                    }));
                    setData([...res.data]);
                  }
                }));
              notification.success({
                message: 'Thành công',
                description: !state.isEdit ? 'Thêm khóa học mới thành công' : 'Sửa khóa học thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: !state.isEdit ? 'Thêm khóa học mới thất bại' : 'Sửa khóa học thất bại',
              })
            }
        };

        const formData = new FormData();
        formData.append('ten_khoa_hoc', values.ten_khoa_hoc);
        formData.append('ngay_bat_dau', state.ngay_bat_dau);
        formData.append('ngay_ket_thuc', state.ngay_ket_thuc );
        formData.append('kct_id', values.kct_id);
        formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '');
        // video , image
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        if (state.isEdit) {
            formData.append('trang_thai', values.trang_thai );
            dispatch(courseAction.EditCourse({ formData: formData, idCourse: state.idCourse }, callback))
        } else {
            dispatch(courseAction.CreateCourse(formData, callback));
        }

    } 

    const DeleteCourse = (id) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chán muốn xóa khóa học này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              dispatch(courseAction.filterCourses({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
                  start: filter.start, end: filter.end, pageIndex: pageIndex }, (res) => {
                    if (res.status === 'success') {
                      res.data = (res.data.map((module, index) => {
                        return {...module, 'key': index};
                      }));
                      setData([...res.data]);
                    }
                  }));
              notification.success({
                message: 'Thành công',
                description: 'Xóa khóa học thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Xóa khóa học mới thất bại',
              })
            };
          }
          dispatch(courseAction.DeleteCourse({ idLesson: id }, callback))
        },
      });
    };

    // event thay đổi trang
    const onChange = (page) => {
      setPageIndex(page);
    };

    return(
        <div className='content'>
          <Row className="app-main">
              <Col xl={24} className="body-content">
                  <Row>
                      <Col xl={24} sm={24} xs={24}>
                          <AppFilter
                            title="Danh sách khóa học"
                            isShowProgramme={true}
                            isShowCourse={false}
                            isShowModule={false}
                            isShowThematic={false}
                            isShowStatus={true}
                            isShowSearchBox={true}
                            isShowDatePicker={true}
                            isRangeDatePicker={true}
                            courses={courses.data}
                            programmes={programmes.data}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                          />
                      </Col>
                  </Row>
              </Col>
          </Row>
        {/* {loading && <LoadingCustom/>} */}
            {data.length > 0 && 
              <>
                <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}/>
                <br/>
                <Pagination current={pageIndex} onChange={onChange} total={courses?.totalCount}/>
                <br/>
              </>
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu khóa học thất bại',
            })}
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                {loadingCourse && <LoadingCustom/>}   
                {(state.isEdit && course.status === 'success' && course) ? <h5>Sửa thông tin khóa học</h5> : <h5>Thêm mới khóa học</h5>}  
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createCourse}>
                        <Form.Item
                            className="input-col"
                            label="Khung chương trình"
                            name="kct_id"
                            rules={[
                                {
                                required: true,
                                message: 'Khung chương trình là trường bắt buộc.',
                                },
                            ]}
                            >
                                {renderProgramme()}
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Tên khóa học"
                            name="ten_khoa_hoc"
                            rules={[
                                {
                                required: true,
                                message: 'Tên khóa học là trường bắt buộc.',
                                },
                            ]}
                            >
                                <Input placeholder="Nhập tên khoá học"/>
                        </Form.Item>
                        <Row>
                            <Form.Item
                                className="input-col"
                                label="Ngày bắt đầu / ngày kết thúc khóa học"
                                name="ngay_bat_dau"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Ngày bắt đầu / ngày kết thúc là trường bắt buộc.',
                                    },
                                ]}
                            >
                              <RangePicker
                                format="YYYY-MM-DD"
                                onChange={onChangeStart}
                                locale={{
                                  lang: {
                                    locale: 'en_US',
                                    rangePlaceholder: ['Từ ngày', 'Đến ngày'],
                                  },
                                }}
                              />
                            </Form.Item>     
                        </Row>
                        <Form.Item className="input-col" label="Trạng thái (Thêm mới mặc định là đang hoạt động)" name="trang_thai" rules={[]} initialValue={true}>
                            {renderStatus()}
                        </Form.Item>
                        <Form.Item
                          className="input-col"
                          label="Mô tả"
                          name="mo_ta"
                          rules={[]}
                        >
                          <TextArea rows={4} placeholder='Nhập mô tả'/>
                        </Form.Item>
                        <Form.Item className="input-col" label="Hình đại diện" name="anh_dai_dien" rules={[]}>
                          <Dragger {...propsImage} maxCount={1}
                              listType="picture"
                              className="upload-list-inline"
                          >
                              <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                              </p>
                              <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                          </Dragger>
                        </Form.Item>
                        <br/>
                        <br/>
                        <Form.Item className="button-col">
                            <Space>
                                <Button shape="round" type="primary" htmlType="submit" >
                                {(state.isEdit && course.status === 'success' && course) ? 'Cập nhật' : 'Thêm mới'}   
                                </Button>
                                {(state.isEdit && course.status === 'success' && course) 
                                ?  <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
                                    Hủy bỏ
                                </Button>
                                : ''}    
                            </Space>    
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Course;