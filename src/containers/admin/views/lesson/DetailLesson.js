import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import config from '../../../../configs/index';
import '../../../../../node_modules/video-react/styles/scss/video-react.scss';

// component antd
import { Row, Col, Form, Input, Select, Upload, Button, message, notification, Space, Progress, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Player } from "video-react";

// other
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import * as courseActions from '../../../../redux/actions/course';
import * as moduleActions from '../../../../redux/actions/part';
import * as thematicActions from '../../../../redux/actions/thematic';
import * as programmeAction from '../../../../redux/actions/programme';
import * as lessonActions from '../../../../redux/actions/lesson';
import { useSelector, useDispatch } from "react-redux";

// pdf
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const DetailLesson = () => {
    let id = useParams(); // { id: '1' }
    let history = useHistory();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const programmes = useSelector(state => state.programme.list.result);
    const thematics = useSelector(state => state.thematic.listbyId.result);
    const loadingThematics = useSelector(state => state.thematic.listbyId.loading);

    const lesson = useSelector(state => state.lesson.item.result);
    const loading = useSelector(state => state.lesson.item.loading);
    const error = useSelector(state => state.lesson.item.error);

    const courses = useSelector(state => state.course.list.result);
    const loadingCourses = useSelector(state => state.course.list.loading);

    const modules = useSelector(state => state.part.list.result);
    const loadingModules = useSelector(state => state.part.list.loading);

    const formDefault = {
      ten_bai_giang: '',
      loai_bai_giang: '',
      chuyen_de_id: '',
      trang_thai: true,
      mo_ta: '',
    };

    const [state, setState] = useState({
        thematicId: 1,
        trang_thai: 1,
        type: 'pdf',
        // upload image and video
        filePdf: '',
        Uploading: false,
        fileVid: '',
        form: formDefault,
    });

    const [progress, setProgress] = useState(0);

    // props for upload image
    const propsPdf = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  
        beforeUpload: file => {
          const isPNG = file.type === 'application/pdf';
          setState({...state, type: 'pdf'});
          if (!isPNG) {
            message.error(`${file.name} có định dạng không phải là application/pdf`);
          }
          // check dung lượng file trên 100mb => không cho upload
          let size = true;
          if (file.size > 512000000) {
              message.error(`${file.name} dung lượng file quá lớn`);
              size = false;
          }
          return (isPNG && size) || Upload.LIST_IGNORE;
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
  
      // props for upload image
    const propsVideo = {
        name: 'file',
        action: '#',
  
        beforeUpload: file => {
          const isPNG = file.type === 'video/mp4';
          setState({...state, type: 'video'});
          if (!isPNG) {
            message.error(`${file.name} có định dạng không phải là video/mp4`);
          }
          // check dung lượng file trên 100mb => không cho upload
          let size = true;
          if (file.size > 512000000) {
              message.error(`${file.name} dung lượng file quá lớn`);
              size = false;
          }
          return (isPNG && size) || Upload.LIST_IGNORE;
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

        onDrop(e) {
          console.log('Dropped files', e.dataTransfer.files);
          setState({...state, fileVid: ''});
        },
    };

    useEffect(() => {
        dispatch(courseActions.getCourses({ idkct: 1, status: '', search: '' }));
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(lessonActions.getLesson({ id: id.id }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const callback3 = (res) => {
        if (res.status === 'success') {
            form.setFieldsValue(lesson.data);
        } else {
            notification.error({
                message: 'Thông báo',
                description: 'Lấy thông tin thất bại',
            })
        }
      };

      const callback2 = (res) => {
        if (res.status === 'success') {
            dispatch(thematicActions.getThematicsByIdModule({ idModule: lesson.data.mo_dun_id }, callback3));
        } else {
            notification.error({
                message: 'Thông báo',
                description: 'Lấy thông tin thất bại',
            })
        }
      };

      const callback = (res) => {
        if (res.status === 'success') {
          dispatch(moduleActions.getModulesByIdCourse({ idCourse: lesson.data.khoa_hoc_id }, callback2));
        } else {
          notification.error({
              message: 'Thông báo',
              description: 'Lấy thông tin thất bại',
          })
        }
      };

      if (lesson.status === 'success' && courses.status === 'success') {
        dispatch(courseActions.getCourses({ idkct: lesson.data.kct_id, status: '', search: '' }, callback));
      }
    }, [lesson]);  // eslint-disable-line react-hooks/exhaustive-deps

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
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          loading={loadingModules}
          onChange={(mo_dun_id) => {
            dispatch(thematicActions.getThematicsByIdModule({ idModule: mo_dun_id }))
          }}
          placeholder="Chọn mô đun"
        >
          {options}
        </Select>
      );
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
          showSearch={true}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          loading={loadingThematics}
          onChange={(chuyen_de_id) => {
            setState({...state, thematicId: chuyen_de_id });
          }}
          placeholder="Chọn chuyên đề"
        >
          {options}
        </Select>
      );
    }

    const renderStatus = () => {
        return (
          <Select
            value={state.trang_thai}
            onChange={(trang_thai) => setState({ ...state, trang_thai })}
            placeholder="Chọn trạng thái"
          >
            <Option value={1} >Đang hoạt động</Option>
            <Option value={0} >Đã dừng</Option>
          </Select>
        );
    };
    
    const renderLessionCategories = () => {
        return (
          <Select
            disabled
            placeholder='Chọn loại bài giảng'
          >
            <Option value='pdf' >Pdf</Option>
            <Option value='video' >video</Option>
          </Select>
        );
      // }
    };

    const editLesson = async (values) => {
      setState({...state, Uploading: true});

      if (values.chuyen_de_id === undefined) { // check null
          notification.warning({
            message: 'Cảnh báo',
            description: 'Thông tin bài giảng chưa đủ',
          })
          return;
      }
     
      const formData = new FormData();
      formData.append('ten_bai_giang', values.ten_bai_giang);
      formData.append('loai_bai_giang', values.loai_bai_giang);
      formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
      formData.append('chuyen_de_id', values.chuyen_de_id);
      formData.append('trang_thai', values.trang_thai);
      // video , image
      if (state.filePdf !== '') {
        if (lesson.data.link_bai_giang !== null) {
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Chuyên đề này đã có bài giảng pdf \n Bạn có muốn ghi đè bài giảng đã có không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
              formData.append('link_bai_giang', state.filePdf);
            },
          });
          
        } else {
          formData.append('link_bai_giang', state.filePdf);
        }
      }
        
      if (state.fileVid !== '') {
        formData.append('link_bai_giang', state.fileVid);
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
        await axios.put(
          config.API_URL + `/lesson/${id.id}`,
          formData,
          configa,
        );
        form.resetFields();
        history.push('/admin/lesson/lesson');
        setState({...state, Uploading: false});
        notification.success({
            message: 'Thành công',
            description: 'Cập nhật bài giảng thành công',
        });
      } catch (err) {
        setState({...state, Uploading: false});
        notification.error({
            message: 'Thông báo',
            description: 'Cập nhật bài giảng thất bại: ' + error,
        });
      }
    }

    const renderToolbar = Toolbar => (
      <Toolbar>
          {(slots) => {
              const {
                  CurrentPageInput,
                  CurrentScale,
                  GoToNextPage,
                  GoToPreviousPage,
                  NumberOfPages,
                  ZoomIn,
                  ZoomOut,
              } = slots;
              return (
                  <div className="toolbar-mobile">
                      <div style={{ padding: '0px 2px' }}>
                          <ZoomOut>
                              {(props) => (
                                  <button
                                      style={{
                                          backgroundColor: '#357edd',
                                          border: 'none',
                                          borderRadius: '4px',
                                          color: '#ffffff',
                                          cursor: 'pointer',
                                          padding: '8px',
                                      }}
                                      onClick={props.onClick}
                                  >
                                      Zoom out
                                  </button>
                              )}
                          </ZoomOut>
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          <CurrentScale>{(props) => <span>{`${Math.round(props.scale * 100)}%`}</span>}</CurrentScale>
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          <ZoomIn>
                              {(props) => (
                                  <button
                                      style={{
                                          backgroundColor: '#357edd',
                                          border: 'none',
                                          borderRadius: '4px',
                                          color: '#ffffff',
                                          cursor: 'pointer',
                                          padding: '8px',
                                      }}
                                      onClick={props.onClick}
                                  >
                                      Zoom in
                                  </button>
                              )}
                          </ZoomIn>
                      </div>
                      <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                          <GoToPreviousPage>
                              {(props) => (
                                  <button
                                      style={{
                                          backgroundColor: props.isDisabled ? '#96ccff' : '#357edd',
                                          border: 'none',
                                          borderRadius: '4px',
                                          color: '#ffffff',
                                          cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                          padding: '8px',
                                      }}
                                      disabled={props.isDisabled}
                                      onClick={props.onClick}
                                  >
                                      Trang trước
                                  </button>
                              )}
                          </GoToPreviousPage>
                      </div>
                      <div style={{ padding: '0px 2px', width: '4rem' }}>
                          <CurrentPageInput />
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          / <NumberOfPages />
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          <GoToNextPage>
                              {(props) => (
                                  <button
                                      style={{
                                          backgroundColor: props.isDisabled ? '#96ccff' : '#357edd',
                                          border: 'none',
                                          borderRadius: '4px',
                                          color: '#ffffff',
                                          cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                          padding: '8px',
                                      }}
                                      disabled={props.isDisabled}
                                      onClick={props.onClick}
                                  >
                                      Trang tiếp theo
                                  </button>
                              )}
                          </GoToNextPage>
                      </div>
                  </div>
              );
          }}
      </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin(
      {
          sidebarTabs: (defaultTabs) => [],
          renderToolbar
      }
    );

    return (
        <>
        {loading && <LoadingCustom />}
        {(lesson && lesson.status === 'success' && modules.status === 'success') &&  
            <div className="content">
                <Row className="app-main">
                    <Col span={24} className="body-content">
                        <Row>
                            <Col xl={10} sm={24} xs={24} className="cate-form-block">
                                <h5>Sửa thông tin bài giảng</h5>
                                <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={editLesson}>
                                        <Form.Item
                                            className="input-col"
                                            label="Tên bài giảng"
                                            name="ten_bai_giang"
                                            rules={[{
                                                required: true,
                                                message: 'Tên bài giảng là trường bắt buộc.',
                                              }]}
                                            >
                                                <Input placeholder="Nhập tên bài giảng"/>
                                        </Form.Item>
                                        <Form.Item
                                            className="input-col"
                                            label="Loại bài giảng"
                                            name="loai_bai_giang"
                                            rules={[{
                                                required: true,
                                                message: 'Loại bài giảng là bắt buộc',
                                            },]}
                                        >
                                            {renderLessionCategories()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Khung chương trình" name="kct_id" 
                                          rules={[{
                                            required: true,
                                            message: 'Khung chương trình là trường bắt buộc.',
                                          }]}
                                        >
                                          {renderProgramme()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Khóa học" name="khoa_hoc_id" 
                                          rules={[{
                                            required: true,
                                            message: 'Khóa học là trường bắt buộc.',
                                          }]}
                                        >
                                            {renderCourses()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Mô đun" name="mo_dun_id" 
                                          rules={[{
                                            required: true,
                                            message: 'Mô đun là trường bắt buộc.',
                                          }]}
                                        >
                                            {renderModules()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Chuyên đề" name="chuyen_de_id" 
                                          rules={[{
                                            required: true,
                                            message: 'Chuyên đề là trường bắt buộc.',
                                          }]}
                                        >
                                            {renderThematics()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Mô tả" name="mo_ta" rules={[]}>
                                            <TextArea placeholder="Nhập mô tả bài giảng"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Trạng thái"
                                            className="input-col"
                                            name="trang_thai"
                                            rules={[]} >
                                            {renderStatus()}
                                        </Form.Item>  
                                        {lesson.data.loai_bai_giang === 'pdf' && 
                                            <Form.Item className="input-col" label="File bài giảng PDF (trong trường hợp muốn thay bài giảng mới)" name="pdf" rules={[]}>                                
                                                <Dragger {...propsPdf} maxCount={1}
                                                    listType="picture"
                                                    className="upload-list-inline"
                                                    >
                                                    <p className="ant-upload-drag-icon">
                                                        <UploadOutlined />
                                                    </p>
                                                    <p className="ant-upload-text bold">Click chọn file bài giảng vào đây</p>
                                                </Dragger>
                                            </Form.Item>
                                        }      
                                        {lesson.data.loai_bai_giang === 'video' && 
                                            <Form.Item className="input-col" label="Upload video bài giảng (trong trường hợp muốn thay bài giảng mới)">
                                                <Dragger {...propsVideo} maxCount={1}
                                                listType="picture"
                                                className="upload-list-inline"
                                                >
                                                <p className="ant-upload-drag-icon">
                                                    <UploadOutlined />
                                                </p>
                                                <p className="ant-upload-text bold">Click chọn video bài giảng vào đây</p>
                                                </Dragger>
                                            </Form.Item>
                                        }                                  
                                        <Form.Item className="button-col">
                                          {(state.Uploading) && <Progress percent={progress}/>}
                                          <Space>
                                            <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>
                                          </Space>
                                        </Form.Item>
                                    </Form>
                            </Col>
                            <Col xl={13} sm={24} xs={24} style={{marginLeft:'10px'}}>
                                {lesson.data.loai_bai_giang === 'pdf' && 
                                    <div style={{width:"100%", height:"800" }}>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                            <Viewer fileUrl={config.API_URL + lesson.data.link_bai_giang} plugins={[defaultLayoutPluginInstance]}/>
                                        </Worker> 
                                    </div>
                                }
                                <br/>
                                {lesson.data.loai_bai_giang === 'video' &&
                                    <Player
                                        playsInline 
                                        poster="/assets/rank/1.png"
                                        src={config.API_URL + lesson.data.link_bai_giang}
                                        fluid={false}
                                    />
                                }
                            </Col>
                        </Row>
                    </Col>  
                </Row>
            </div>
        }
        </>
    );
}

export default DetailLesson;