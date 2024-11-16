import React, { useState, useEffect } from 'react';
// helper
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import moment from "moment";

// component
import { Tabs, Row, Col, Table, Form, Avatar, Tag, Space, Button, Upload, Select, message, notification, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// redux
import * as documentAction from '../../../../redux/actions/document';
import * as courseAction from '../../../../redux/actions/course';
import * as advertiseAction from '../../../../redux/actions/advertisement';
import * as userAction from '../../../../redux/actions/user';
import { useSelector, useDispatch } from "react-redux";

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Option } = Select;

const BannerCoursePage = (props) => {
    const dispatch = useDispatch();
    const [formDoc] = Form.useForm();
    const [formCourse] = Form.useForm();
    const [formTeacher] = Form.useForm();
    
    const [state, setState] = useState({
        isEditDoc: false,
        idDoc: 0,
        fileImgDoc: '',
        //
        isEditCourse: false,
        idCourse: 0,
        //
        isEditTeacher: false,
        idTeacher: 0,
        fileImgTeacher: '',
    });

    const teachers = useSelector(state => state.user.listTeacher.result);
    const loadingTeachers = useSelector(state => state.user.listTeacher.loading);
    const courses = useSelector(state => state.course.list.result);
    const loadingCourses = useSelector(state => state.course.list.loading);
    const documents = useSelector(state => state.document.listDoc.result);
    const loadingDocuments = useSelector(state => state.document.listDoc.loading);

    const DocAds = useSelector(state => state.advertise.listDoc.result);
    const dataDocAds = [];
    const CourseAds = useSelector(state => state.advertise.listCourse.result);
    const dataCourseAds = [];
    const TeacherAds = useSelector(state => state.advertise.listTeacher.result);
    const dataTeacherAds = [];

    // Biến lấy dữ liệu cho edit
    const DocEditAds = useSelector(state => state.advertise.itemDoc.result);
    const CourseEditAds = useSelector(state => state.advertise.itemCourse.result);
    const TeacherEditAds = useSelector(state => state.advertise.itemTeacher.result);

    useEffect(() => {
        dispatch(documentAction.getDocs({ status: 1, search: '', start: '', end: '', typeId: '' }));
        dispatch(advertiseAction.getAdsCourses({ status: '' }));
        dispatch(advertiseAction.getAdsDocs({ status: '' }));
        dispatch(advertiseAction.getAdsTeachers({ status: '' }));
        dispatch(courseAction.getCourses({ idkct: '', status: '', search: '' }));
        dispatch(userAction.getTeachers({ idMajor: '', status: '', startDay: '', endDay: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // props for upload image
    const propsImageDoc = {
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
            setState({ ...state, fileImgDoc: info.file.originFileObj });
        },
  
        async customRequest(options) {
            const { onSuccess } = options;
    
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
  
        onRemove(e) {
            setState({ ...state, fileImgDoc: '' });
        },
    };

    const propsImageTeacher = {
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
            setState({ ...state, fileImgTeacher: info.file.originFileObj });
        },
  
        async customRequest(options) {
            const { onSuccess } = options;
    
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
  
        onRemove(e) {
            console.log(e);
            setState({ ...state, fileImgTeacher: '' });
        },
    };

    const DocColumns = [
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
            title: 'Tên tài liệu',
            dataIndex: 'ten_tai_lieu',
            key: 'ten_tai_lieu',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hiển thị" : "Không hiển thị"}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
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
            key: 'qctl_id',
            dataIndex: 'qctl_id',
            // Redirect view for edit
            render: (qctl_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditAdsDoc(qctl_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" onClick={() => DeleteDoc(qctl_id)} type="danger"  >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const CourseColumns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hiển thị" : "Không hiển thị"}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
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
            key: 'qckh_id',
            dataIndex: 'qckh_id',
            // Redirect view for edit
            render: (qckh_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditAdsCourse(qckh_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteAdsCourse(qckh_id)}  >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const TeacherColumns = [
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
            title: 'Tên giáo viên',
            dataIndex: 'ten_giao_vien',
            key: 'ten_giao_vien',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hiển thị" : "Không hiển thị"}
                </Tag>
            ),
        },
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
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
            key: 'qcgvkh_id',
            dataIndex: 'qcgvkh_id',
            // Redirect view for edit
            render: (qcgvkh_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditAdsTeacher(qcgvkh_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteAdsTeacher(qcgvkh_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];

    if (DocAds.status === 'success') {
        DocAds.data.map((item, index) => {
            dataDocAds.push({ ...item, key: index });
            return null;
        });
    }

    if (CourseAds.status === 'success') {
        CourseAds.data.map((item, index) => {
            dataCourseAds.push({ ...item, key: index });
            return null;
        });
    }

    if (TeacherAds.status === 'success') {
        TeacherAds.data.map((item, index) => {
            dataTeacherAds.push({ ...item, key: index });
            return null;
        });
    }

    const renderDocument = () => {
        let options = [];
        if (documents.status === 'success') {
            options = documents.data.map((document) => (
            <Option key={document.tai_lieu_id} value={document.tai_lieu_id} >{document.ten_tai_lieu}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                loading={loadingDocuments}
                placeholder="Chọn tài liệu"
            >
            {options}
            </Select>
        );
    };

    const renderStatus = () => {
        return (
            <Select
              placeholder="Chọn trạng thái"
            >
              <Option value={true} >Đang hiển thị</Option>
              <Option value={false} >Không hiển thị</Option>
            </Select>
          );
    };
    
    //////////////////// Xử lý CRUD quảng cáo tài liệu
    const EditAdsDoc = (id) => {
        dispatch(advertiseAction.getAdsDoc({ id: id }))
        setState({ ...state, isEditDoc: true, idDoc: id });
        document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    };

    if (DocEditAds.status === 'success') {         
        let temp = { ...DocEditAds.data, trang_thai_id: DocEditAds.data.trang_thai };
        formDoc.setFieldsValue(temp);
    }

    const addAdsDoc = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                formDoc.resetFields();
                setState({ ...state, isEditDoc: false });
                dispatch(advertiseAction.getAdsDocs({ status: '' }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEditDoc ?  'Sửa quảng cáo tài liệu thành công' : 'Thêm quảng cáo tài liệu mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEditDoc ? 'Sửa quảng cáo tài liệu thất bại' : 'Thêm quảng cáo tài liệu mới thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('tai_lieu_id', values.tai_lieu_id);
        formData.append('trang_thai', values.trang_thai_id !== undefined ? values.trang_thai_id : true);
        // video , image
        if (state.fileImgDoc !== '')
            formData.append('anh_dai_dien', state.fileImgDoc !== undefined ? state.fileImgDoc : '');
        if (state.isEditDoc) {
            dispatch(advertiseAction.EditAdsDoc({ formData: formData, id: state.idDoc }, callback))
        } else {
            dispatch(advertiseAction.CreateAdsDoc(formData, callback));
        }
    };

    const DeleteDoc = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa quảng cáo tài liệu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(advertiseAction.getAdsDocs({ status: '' }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa quảng cáo tài liệu thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa quảng cáo tài liệu mới thất bại',
                        })
                    };
                }
                dispatch(advertiseAction.DeleteAdsDoc({ id: id }, callback))
            },
        });
    };

    const cancelEditDoc = () => {
        setState({ ...state, isEditDoc: false })
        formDoc.resetFields();
    };

    //////////////////// Xử lý CRUD quảng cáo khóa học
    const renderCourse = () => {
        let options = [];
        if (courses.status === 'success') {
            options = courses.data.filter((course) => course.loai_kct === 2).map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                loading={loadingCourses}
                placeholder="Chọn khóa học"
            >
                {options}
            </Select>
        );
    };

    const EditAdsCourse = (id) => {
        dispatch(advertiseAction.getAdsCourse({ id: id }))
        setState({ ...state, isEditCourse: true, idCourse: id });
    }

    useEffect(() => {
        if (CourseEditAds.status === 'success') {         
            let temp = { ...CourseEditAds.data, trang_thai_id2: CourseEditAds.data.trang_thai };
            formCourse.setFieldsValue(temp);
        }
    }, [CourseEditAds]);  // eslint-disable-line react-hooks/exhaustive-deps

    const addAdsCourse = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                formCourse.resetFields();
                setState({ ...state, isEditCourse: false });
                dispatch(advertiseAction.getAdsCourses({ status: '' }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEditCourse ?  'Sửa quảng cáo khóa học thành công' : 'Thêm quảng cáo khóa học mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEditCourse ? 'Sửa quảng cáo khóa học thất bại' : 'Thêm quảng cáo khóa học mới thất bại',
                })
            }
        };

        let data = {
            "khoa_hoc_id": values.khoa_hoc_id,
            "trang_thai": values.trang_thai_id2 ? 1: 0,
            "mo_ta": ''
        }
        if (state.isEditCourse) {
            dispatch(advertiseAction.EditAdsCourse({ formData: data, id: state.idCourse }, callback))
        } else {
            dispatch(advertiseAction.CreateAdsCourse(data, callback));
        }
    }

    const DeleteAdsCourse = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa quảng cáo khóa học này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(advertiseAction.getAdsCourses({ status: '' }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa quảng cáo khóa học thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa quảng cáo khóa học mới thất bại',
                        })
                    };
                }
                dispatch(advertiseAction.DeleteAdsCourse({ id: id }, callback))
            },
        });
    };
    
    const cancelEditCourse = () => {
        setState({ ...state, isEditCourse: false })
        formCourse.resetFields();
    }
    //////////////////// Xử lý CRUD quảng cáo giáo viên
    const renderTeacher = () => {
        let options = [];
        if (teachers.status === 'success') {
            options = teachers.data.map((teacher) => (
            <Option key={teacher.giao_vien_id} value={teacher.giao_vien_id} >{teacher.ho_ten}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                loading={loadingTeachers}
                placeholder="Chọn giáo viên"
            >
            {options}
            </Select>
        );
    };

    const EditAdsTeacher = (id) => {
        dispatch(advertiseAction.getAdsTeacher({ id: id }))
        setState({ ...state, isEditTeacher: true, idTeacher: id });
    }

    useEffect(() => {
        if (TeacherEditAds.status === 'success') {         
            let temp = { ...TeacherEditAds.data, trang_thai_id3: TeacherEditAds.data.trang_thai, khoa_hoc_id2: TeacherEditAds.data.khoa_hoc_id };
            formTeacher.setFieldsValue(temp);
        }
    }, [TeacherEditAds]);  // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEditTeacher = () => {
        setState({ ...state, isEditTeacher: false })
        formTeacher.resetFields();
    }

    const addAdsTeacher = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                formTeacher.resetFields();
                setState({ ...state, isEditTeacher: false });
                dispatch(advertiseAction.getAdsTeachers({ status: '' }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEditTeacher ?  'Sửa quảng cáo giáo viên thành công' : 'Thêm quảng cáo giáo viên mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEditTeacher ? 'Sửa quảng cáo giáo viên thất bại' : 'Thêm quảng cáo giáo viên mới thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('giao_vien_id', values.giao_vien_id);
        formData.append('khoa_hoc_id', values.khoa_hoc_id2);
        formData.append('trang_thai', values.trang_thai_id3 !== undefined ? values.trang_thai_id3 : true);
        // video , image
        if (state.fileImgTeacher !== '')
            formData.append('anh_dai_dien', state.fileImgTeacher !== undefined ? state.fileImgTeacher : '');
        if (state.isEditTeacher) {
            dispatch(advertiseAction.EditAdsTeacher({ formData: formData, id: state.idTeacher }, callback))
        } else {
            dispatch(advertiseAction.CreateAdsTeacher(formData, callback));
        }
    };

    const DeleteAdsTeacher = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa quảng cáo giáo viên này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(advertiseAction.getAdsTeachers({ status: '' }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa quảng cáo giáo viên thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa quảng cáo giáo viên mới thất bại',
                        })
                    };
                }
                dispatch(advertiseAction.DeleteAdsTeacher({ id: id }, callback))
            },
        });
    };

    // const propsImage = {
    //     name: 'file',
    //     action: '#',
  
    //     beforeUpload: file => {
    //         const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
    //         if (!isPNG) {
    //                 message.error(`${file.name} có định dạng không phải là png/jpg`);
    //         }
    //         return isPNG || Upload.LIST_IGNORE;
    //     },
  
    //     onChange(info) {
    //         setState({ ...state, fileImg: info.file.originFileObj });
    //     },
  
    //     async customRequest(options) {
    //         const { onSuccess } = options;
        
    //         setTimeout(() => {
    //             onSuccess("ok");
    //         }, 0);
    //     },
  
    //     onRemove(e) {
    //         setState({ ...state, fileImg: '' });
    //     },
    // };

    return (
        <div className='content'>
            <br/>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Tài liệu" key="1">
                    {dataDocAds.length > 0 && 
                        <Table className="table-striped-rows" columns={DocColumns} dataSource={dataDocAds}></Table>
                    }
                    <Row>
                        <Col xl={24} sm={24} xs={24} className="cate-form-block">
                            {(state.isEditDoc && DocEditAds.status === 'success' && DocEditAds) 
                            ? 
                                <h5>Sửa thông tin quảng cáo tài liệu</h5> 
                            : 
                                <h5>Thêm mới quảng cáo tài liệu</h5>
                            }  
                            <Form layout="vertical" className="category-form" form={formDoc} autoComplete="off" onFinish={addAdsDoc}>
                                <Form.Item
                                    className="input-col"
                                    label="Tài liệu"
                                    name="tai_lieu_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tài liệu là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderDocument()}
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Trạng thái"
                                    name="trang_thai_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trạng thái là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderStatus()}
                                </Form.Item>
                                <Form.Item className="input-col" label="Hình đại diện" name="anh_dai_dien" rules={[]}>
                                    <Dragger {...propsImageDoc} maxCount={1}
                                        listType="picture"
                                        className="upload-list-inline"
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <UploadOutlined />
                                        </p>
                                        <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                    </Dragger>
                                </Form.Item>
                                <Form.Item className="button-col">
                                    <Space>
                                        <Button shape="round" type="primary" htmlType="submit" >
                                            {(state.isEditDoc && DocEditAds.status === 'success' && DocEditAds) ? 'Cập nhật' : 'Thêm mới'}   
                                        </Button>
                                        {(state.isEditDoc && DocEditAds.status === 'success' && DocEditAds) 
                                        ?  <Button shape="round" type="danger" onClick={() => cancelEditDoc()} > 
                                            Hủy bỏ
                                        </Button>
                                        : ''}    
                                    </Space>    
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Khóa học" key="2">
                    {dataCourseAds.length > 0 && 
                        <Table className="table-striped-rows" columns={CourseColumns} dataSource={dataCourseAds}></Table>
                    }
                    <Row>
                        <Col xl={24} sm={24} xs={24} className="cate-form-block">
                            {(state.isEditCourse && CourseEditAds.status === 'success' && CourseEditAds) 
                            ? 
                                <h5>Sửa thông tin quảng cáo khóa học</h5> 
                            : 
                                <h5>Thêm mới quảng cáo khóa học</h5>
                            }  
                            <Form layout="vertical" className="category-form" form={formCourse} autoComplete="off" onFinish={addAdsCourse}>
                                <Form.Item
                                    className="input-col"
                                    label="Khóa học"
                                    name="khoa_hoc_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Khóa học là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderCourse()}
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Trạng thái"
                                    name="trang_thai_id2"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trạng thái là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderStatus()}
                                </Form.Item>
                                <Form.Item className="button-col">
                                    <Space>
                                        <Button shape="round" type="primary" htmlType="submit" >
                                        {(state.isEditCourse && CourseEditAds.status === 'success' && CourseEditAds) ? 'Cập nhật' : 'Thêm mới'}   
                                        </Button>
                                        {(state.isEditCourse && CourseEditAds.status === 'success' && CourseEditAds) 
                                        ?  <Button shape="round" type="danger" onClick={() => cancelEditCourse()} > 
                                            Hủy bỏ
                                        </Button>
                                        : ''}    
                                    </Space>    
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Giáo viên" key="3">
                    {dataTeacherAds.length > 0 && 
                        <Table className="table-striped-rows" columns={TeacherColumns} dataSource={dataTeacherAds}></Table>
                    }
                    <Row>
                        <Col xl={24} sm={24} xs={24} className="cate-form-block">
                            {(state.isEditTeacher && TeacherEditAds.status === 'success' && TeacherEditAds) 
                            ? 
                                <h5>Sửa thông tin quảng cáo giáo viên</h5> 
                            : 
                                <h5>Thêm mới quảng cáo giáo viên</h5>
                            }  
                            <Form layout="vertical" className="category-form" form={formTeacher} autoComplete="off" onFinish={addAdsTeacher}>
                                <Form.Item
                                    className="input-col"
                                    label="Khóa học"
                                    name="khoa_hoc_id2"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Khóa học là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderCourse()}
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Giáo viên"
                                    name="giao_vien_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Giáo viên là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderTeacher()}
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Trạng thái"
                                    name="trang_thai_id3"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trạng thái là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderStatus()}
                                </Form.Item>
                                <Form.Item className="input-col" label="Hình đại diện" name="anh_dai_dien2" rules={[]}>
                                    <Dragger {...propsImageTeacher} maxCount={1}
                                        listType="picture"
                                        className="upload-list-inline"
                                    >
                                        <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                        </p>
                                        <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                    </Dragger>
                                </Form.Item>
                                <Form.Item className="button-col">
                                    <Space>
                                        <Button shape="round" type="primary" htmlType="submit" >
                                        {(state.isEditTeacher && TeacherEditAds.status === 'success' && TeacherEditAds) ? 'Cập nhật' : 'Thêm mới'}   
                                        </Button>
                                        {(state.isEditTeacher && TeacherEditAds.status === 'success' && TeacherEditAds) 
                                        ?  <Button shape="round" type="danger" onClick={() => cancelEditTeacher()} > 
                                            Hủy bỏ
                                        </Button>
                                        : ''}    
                                    </Space>    
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default BannerCoursePage;