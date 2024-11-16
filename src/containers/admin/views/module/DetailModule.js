
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import config from '../../../../configs/index';
import '../../../../../node_modules/video-react/styles/scss/video-react.scss';

// component antd
import { Row, Col, Form, Input, Select, Upload, Button, message, Image, notification, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Player } from "video-react";

// other
import LoadingCustom from 'components/parts/loading/Loading';

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

// Chỉnh sửa thông tin module và hiển thi video + hình đại diện
const DetailModule = () => {
    let id = useParams(); // { id: '1' }
    let history = useHistory();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const courses = useSelector(state => state.course.list.result);
    const module = useSelector(state => state.part.item.result);
    const loadingcourses = useSelector(state => state.course.list.loading);
    const loading = useSelector(state => state.part.item.loading);
    const error = useSelector(state => state.part.item.error);
    const majors = useSelector(state => state.major.list.result);
    const teachers = useSelector(state => state.user.listTeacher.result);
    const loadingteachers = useSelector(state => state.user.listTeacher.loading);
    const programmes = useSelector(state => state.programme.list.result);
    
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
  
      // props for upload image
      const propsVideo = {
        name: 'file',
        action: '#',
  
        beforeUpload: file => {
            const isPNG = file.type === 'video/mp4';
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
        
        onRemove(e) {
            console.log(e);
            setState({ ...state, fileVid: '' });
        },
    };

    useEffect(() => {
        dispatch(partActions.getModule({ id: id.id }));
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
        dispatch(majorActions.getMajors());
        dispatch(userActions.getTeachers({ idMajor: '', status: '1', startDay: '', endDay: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const [state, setState] = useState({
        courseId: 1,
        trang_thai: 1,
        // upload image and video
        fileImg: '',
        fileVid: '',
    });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (module.status === 'success') {
            if (module.data.chuyen_nganh_id !== null)
                dispatch(userActions.getTeachers({ idMajor: module.data.chuyen_nganh_id, status: '1', startDay: '', endDay: '', search: '' }));
        };
    }, [majors]); // eslint-disable-line react-hooks/exhaustive-deps
    
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

    const renderParents = () => {
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
          <Select
            value={state.trang_thai}
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

    const editModule = (values) => {
        if (values.khoa_hoc === undefined) { // check null
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
        formData.append('khoa_hoc_id', values.khoa_hoc);
        formData.append('trang_thai', values.trang_thai);
        if (module.data.loai_tong_hop !== values.loai_tong_hop)
            formData.append('loai_tong_hop', values.loai_tong_hop);
        if (values.giao_vien_id !== undefined && values.giao_vien_id !== null) {
            formData.append('giao_vien_id', values.giao_vien_id);
        }

        // video , image
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg);
        if (state.fileVid !== '')
            formData.append('video_gioi_thieu', state.fileVid);

        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật module thành công',
                });
                history.push('/admin/thematic/cate');
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Cập nhật module thất bại',
                })
            }
        };
        dispatch(partActions.EditModule({ formData: formData, idModule: id.id }, callback));
    }

    return (
        <>
        {loading && <LoadingCustom />}
        {(module && module.status === 'success') &&  
            <div className="content">
                <Row className="app-main">
                    <Col span={24} className="body-content">
                        <Row>
                            <Col xl={10} sm={24} xs={24} className="cate-form-block">
                                <h5>Sửa thông tin mô đun</h5>
                                <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={editModule}>
                                        <Form.Item
                                            initialValue={module.data.ten_mo_dun}
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
                                        initialValue={module.data.linh_vuc}
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
                                        <Form.Item initialValue={module.data.kct_id}
                                            className="input-col"
                                            label="Khung chương trình"
                                            name="khung_ct_id"
                                            rules={[{
                                                required: true,
                                                message: 'Khung chương trình là bắt buộc',
                                            },]}
                                        >
                                              {renderProgramme()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Khóa học" name="khoa_hoc" initialValue={module.data.khoa_hoc_id} 
                                            rules={[{
                                                required: true,
                                                message: 'Khóa học là bắt buộc',
                                            },]}
                                        >
                                            {renderParents()}
                                        </Form.Item>
                                        <Form.Item
                                            label="Chuyên ngành"
                                            className="input-col"
                                            name="chuyen_nganh_id"
                                            initialValue={module.data.chuyen_nganh_id !== null ? module.data.chuyen_nganh_id : ""}
                                            rules={[]} 
                                        >
                                          {renderMajor()}
                                        </Form.Item>     
                                        <Form.Item className="input-col" label="Giáo viên" name="giao_vien_id" initialValue={module.data.giao_vien_id} rules={[]}>
                                            {renderTeacher()}
                                        </Form.Item>
                                        <Form.Item className="input-col" label="Mô tả" name="mo_ta" rules={[]} initialValue={module.data.mo_ta === null ? '' : module.data.mo_ta}>
                                            <TextArea placeholder=""/>
                                        </Form.Item>
                                        <Form.Item
                                            initialValue={module.data.trang_thai}
                                            label="Trạng thái"
                                            className="input-col"
                                            name="trang_thai"
                                            rules={[]} >
                                            {renderStatus()}
                                        </Form.Item>                                    
                                        <Dragger {...propsImage} maxCount={1}
                                            listType="picture"
                                            className="upload-list-inline"
                                            >
                                                <p className="ant-upload-drag-icon">
                                                <UploadOutlined />
                                            </p>
                                            <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                        </Dragger>
                                        <br/>
                                        <Dragger {...propsVideo} maxCount={1}
                                            listType="picture"
                                            className="upload-list-inline"
                                            >
                                            <p className="ant-upload-drag-icon">
                                                <UploadOutlined />
                                            </p>
                                            <p className="ant-upload-text bold">Click hoặc kéo thả video đại diện vào đây</p>
                                        </Dragger>
                                        <br/>
                                        {/* <Form.Item
                                            name="loai_tong_hop"
                                            valuePropName="checked"
                                            label="Phần tổng hợp"
                                            initialValue={module.data.loai_tong_hop}
                                        >
                                            <Checkbox>Phần tổng hợp</Checkbox>
                                        </Form.Item> */}
                                        <Form.Item
                                            name="loai_tong_hop"
                                            label="Loại mô đun"
                                            initialValue={module.data.loai_tong_hop}
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
                                        <Form.Item className="button-col">
                                            <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>
                                        </Form.Item>
                                        
                                    </Form>
                            </Col>
                            <Col xl={10} sm={24} xs={24} style={{marginLeft:'10%'}}>
                                <div>
                                    <Image
                                        onClick={() => setVisible(true)}
                                        width={400}
                                        height={400}
                                        src={config.API_URL + module.data.anh_dai_dien}
                                        fallback="data:image/png;base64,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"
                                    />
                                    <div style={{ display: 'none' }}>
                                        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                                        <Image src={config.API_URL + module.data.anh_dai_dien} />
                                        </Image.PreviewGroup>
                                    </div>
                                    
                                </div>
                                <br/>
                                <Player
                                        playsInline 
                                        poster={config.API_URL + '/image/banner-top4.png'}
                                        src={config.API_URL + module.data.video_gioi_thieu}
                                        fluid={false}
                                    />
                            </Col>
                        </Row>
                    </Col>  
                </Row>
            </div>
        }
        {error && notification.error({
            message: 'Thông báo',
            description: 'Lấy dữ liệu module thất bại',
        })}
        </>
    );
}

export default DetailModule;
