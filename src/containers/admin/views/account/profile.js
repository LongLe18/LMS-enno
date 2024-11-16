import React, { useState, useEffect } from 'react';
import './css/profile.css';
import moment from 'moment';
import jwt_decode from 'jwt-decode';

import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';

// component
import { Row, Col, Card, Avatar, Tabs, Tag, Form, Input, Upload, message, Select, notification, DatePicker, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// redux
import { useDispatch } from "react-redux";
import * as userActions from '../../../../redux/actions/user';

const { TabPane } = Tabs;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const ProfilePage = () => {
    const info = JSON.parse(localStorage.getItem('userInfo'))[0];
    const json_token = jwt_decode(localStorage.getItem('userToken'));
    
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const dispatch = useDispatch();

    const defaultForm = {
        gioi_tinh: "Nam",
        trang_thai: true,
        vai_tro: 'nhân viên'
    };

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
          console.log(e);
          setState({ ...state, fileImg: '' });
        },
    };

    const [state, setState] = useState({
        ngay_sinh: '',
        form: defaultForm,
        fileImg: ''
    });

    const renderGender = () => {
        return (
          <Select
            // value={state.form.gioi_tinh}
            // onChange={(gioi_tinh) => setState({ ...state, gioi_tinh })}
            placeholder="Chọn giới tính"
          >
            <Option value={"Nam"} >Nam</Option>
            <Option value={"Nữ"} >Nữ</Option>
          </Select>
        );
    };

    const onChange = (date, dateString) => {
        setState({ ...state, ngay_sinh: dateString });       
    };

    useEffect(() => {
        if (state.ngay_sinh !== '') {
            let info2 = {
                ...info, ngay_sinh: state.ngay_sinh !== null ? moment(state.ngay_sinh, "YYYY/MM/DD") : moment()
            }
            form.setFieldsValue(info2);
        } else {
            let info2 = {
                ...info, ngay_sinh: info.ngay_sinh !== null ? moment(info.ngay_sinh, "YYYY/MM/DD") : moment()
            }
            form.setFieldsValue(info2);
        }
    }, [info]) // eslint-disable-line react-hooks/exhaustive-deps

    const EditUser = (values) => {
        const callback = (res) => {
            if (res.status === 'success') {
                /// cập nhật lại
                if (json_token.role === 2) {
                    dispatch(userActions.getUserStaff({ nhan_vien_id: info.nhan_vien_id, isUpdateStorage: true }));
                    window.location.reload();
                } else if (json_token.role === 1) {
                    dispatch(userActions.getUserTeacher({ giao_vien_id: info.giao_vien_id, isUpdateStorage: true }));
                    window.location.reload();
                }
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thông tin thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Cập nhật thông tin thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('gioi_thieu', values.gioi_thieu );
        formData.append('gioi_tinh', values.gioi_tinh);
        formData.append('ho_ten', values.ho_ten);
        formData.append('sdt', values.sdt);
        formData.append('dia_chi', values.dia_chi);
        formData.append('ten_dang_nhap', info.ten_dang_nhap);
        // formData.append('mat_khau', values.mat_khau_2);
        formData.append('trang_thai', 1);
        formData.append('ngay_sinh', values.ngay_sinh);
        // if (state.ngay_sinh !== '')
        //     formData.append('ngay_sinh', state.ngay_sinh);
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        
        if (json_token.role === 2) {
            dispatch(userActions.editStaff({ nhan_vien_id: info.nhan_vien_id, formData: formData }, callback))
        } else if (json_token.role === 1) {
            dispatch(userActions.editTeacher({ giao_vien_id: info.giao_vien_id, formData: formData }, callback))
        }
    }

    const changePassword = (values) => {
        const callback = (res) => {
            if (res.status === 'success') {
                /// cập nhật lại
                if (json_token.role === 2) {
                    dispatch(userActions.getUserStaff({ nhan_vien_id: info.nhan_vien_id, isUpdateStorage: true }));
                } else if (json_token.role === 1) {
                    dispatch(userActions.getUserTeacher({ giao_vien_id: info.giao_vien_id, isUpdateStorage: true }));
                }
                notification.success({
                    message: 'Thành công',
                    description: 'Đổi mật khẩu thành công',
                });
                form2.resetFields();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Đổi mật khẩu thất bại',
                })
            }
        };

        const formData = {
            "mat_khau_cu": values.mat_khau_cu,
            "mat_khau_moi": values.mat_khau_moi
        }
        
        dispatch(userActions.changePassword(formData, callback))
    }

    return (
        <div className='content'>
            <Row>
                <Col xl={8} sm={24} xs={24} className="cate-form-block">
                    <Card bordered={false} style={{ textAlign: "center", height: "100%" }}>
                        <Avatar src={info.anh_dai_dien !== null ? config.API_URL + info.anh_dai_dien : defaultImage} size={250} shape='circle' />
                        <br/>
                        <h3 className='mt-4'>{info.ho_ten}</h3>
                        <br/>
                        {/* <Row>
                            <Col xl={12} sm={24} xs={24}>
                                <Card bordered={false} className="alert-user">
                                    <h5>0</h5>
                                    <h5>Thông báo</h5>
                                </Card>
                            </Col>
                            <Col>
                                <Card bordered={false} className="alert-user">
                                    <h5>0</h5>
                                    <h5>Thảo luận</h5>
                                </Card>
                            </Col>
                        </Row> */}
                    </Card>
                </Col>
                <Col xl={16} sm={24} xs={24} className="cate-form-block">
                    <Card bordered={false} style={{height: "100%"}}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Thông tin" key="1">
                                <Row style={{marginLeft: "15%"}}>
                                    <Col xl={12} sm={24} xs={24}>
                                        <h4 className='bold'>Họ và tên: </h4>
                                        <h5>{info.ho_ten}</h5>
                                        <br/>
                                        <h4 className='bold'>Email: </h4>
                                        <h5>{info.email}</h5>
                                        <br/>
                                        <h4 className='bold'>Giới tính: </h4>
                                        <h5>{info.gioi_tinh}</h5>
                                        <br/>
                                        <h4 className='bold'>Hoạt động đăng nhập: </h4>
                                        <span>Lần đăng đăng nhập</span>
                                        <h5>{moment(info.ngay_tao).utc(7).format(config.SHOW_DATE_FORMAT)}</h5>
                                        <h4 className='bold' style={{marginTop: '18px'}}>Giới thiệu: </h4>
                                        <h5>{info.gioi_thieu}</h5>
                                    </Col>
                                    <Col xl={12} sm={24} xs={24}>
                                        <h4 className='bold'>Ngày sinh: </h4>
                                        <h5>{ info.ngay_sinh !== null ? moment(info.ngay_sinh).utc(7).format(config.DATE_FORMAT_SHORT) : ''}</h5>
                                        <br/>
                                        <h4 className='bold'>Số điện thoại: </h4>
                                        <h5>{info.sdt}</h5>
                                        <br/>
                                        <h4 className='bold'>Vai trò:</h4>
                                        <Tag color={json_token.role === 1 ? 'green' : 'red'} key={json_token.role}>
                                            {json_token.role === 2 ? 'Nhân viên' : 'Giáo viên'}
                                        </Tag>
                                        <br/><br/>
                                        <h4 className='bold'>Địa chỉ: </h4>
                                        <h5>{info.dia_chi}</h5>
                                    </Col>                                      
                                
                                </Row>
                            </TabPane>
                            <TabPane tab="Chỉnh sửa" key="2">
                                <Row>
                                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={EditUser}>
                                            <Row gutter={25}>
                                                <Col xl={12} sm={24} xs={24} className="cate-form-block">
                                                    <Form.Item
                                                        className="input-col"
                                                        label="Họ và tên"
                                                        name="ho_ten"
                                                        >
                                                            <Input placeholder=""/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        className="input-col"
                                                        label="Giới tính"
                                                        name="gioi_tinh"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Giới tính là trường bắt buộc.',
                                                            },
                                                        ]}
                                                    >
                                                        {renderGender()}
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="email"
                                                        label="Email"
                                                        rules={[
                                                            { type: 'email', message: 'Không đúng định dạng E-mail.' },
                                                        ]}
                                                    >
                                                        <Input size="normal" placeholder='Email' />
                                                    </Form.Item>
                                                    <Form.Item className="input-col" name="dia_chi" label='Địa chỉ'>
                                                        <Input size="normal" placeholder='Địa chỉ' />
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={12} sm={24} xs={24} className="cate-form-block">
                                                    <Form.Item name="sdt" label="Số điện thoại">
                                                        <Input size="normal" type={"tel"} placeholder='Số điện thoại' />
                                                    </Form.Item>
                                                    <Form.Item name="ngay_sinh" label="Ngày sinh">
                                                        <DatePicker onChange={onChange} placeholder='Ngày sinh'/>
                                                    </Form.Item>
                                                    <Form.Item className="input-col" name="gioi_thieu" label='Giới thiệu'>
                                                        <TextArea rows={2} />
                                                    </Form.Item>
                                                    
                                                </Col>
                                            </Row>
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
                                            <Form.Item className="button-col" style={{marginBottom: 0}}>
                                                <Button shape="round" type="primary" htmlType="submit" >
                                                    Cập nhật
                                                </Button>   
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Đổi mật khẩu" key="3">
                                <Form layout="vertical" className="category-form" form={form2} autoComplete="off" onFinish={changePassword}>
                                    <Form.Item
                                        className="input-col"
                                        label="Mật khẩu cũ"
                                        name="mat_khau_cu"
                                        rules={[
                                            { required: true, message: 'Mật khẩu cũ là trường bắt buộc.'},
                                        ]}
                                    >
                                            <Input.Password placeholder="Mật khẩu cũ" />
                                    </Form.Item>
                                    <Form.Item
                                        className="input-col"
                                        label="Mật khẩu mới"
                                        name="mat_khau_moi"
                                        rules={[
                                            { required: true, message: 'Mật khẩu cũ là trường bắt buộc.'},
                                        ]}
                                    >
                                            <Input.Password placeholder="Mật khẩu mới" />
                                    </Form.Item>
                                    <Form.Item className="button-col" style={{marginBottom: 0}}>
                                        <Button shape="round" type="primary" htmlType="submit" >
                                            Cập nhật
                                        </Button>   
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    )
};

export default ProfilePage