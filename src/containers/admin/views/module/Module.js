import React, { useState, useEffect } from "react";
import moment from "moment";
// component
import AppFilter from "components/common/AppFilter";
import { Row, Col, Form, Input, Button, Space, Select, Modal,
  Table, Tag, Avatar, Upload, message, notification, Radio } from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import Loading from '../../../components/parts/Loading/Loading';
import EllipsisTooltip from "components/common/EllipsisTooltip";

//
import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';

// redux
import * as partActions from '../../../../redux/actions/part';
import * as courseActions from '../../../../redux/actions/course';
import * as majorActions from '../../../../redux/actions/major';
import * as userActions from '../../../../redux/actions/user';
import * as programmeAction from '../../../../redux/actions/programme';
import { useSelector, useDispatch } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ModuleCate = (props) => {
    const data = [];

    const dispatch = useDispatch();

    const modules = useSelector(state => state.part.list.result);
    const courses = useSelector(state => state.course.list.result);
    const loadingcourses = useSelector(state => state.course.list.loading);
    const error = useSelector(state => state.part.list.error);
    const majors = useSelector(state => state.major.list.result);
    const teachers = useSelector(state => state.user.listTeacher.result);
    const loadingteachers = useSelector(state => state.user.listTeacher.loading);
    const programmes = useSelector(state => state.programme.list.result);

    const [filter, setFilter] = useState({
      khoa_hoc_id: '',
      trang_thai: '',
      search: '',
      start: '',
      end: '',
    });

    useEffect(() => {
      dispatch(partActions.filterModule({ idCourse: '', status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end}));
      dispatch(programmeAction.getProgrammes({ status: '' }));
      dispatch(majorActions.getMajors());

      dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (modules.status === 'success') {
      modules.data.map((module, index) => data.push({...module, 'key': index}));
    }

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
        title: 'Tên mô đun',
        dataIndex: 'ten_mo_dun',
        key: 'ten_mo_dun',
        responsive: ['md'],
      },
      {
        title: 'Loại mô đun',
        dataIndex: 'loai_tong_hop',
        key: 'loai_tong_hop',
        responsive: ['md'],
        render: (loai_tong_hop) => (
          loai_tong_hop === 1 ? 'Phần thi tổng hợp' : loai_tong_hop === 2 ? 'Phần thi mô đun' : 'Phần bài học'
        )
      },
      {
        title: 'Giáo viên',
        dataIndex: 'ten_giao_vien',
        key: 'ten_giao_vien',
        responsive: ['md'],
      },
      {
        title: 'Lĩnh vực',
        dataIndex: 'linh_vuc',
        key: 'linh_vuc',
        responsive: ['md'],
        width: 250,
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
        title: 'Khóa học',
        dataIndex: 'ten_khoa_hoc',
        key: 'ten_khoa_hoc',
        responsive: ['lg'],
        width: 250,
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
          render: (trang_thai) => (
            <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
              {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
            </Tag>
          ),
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
        key: 'mo_dun_id',
        dataIndex: 'mo_dun_id',
        // Redirect view for edit
        render: (mo_dun_id) => (
          <Space size="middle">
            <a href={ config.BASE_URL + "/admin/detailModule/" + mo_dun_id} type="button" className="ant-btn ant-btn-round ant-btn-primary">Xem</a>
            <Button shape="round" type="danger" onClick={() => DeleteModule(mo_dun_id)}>Xóa</Button> 
            <Button shape="round" style={{backgroundColor: "rgb(239 166 141)"}} onClick={() => ChangeStatusModule(mo_dun_id)}>Dừng</Button> 
          </Space>
        ),
      },
    ];

    const [form] = Form.useForm();
    const defaultForm = {
      ten_nhom: '',
      mo_ta: '',
      ngay_tao: '',
      trang_thai: 1,
      anh_dai_dien: '',
      total: 0,
    };
    const [state, setState] = useState({
      courseId: 1,
      checkedList: [],
      checkAll: false,
      isEdit: false,
      isChanged: false,
      openMediaLibrary: false,
      form: defaultForm,
      // upload image and video
      fileImg: '',
      fileVid: '',
    });

    // props for upload image
    const propsImage = {
      name: 'file',
      action: '#',

      beforeUpload: file => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isPNG) {
          message.error(`${file.name} có định dạng không phải là png/jpg`);
        }
        return isPNG || Upload.LIST_IGNORE;
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
        setState({ ...state, fileImg: '' });
      },
    };

    // props for upload image
    const propsVideo = {
      name: 'file',
      action: '#',

      beforeUpload: file => {
        const isPNG = file.type === 'video/mp4';
        if (!isPNG) {
          message.error(`${file.name} có định dạng không phải là video/mp4`);
        }
        return isPNG || Upload.LIST_IGNORE;
      },

      onChange(info) {
        setState({ ...state, fileVid: info.file.originFileObj });
      },

      async customRequest(options) {
        const { onSuccess } = options;
  
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      },
      
      onRemove(e) {
        setState({ ...state, fileVid: '' });
      },
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
      dispatch(partActions.filterModule({ idCourse: filter.khoa_hoc_id, status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
        start: filter.start, end: filter.end }));
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
              showSearch={false}
              placeholder="Chọn khung chương trình"
              onChange={(kct_id) => dispatch(courseActions.getCourses({ idkct: kct_id, status: '', search: '' }))}
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
          showSearch={false} value={state.courseId}
          loading={loadingcourses}
          onChange={(khoa_hoc_id) => setState({khoa_hoc_id, ...state, isChanged: true })}
          placeholder="Chọn khóa học"
        >
          {options}
        </Select>
      );
    }

    const renderStatus = () => {
        return (
          <Select disabled
            value={state.form.trang_thai}
            onChange={(trang_thai) => setState({ ...state, trang_thai, isChanged: true })}
            placeholder="Chọn trạng thái"
          >
            <Option value={1} >Đang hoạt động</Option>
            <Option value={0} >Đã dừng</Option>
          </Select>
        );
    };

    const renderMajor = () => {
      let options = [];
      if (majors.status === 'success') {
        options = majors.data.map((major) => (
          <Option key={major.chuyen_nganh_id} value={major.chuyen_nganh_id} >{major.ten_chuyen_nganh}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          loading={loadingcourses}
          onChange={(chuyen_nganh_id) => {
            dispatch(userActions.getTeachers({ idMajor: chuyen_nganh_id, status: '1', startDay: '', endDay: '', search: '' }));
          }}
          placeholder="Chọn chuyên ngành"
        >
          {options}
        </Select>
      );
    };

    const renderTeacher = () => {
      let options = [];
      if (teachers.status === 'success') {
        options = teachers.data.map((module) => (
          <Option key={module.giao_vien_id} value={module.giao_vien_id} >{module.ho_ten}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          loading={loadingteachers}
          placeholder="Chọn giáo viên"
        >
          {options}
        </Select>
      );
    };
    
    const createModule = (values) => {
      if (values.khoa_hoc_id === undefined) { // check null
        notification.warning({
          message: 'Cảnh báo',
          description: 'Thông tin mô đun chưa đủ',
        })
        return;
      }
      const formData = new FormData();
      formData.append('ten_mo_dun', values.ten_mo_dun);
      formData.append('linh_vuc', values.linh_vuc);
      formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
      formData.append('khoa_hoc_id', values.khoa_hoc_id);
      formData.append('loai_tong_hop', values.loai_tong_hop);
      if (values.giao_vien_id !== undefined)
        formData.append('giao_vien_id', values.giao_vien_id);

      // video , image
      if (state.fileImg !== '')
        formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
      if (state.fileVid !== '')
        formData.append('video_gioi_thieu', state.fileVid);

      const callback = (res) => {
        if (res.data.status === 'success' && res.status === 200) {
          form.resetFields();
          dispatch(partActions.filterModule({ idCourse: filter.khoa_hoc_id, status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end}));        
          notification.success({
            message: 'Thành công',
            description: 'Thêm module mới thành công',
          })
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Thêm module mới thất bại. Chú ý 1 mô đun chỉ có 1 phần tổng hợp',
          })
        }
      };
      dispatch(partActions.CreateModule(formData, callback));
    };

    const DeleteModule = (id) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chán muốn xóa mô đun này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              dispatch(partActions.filterModule({ idCourse: filter.khoa_hoc_id, status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end}));
              notification.success({
                message: 'Thành công',
                description: 'Xóa module mới thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Xóa module mới thất bại',
              })
            };
          }
          dispatch(partActions.DeleteModule({ idModule: id }, callback))
        },
      });
    };

    const ChangeStatusModule = (id) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chán muốn hủy hoạt động mô đun này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              dispatch(partActions.filterModule({ idCourse: filter.khoa_hoc_id, status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end}));
              notification.success({
                message: 'Thành công',
                description: 'Chuyển trạng thái module thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Chuyển trạng thái module thất bại',
              })
            };
          }
          dispatch(partActions.ChangeStatusModule({ idModule: id }, callback))
        },
      });
    }

    return (
        <div className="content">
          <Row className="app-main">
                <Col xl={24} className="body-content">
                    <Row>
                        <Col xl={24} sm={24} xs={24}>
                          <AppFilter
                              title={"Nhóm mô đun"}
                              isShowCourse={true}
                              isShowModule={false}
                              isShowThematic={false}
                              isShowStatus={true}
                              isShowSearchBox={true}
                              isShowDatePicker={true}
                              isRangeDatePicker={true}
                              courses={courses.data?.filter((course) => course.loai_kct === 2)}
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
            description: 'Lấy dữ liệu module thất bại',
          })}
          <Row>
            <Col xl={24} sm={24} xs={24} className="cate-form-block">
                  <h5>Thêm mới mô đun</h5>
                  <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createModule}>
                    <Row gutter={25}>
                      <Col xl={12} sm={24} xs={24} className="left-content">              
                        <Form.Item
                            className="input-col"
                            label="Tên mô đun"
                            name="ten_mo_dun"
                            rules={[
                                {
                                required: true,
                                message: 'Tên chuyên đề là trường bắt buộc.',
                                },
                            ]}
                            >
                                <Input placeholder="Nhập tên mô đun"/>
                        </Form.Item>
                        <Form.Item
                          className="input-col"
                          label="Lĩnh vực"
                          name="linh_vuc"
                          rules={[
                              {
                                required: true,
                                message: 'Tên lĩnh vực là trường bắt buộc.',
                              },
                          ]}
                        >
                          <Input placeholder="Nhập tên lĩnh vực"/>
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Khung chương trình"
                            name="khung_ct_id"
                            rules={[
                                {
                                  required: true,
                                  message: 'Khung chương trình là trường bắt buộc.',
                                },
                            ]}
                            >
                                {renderProgramme()}
                        </Form.Item>
                        <Form.Item className="input-col" label="Khóa học" name="khoa_hoc_id" 
                          rules={[{
                            required: true,
                            message: 'Khóa học là bắt buộc',
                          },]}
                        >
                            {renderCourses()}
                        </Form.Item>
                        <Form.Item className="input-col" label="Mô tả" name="mo_ta" rules={[]}>
                            <TextArea placeholder="Nhập mô tả"/>
                        </Form.Item>
                        <Form.Item
                            initialValue={state.form.trang_thai}
                            label="Trạng thái"
                            className="input-col"
                            name="trang_thai"
                            rules={[]} >
                            {renderStatus()}
                        </Form.Item>     
                        <Form.Item
                          name="loai_tong_hop"
                          label="Loại mô đun"
                          initialValue={state.form.total}
                          rules={[
                            {
                              required: true,
                              message: 'Loại mô đun là trường bắt buộc.',
                            },
                          ]}
                        >
                            <Radio.Group>
                              <Radio className="option-payment" value={1}>
                                Phần thi tổng hợp
                              </Radio>
                              {/* <Radio className="option-payment" value={2}>
                                Phần thi mô đun
                              </Radio> */}
                              <Radio className="option-payment" value={0}>
                                Phần bài học
                              </Radio>
                            </Radio.Group>
                        </Form.Item>
                        
                      </Col>   
                      {/* Giáo viên */}
                      <Col xl={12} sm={24} xs={24} className="right-content" >                                    
                        <Form.Item
                            label="Chuyên ngành"
                            className="input-col"
                            name="chuyen_nganh"
                            rules={[]} >
                            {renderMajor()}
                        </Form.Item>     
                        <Form.Item className="input-col" label="Giáo viên" name="giao_vien_id" rules={[]}>
                          {renderTeacher()}
                        </Form.Item>
                        <Form.Item className="input-col" label="Ảnh đại diện" name="anh_dai_dien" rules={[]}>
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
                        <Form.Item className="input-col" label="Video đại diện" name="video_gioi_thieu" rules={[]}>
                          <Dragger {...propsVideo} maxCount={1}
                            listType="picture"
                            className="upload-list-inline"
                          >
                            <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                            </p>
                            <p className="ant-upload-text bold">Click hoặc kéo thả video đại diện vào đây</p>
                          </Dragger>
                        </Form.Item> 
                      </Col>     
                    </Row>
                    
                    <Form.Item className="button-col">
                      <Button shape="round" type="primary" htmlType="submit" >Thêm mới
                      </Button>
                    </Form.Item>
                </Form>
            </Col>
          </Row>
        </div>
    )
}

export default ModuleCate;