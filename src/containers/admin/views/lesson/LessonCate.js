import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import { Row, Col, Form, Input, Select, Table, notification, Tag, Button, 
  Modal, Space, Upload, message, Progress } from "antd";
// import Loading from '../../../components/parts/Loading/Loading';
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AppFilter from "components/common/AppFilter";
// redux
import * as courseActions from '../../../../redux/actions/course';
import * as moduleActions from '../../../../redux/actions/part';
import * as lessonActions from '../../../../redux/actions/lesson';
import * as thematicActions from '../../../../redux/actions/thematic';
import * as programmeAction from '../../../../redux/actions/programme';
import { useSelector, useDispatch } from "react-redux";

import config from '../../../../configs/index';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;


const LessonCate = () => {
    const [form] = Form.useForm();

    const columns = [
      {
        title: 'Tên bài giảng',
        dataIndex: 'ten_bai_giang',
        key: 'ten_bai_giang',
        responsive: ['md'],
        width: 250
      },
      {
        title: 'Loại bài giảng',
        dataIndex: 'loai_bai_giang',
        key: 'loai_bai_giang',
        responsive: ['md'],
      },
      {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
        responsive: ['md'],
        width: 150,
        render: (trang_thai) => (
          <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
            {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
          </Tag>
        ),
      },      
      {
        title: 'Tùy chọn',
        key: 'bai_giang_id',
        dataIndex: 'bai_giang_id',
        // Redirect view for edit
        render: (bai_giang_id) => (
          <Space size="middle">
            <NavLink to={"/admin/detailLesson/" + bai_giang_id} type="button" className="ant-btn ant-btn-round ant-btn-primary">Sửa</NavLink>
          </Space>
        ), 
      },
    ];

    const data = [];
    const dispatch = useDispatch();

    const [progress, setProgress] = useState(0);

    const programmes = useSelector(state => state.programme.list.result);
    const lessons = useSelector(state => state.lesson.list.result);
    // const loadingLessons = useSelector(state => state.lesson.list.loading);
    const erorrLessons = useSelector(state => state.lesson.list.erorr);

    const thematics = useSelector(state => state.thematic.listbyId.result);
    const loadingThematics = useSelector(state => state.thematic.listbyId.loading);

    const courses = useSelector(state => state.course.list.result);
    const loadingCourses = useSelector(state => state.course.list.loading);

    const modules = useSelector(state => state.part.list.result);
    const loadingModules = useSelector(state => state.part.list.loading);

    const [state, setState] = useState({
      thematicId: 1,
      typeLesson: 'pdf',
      isEdit: false,
      Uploading: false,
      isAddVideo: false,
      trang_thai: true,
      // file
      filePdf: '',
      fileListVideo: []
    });

    useEffect(() => {
      dispatch(lessonActions.filterLessons({ idCourse: '', idModule: '', idThematic: '', status: '', search: '', 
      start: '', end: ''}));
      dispatch(programmeAction.getProgrammes({ status: '' }));
      // dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (lessons.status === 'success') {
      lessons.data.map((lesson, index) => {
        data.push({...lesson, key: index});
        return null
      }) 
    }

    const propsImage = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

      beforeUpload: file => {
        const isPDF = file.type === 'application/pdf' || file.type === 'video/mp4';
        if (file.type === 'application/pdf') setState({ ...state, typeLesson: 'pdf' });
        else if (file.type === 'video/mp4') setState({ ...state, typeLesson: 'video' });

        if (!isPDF) {
          message.error(`${file.name} có định dạng không phải là application/pdf hoặc video/mp4`);
        }
        return isPDF || Upload.LIST_IGNORE;
      },

      onChange(info) {       
        setState({ ...state, filePdf: info.file.originFileObj });
      },

      async customRequest(options) {
        const { onSuccess } = options;
  
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      },

      onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
        setState({...state, fileImg: ''});
      },
    };

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
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          loading={loadingCourses}
          onChange={(khoa_hoc_id) => {
            dispatch(moduleActions.getModulesByIdCourse({ idCourse: khoa_hoc_id }))
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
          showSearch={true}
          loading={loadingModules}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          onChange={(mo_dun_id) => {
            dispatch(thematicActions.getThematicsByIdModule({ idModule: mo_dun_id }))
          }}
          placeholder="Chọn mô đun"
        >
          {options}
        </Select>
      );
    };

    const renderLessionCategories = () => {
        return (
          <Select
            placeholder='Chọn loại bài giảng'
          >
            <Option value='pdf'>pdf</Option>
            <Option value='video'>video</Option>
          </Select>
        );
      // }
    };

    const renderThematics = () => {
      let options = [];
      if (thematics.status === 'success') {
        options = thematics.data.thematics.map((thematic) => (
          <Option key={thematic.chuyen_de_id} value={thematic.chuyen_de_id} >{thematic.ten_chuyen_de}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          loading={loadingThematics}
          onChange={(chuyen_de_id) => {
            setState({...state, thematicId: chuyen_de_id });
          }}
          placeholder="Chọn chuyên đề"
        >
          {options}
        </Select>
      );
    };

    const createLesson = async (values) => {  
      setState({...state, Uploading: true});

      console.log(state.typeLesson, values.loai_bai_giang)
      if (state.typeLesson !== values.loai_bai_giang) {
        notification.error({
          message: 'Cảnh báo',
          description: 'Loại bài giảng không khớp với loại file tải lên',
        });
        return;
      }
      
      const formData = new FormData();
      let isExist = false;
      
      if (values.loai_bai_giang === 'pdf') {
        for (var i = 0; i < data.length; i++) {
          if (data[i].chuyen_de_id === values.chuyen_de && data[i].loai_bai_giang === 'pdf') {
            isExist = true;
          }        
        }
      }
      if (isExist) {
        Modal.confirm({
          icon: <ExclamationCircleOutlined />,
          content: 'Chuyên đề này đã có bài giảng pdf \n Bạn có muốn ghi đè bài giảng đã có không?',
          okText: 'Đồng ý',
          cancelText: 'Hủy',
          onOk() {
            formData.append('ten_bai_giang', values.ten_bai_giang);
            formData.append('loai_bai_giang', state.typeLesson);
            formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
            formData.append('chuyen_de_id', values.chuyen_de);
            // video , image
            if (state.filePdf !== '')
              formData.append('link_bai_giang', state.filePdf);   
          },
        });
      } else {
        formData.append('ten_bai_giang', values.ten_bai_giang);
        formData.append('loai_bai_giang', values.loai_bai_giang);
        formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
        formData.append('chuyen_de_id', values.chuyen_de);
        // video , image
        if (state.filePdf !== '')
          formData.append('link_bai_giang', state.filePdf);   
        }

        const configa = {
            headers: { "content-type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem('userToken')}`, },
            onUploadProgress: event => {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgress(percent);
              if (percent === 100) {
                setTimeout(() => setProgress(0), 1000);
              }
            }
        }; 
        try {
          await axios.post(
            config.API_URL + '/lesson/create',
            formData,
            configa,
          );
          form.resetFields();
          dispatch(lessonActions.filterLessons({ idCourse: '', idModule: '', idThematic: '', status: '', search: '',
            start: '', end: '' }));
          setState({...state, Uploading: false});
          notification.success({
            message: 'Thành công',
            description: 'Thêm bài giảng mới thành công',
          })
        } catch (err) {
          setState({...state, Uploading: false});
          notification.error({
            message: 'Thông báo',
            description: 'Thêm bài giảng mới thất bại ' + err,
          })
        }
    };

    const onFilterChange = (field, value) => {
      dispatch(lessonActions.filterLessons({ idCourse: '', idModule: '', idThematic: '', status: '', search: value,
          start: '', end: '' }));
    };

    return (
      <div className="content">
          <Row className="app-main">
            <Col span={24} className="body-content">
              <div className="w5d-form">
                <Form layout="vertical" className="" form={form} onFinish={createLesson}>
                  <Row gutter={25}>
                    <Col xl={15} sm={16} xs={24}>
                      <h5 className="header-form-title">Thêm mới bài giảng</h5>
                    </Col>
                    <Col xl={9} sm={24} xs={24}>
                      {/* <h5>Danh sách bài giảng</h5> */}
                      <AppFilter
                          title="Danh sách bài giảng"
                          isShowCourse={false}
                          isShowStatus={false}
                          isShowSearchBox={true}
                          isShowDatePicker={false}
                          isRangeDatePicker={false}
                          onFilterChange={(field, value) => onFilterChange(field, value)}
                      />
                    </Col>
                    <Col xl={15} sm={24} xs={24} className="left-content">
                      <div className="border-box">
                        <Row gutter={25}>
                          <Col xl={12} sm={12} xs={24}>
                            <Form.Item
                              className="input-col"
                              label="Tên bài giảng"
                              name="ten_bai_giang"
                              rules={[
                                {
                                  required: true,
                                  message: "Tên bài giảng là bắt buộc",
                                },
                              ]}
                            >
                              <Input placeholder="Tên bài giảng"/>
                            </Form.Item>
                             
                            <Form.Item
                              initialValue={"video"}
                              className="input-col"
                              label="Loại bài giảng"
                              name="loai_bai_giang"
                              rules={[
                                {
                                  required: true,
                                  message: 'Loại bài giảng là bắt buộc',
                                },
                              ]}
                            >
                              {renderLessionCategories()}
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
                          </Col>
                          <Col xl={12} sm={12} xs={24}>
                            <Form.Item
                              className="input-col"
                              label="Khóa học"
                              name="khoa_hoc"
                              rules={[
                                {
                                  required: true,
                                  message: 'Khóa học là bắt buộc',
                                },
                              ]}
                            >
                              {renderCourses()}
                            </Form.Item>   
                            <Form.Item
                              className="input-col"
                              label="Mô đun"
                              name="mo_dun"
                              rules={[
                                {
                                  required: true,
                                  message: 'Mô đun là bắt buộc',
                                },
                              ]}
                            >
                              {renderModules()}
                            </Form.Item>  
                            <Form.Item
                              className="input-col"
                              label="Chuyên đề"
                              name="chuyen_de"
                              rules={[
                                {
                                  required: true,
                                  message: 'Chuyên đề là bắt buộc',
                                },
                              ]}
                            >
                              {renderThematics()}
                            </Form.Item>   
                          </Col>
                        </Row>
                        <Form.Item className="input-col" label="Chọn pdf / video" name="bai_giang">
                          <Dragger {...propsImage} maxCount={1}
                            listType="picture"
                            className="upload-list-inline"
                          >
                            <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                            </p>
                            <p className="ant-upload-text bold">Click chọn file hoặc video bài giảng vào đây</p>
                          </Dragger>
                        </Form.Item> 
                        <Form.Item className="input-col" label="Mô tả" name="mo_ta" rules={[]}>
                          <TextArea rows={6} placeholder="Mô tả"/>
                        </Form.Item>
                        <Form.Item className="button-col">
                          {(state.Uploading) && <Progress percent={progress}/>}
                          <Space>
                            <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button>
                          </Space>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col xl={9} sm={24} xs={24} className="right-content">
                      {/* {loadingLessons && <LoadingCustom/>} */}
                      <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={{defaultPageSize: 6}}/>
                      {erorrLessons && notification.error({
                        message: 'Thông báo',
                        description: 'Lấy dữ liệu bài giảng thất bại',
                      })}
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
      </div>
    )
}

export default LessonCate;