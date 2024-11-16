import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import config from '../../../../configs/index'

import AppFilter from "components/common/AppFilter";
import { Row, Col, Form, Input, Button, Select, Table, notification, Tag, Space, Modal, } from "antd";
import { ExclamationCircleOutlined, } from '@ant-design/icons';

import * as partActions from '../../../../redux/actions/part';
import * as thematicActions from '../../../../redux/actions/thematic';
import * as courseActions from '../../../../redux/actions/course';
import * as majorActions from '../../../../redux/actions/major';
import * as programmeActions from '../../../../redux/actions/programme';
// other components
import LoadingCustom from 'components/parts/loading/Loading';
import EllipsisTooltip from "components/common/EllipsisTooltip";

const { TextArea } = Input;
const { Option } = Select;


const ThematicCate = () => {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const thematic = useSelector(state => state.thematic.item.result);
    const loadingThematic = useSelector(state => state.thematic.item.loading);

    const modules = useSelector(state => state.part.list.result);
    const loadingModules = useSelector(state => state.part.list.loading);
    
    const courses = useSelector(state => state.course.list.result);
    const loadingCourses = useSelector(state => state.course.list.loading);

    // const loading = useSelector(state => state.thematic.list.loading);
    const error = useSelector(state => state.thematic.list.error);
    
    const classes = useSelector(state => state.major.list.result);
    const programmes = useSelector(state => state.programme.list.result);

    const formDefault = {
      ten_chuyen_de: '',
      mo_dun_id: '',
      trang_thai: true,
      mo_ta: ''
    };

    const [state, setState] = useState({
      moduleId: 1,
      idThematic: 1,
      isEdit: false,
      trang_thai: true,
      dataEdit: {},
      form: formDefault
    });

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
        start: filter.start, end: filter.end}, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((thematic, index) => {
              return {...thematic, 'key': index };
            }));
            setData([...res.data]);
            form.resetFields();
          }
        }));
      dispatch(programmeActions.getProgrammes({ status: '' }));
      dispatch(majorActions.getClass());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        width: 300,
        onCell: () => {
          return {
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
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
          width: 150,
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
        width: 250,
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
        width: 150,
        // Redirect view for edit
        render: (chuyen_de_id) => (
          <Space size="middle">
            <Button shape="round" type="primary" onClick={() => EditThematic(chuyen_de_id)}>Sửa</Button> 
            <Button shape="round" type="danger" onClick={() => DeleteThematic(chuyen_de_id)}>Xóa</Button> 
          </Space>
        ),
      },
    ];

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
      dispatch(thematicActions.filterThematics({ idCourse: filter.khoa_hoc_id, 
        idModule: filter.mo_dun_id, status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
        start: filter.start, end: filter.end }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((thematic, index) => {
              return {...thematic, 'key': index };
            }));
            setData([...res.data]);
          }
        }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps
    
    const renderProgramme = () => {
      let options = [];
        if (programmes.status === 'success') {
            options = programmes.data.filter((programme) => programme.loai_kct === 2).map((programme) => (
                <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
            ))
        }
        return (
        <Select
          showSearch={true}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          placeholder="Chọn khung chương trình"
          onChange={(kct_id) => dispatch(courseActions.getCourses({ idkct: kct_id, status: '', search: '' }))}
        >
        {options}
        </Select>
      );
    };

    const renderClasses = () => {
      let options = [];
      if (classes.status === 'success') {
        options = classes.data.map((course) => (
          <Option key={course.lop_id} value={course.lop_id} >{course.ten_lop}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn lớp học"
        >
          {options}
        </Select>
      );
    };

    const renderCourses = () => {
      let options = [];
      if (courses.status === 'success') {
        options = courses.data.map((course) => (
          <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
        ))
      }
      return (
        <Select
          showSearch={true}
          loading={loadingCourses}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          onChange={(khoa_hoc_id) => {
            dispatch(partActions.getModulesByIdCourse({ idCourse: khoa_hoc_id }));
          }}
          placeholder="Chọn khóa học"
        >
          {options}
        </Select>
      );
    };

    const renderModules = () => {
      let options = [];
      if (modules.status === 'success') {
        options = modules.data.map((module) => (
          <Option key={module.mo_dun_id} value={module.mo_dun_id} >{module.ten_mo_dun}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          loading={loadingModules}
          onChange={(mo_dun_id) => setState({mo_dun_id, ...state, isChanged: true })}
          placeholder="Chọn phần học"
        >
          {options}
        </Select>
      );
    };

    const renderStatus = () => {
      return (
        <Select disabled={!state.isEdit}
          onChange={(trang_thai) => setState({ ...state, trang_thai: trang_thai })}
          placeholder="Chọn trạng thái"
        >
          <Option value={true} >Đang hoạt động</Option>
          <Option value={false} >Đã dừng</Option>
        </Select>
      );
    };

    const CreateAndEditThematic = (values) => {
      if (values.mo_dun_id === undefined || values.khoa_hoc_id === undefined ) { // check null
        notification.warning({
          message: 'Cảnh báo',
          description: 'Thông tin tạo chuyên đề chưa đủ',
        })
        return;
      }
      
      var data = {
        "ten_chuyen_de": values.ten_chuyen_de,
        "mo_ta": values.mo_ta,
        "mo_dun_id": values.mo_dun_id,
      }
      if (values.lop_id !== undefined)  data.lop_id = values.lop_id;
      if (state.isEdit) data.trang_thai = values.trang_thai; // thêm trường trạng thái khi cập nhật

      const callback = (res) => {
        if (res.statusText === 'OK' && res.status === 200) {
          setState({ ...state, isEdit: false });
          form.resetFields();
          dispatch(thematicActions.filterThematics({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
              status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
              start: filter.start, end: filter.end }, (res) => {
                if (res.status === 'success') {
                  res.data = (res.data.map((thematic, index) => {
                    return {...thematic, 'key': index };
                  }));
                  setData([...res.data]);
                }
              }));
          notification.success({
            message: 'Thành công',
            description: state.isEdit ? 'Sửa thông tin chuyên đề thành công' : 'Thêm chuyên đề mới thành công',
          });
        } else {
          notification.error({
            message: 'Thông báo',
            description: state.isEdit ? 'Sửa thông tin chuyên đề thất bại' : 'Thêm chuyên đề mới thất bại',
          })
        }
      };
      
      if (!state.isEdit) {
        dispatch(thematicActions.CreateThematic(data, callback));
      } else {
        dispatch(thematicActions.EditThematic({ formData: data, idThematic: state.idThematic }, callback));
      }
    };

    const DeleteThematic = (id) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chán muốn xóa chuyên đề này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              dispatch(thematicActions.filterThematics({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
                status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
                start: filter.start, end: filter.end }, (res) => {
                  if (res.status === 'success') {
                    res.data = (res.data.map((thematic, index) => {
                      return {...thematic, 'key': index };
                    }));
                    setData([...res.data]);
                  }
                }));
              notification.success({
                message: 'Thành công',
                description: 'Xóa chuyên đề thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Xóa chuyên đề mới thất bại',
              })
            };
          }
          dispatch(thematicActions.DeleteThematic({ idThematic: id }, callback))
        },
      });
    };

    const EditThematic = (id) => {
      dispatch(thematicActions.getThematic({ id: id }));
      setState({...state, isEdit: true, idThematic: id});
      let body = document.getElementsByClassName('cate-form-block')[0];
      body.scrollIntoView();
    };

    useEffect(() => {
      if (thematic.status === 'success') {
        setState({...state, isEdit: true});
        dispatch(partActions.getModulesByIdCourse({ idCourse: thematic.data.khoa_hoc_id }));
        form.setFieldsValue(thematic.data);
      }
    }, [thematic]);  // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEdit = () => {
      setState({ ...state, isEdit: false })
      form.resetFields();
    };

    return (
          <div className="content">
              <Row className="app-main">
                  <Col span={24} className="body-content">
                      <Row>
                          <Col xl={24} sm={24} xs={24} className="table-cates">
                              <AppFilter
                                  title={"Danh sách chuyên đề"}
                                  isShowCourse={true}
                                  isShowModule={true}
                                  isShowThematic={false}
                                  isShowStatus={true}
                                  isShowSearchBox={true}
                                  isShowDatePicker={false}
                                  isRangeDatePicker={false}
                                  courses={courses.data}
                                  onFilterChange={(field, value) => onFilterChange(field, value)}
                              />
                          </Col>
                      </Row>
                  </Col>
              </Row>
              {/* {loading && <Loading />} */}
              <div>
                <Table className="table-striped-rows" columns={columns} dataSource={data} />
              </div>
              {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu chuyên đề thất bại',
              })}
                          
              <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loadingThematic && <LoadingCustom/>}                          
                        <div> 
                        {(state.isEdit && thematic.status === 'success' && thematic) ? <h5>Sửa thông tin chuyên đề</h5> : <h5>Thêm chuyên đề</h5>}      
                          <Form layout="vertical" className="category-form" form={form} onFinish={CreateAndEditThematic}>
                              <Form.Item
                                  className="input-col"
                                  label="Tên chuyên đề"
                                  name="ten_chuyen_de"
                                  rules={[
                                      {
                                      required: true,
                                      message: 'Tên chuyên đề là trường bắt buộc.',
                                      },
                                  ]}
                                  >
                                      <Input placeholder="Nhập tên chuyên đề"/>
                              </Form.Item>
                              <Form.Item className="input-col" label="Khung chương trình" name="kct_id" rules={[]} >
                                  {renderProgramme()}
                              </Form.Item>
                              <Form.Item className="input-col" label="Khóa học" name="khoa_hoc_id" rules={[]} >
                                  {renderCourses()}
                              </Form.Item>
                              <Form.Item className="input-col" label="Mô đun" name="mo_dun_id" rules={[]} >
                                  {renderModules()}
                              </Form.Item>
                              <Form.Item className="input-col" label="Lớp học" name="lop_id" rules={[]} >
                                  {renderClasses()}
                              </Form.Item>
                              <Form.Item className="input-col" 
                                label="Trạng thái (Thêm mới mặc định là đang hoạt động)" name="trang_thai" rules={[]}
                                initialValue={true}
                              >
                                  {renderStatus()}
                              </Form.Item>
                              <Form.Item className="input-col" label="Mô tả" name="mo_ta" rules={[]} >
                                  <TextArea placeholder="Nhập mô tả" />
                              </Form.Item>
                                <Space>
                                  <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && thematic.status === 'success' && thematic) ? 'Cập nhật' : 'Thêm mới'}   
                                  </Button>
                                  {(state.isEdit && thematic.status === 'success' && thematic) 
                                  ?  <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
                                      Hủy bỏ
                                    </Button>
                                  : ''}    
                                </Space>                                                                        
                          </Form>
                        </div>                           
                  </Col>
              </Row>
        
          </div>
    )
}

export default ThematicCate;