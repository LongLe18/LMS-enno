import React, { useEffect, useState } from "react";
import './css/content.css';

// helper
import config from '../../../../configs/index';
import moment from 'moment';
import defaultImage from 'assets/img/default.jpg';
import { diff } from "helpers/common.helper";
import Hashids from "hashids";

// components
import { Row, Col, Tag, Space, Button, Table, Tabs, Avatar, Form, 
    Upload, message, notification, Dropdown, Menu, Modal, } from 'antd';
import AppFilter from "components/common/AppFilter";
import TextEditorWidget2 from "components/common/TextEditor/TextEditor2";
import { UploadOutlined, DashOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

// redux
import * as commentAction from '../../../../redux/actions/comment';
import * as courseAction from '../../../../redux/actions/course';
import * as notificationAction from '../../../../redux/actions/notification';
import { useSelector, useDispatch } from "react-redux";

const { TabPane } = Tabs;
const { Dragger } = Upload;

const ReplyPage = (props) => {
    // Không có chức năng chuyển tiếp
    const hashids = new Hashids();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const comments = useSelector(state => state.comment.list.result);
    const comment = useSelector(state => state.comment.item.result);
    const subcomments = useSelector(state => state.comment.listSub.result);
    const courses = useSelector(state => state.course.list.result);

    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
        mo_dun_id: '',
        trang_thai: '',
    });
    const [state, setState] = useState({
        comment: '',
        activeTab: "1",
        idComment: 0,
        idSubComment: 0,
        fileImg: '',
        isEdit: false,
    });

    useEffect(() => {
        dispatch(commentAction.getCOMMENTs({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, type: filter.trang_thai }));
        dispatch(courseAction.filterCourses({ status: '', search: '', start: '', end: '', pageSize: 10000000, pageIndex: 1 }));
        if (window.location.href.split('=').length > 1) {
            detailComment(window.location.href.split('=')[1]);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (comments.status === 'success') {
        let temp = comments.data.filter((item => item.phu_trach_id === JSON.parse(localStorage.getItem('userInfo')).giao_vien_id))
        state.comment = temp.map((comment, index) => ({...comment, key: index}))
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nội dung',
            dataIndex: 'noi_dung',
            key: 'noi_dung',
            responsive: ['md'],
            render: (noi_dung)  => (
                <div dangerouslySetInnerHTML={{ __html: noi_dung }}></div>
            )
        },
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Mô-đun',
            dataIndex: 'ten_mo_dun',
            key: 'ten_mo_dun',
            responsive: ['md'],
        },
        {
            title: 'Loại hỏi đáp',
            dataIndex: 'loai_hoi_dap',
            key: 'loai_hoi_dap',
            responsive: ['md'],
            render: (type) => (
              <span>{type === 0 ? 'Chuyên đề' : 'Đề thi'}</span>
            )
        },
        {
            title: 'Giáo viên phụ trách',
            dataIndex: 'ten_giao_vien',
            key: 'ten_giao_vien',
            responsive: ['md'],
            render: (name) => (
                <span>{name !== null ? name : ''}</span>
            )
        },
        {
            title: 'Ngày hỏi',
            dataIndex: 'ngay_tao',
            key: 'ngay_tao',
            responsive: ['md'],
            render: (date) => (
              moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'tra_loi',
            key: 'tra_loi',
            responsive: ['md'],
            render: (tra_loi) => (
                <Tag color={tra_loi === 0 ? 'green' : 'red'} key={tra_loi}>
                    {tra_loi === 0 ? "Chưa trả lời" : "Đã trả lời"}
                </Tag>
            ),
        },
        {
            title: 'Tùy chọn',
            key: 'binh_luan_id',
            dataIndex: 'binh_luan_id',
            // Redirect view for edit
            render: (binh_luan_id) => (
                <Space size="middle">
                    <Button shape="round" onClick={() => detailComment(binh_luan_id)} type="primary" >Chi tiết</Button> 
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
            return isPNG || Upload.LIST_IGNORE;
        },
  
        onChange(info) {
            setState({ ...state, fileImg: info.fileList });
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
        dispatch(commentAction.getCOMMENTs({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, type: filter.trang_thai }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };

    const detailComment = (id) => {
        setState({...state, activeTab: "2", idComment: id });
        dispatch(commentAction.getCOMMENT({ id: id })); // Lấy bình luận theo id
        dispatch(commentAction.getSUBCCOMMENTs({ idComment: id }));
    };
    
    const submitComment = (values) => {
        const callback = (res) => {
            if (res.data.status === 'success' && res.statusText === 'OK') {
                notification.success({
                    message: 'Thành công',
                    description: !state.isEdit ? 'Thêm bình luận thành công' : 'Sửa bình luận thành công',
                });
                /// Tạo thông báo cho sinh viên
                if (!state.isEdit) {
                    const note = {
                        "loai_thong_bao": 1,
                        "lien_ket_id": res.data.data.binh_luan_phu_id,
                        //// bổ sung link_lien_ket
                        "link_lien_ket": comment.data.loai_hoi_dap === 0 ? 
                            `/${hashids.encode(comment.data.mo_dun_id)}/${hashids.encode(comment.data.khoa_hoc_id)}` :
                            comment.data.lien_ket_id.split('/')[4] === '1' ?
                            `${comment.data.lien_ket_id.split('/')[2]}/${comment.data.mo_dun_id}/${comment.data.khoa_hoc_id}/${comment.data.lien_ket_id.split('/')[0]}/${comment.data.lien_ket_id.split('/')[3]}/${state.idComment}`
                            : comment.data.lien_ket_id.split('/')[4] === '2' ?
                            `${comment.data.mo_dun_id}/${comment.data.khoa_hoc_id}/${comment.data.lien_ket_id.split('/')[0]}/${comment.data.lien_ket_id.split('/')[3]}/${state.idComment}`
                            : `${comment.data.khoa_hoc_id}/${comment.data.lien_ket_id.split('/')[0]}/${comment.data.lien_ket_id.split('/')[3]}/${state.idComment}`
                    };
                    dispatch(notificationAction.CreateNOTIFICATION({ formData: note, 
                        idModule: comment.data.mo_dun_id !== null ? comment.data.mo_dun_id : '',
                        type: comment.data.loai_hoi_dap, idCourse: comment.data.khoa_hoc_id,
                        idThematic: comment.data.loai_hoi_dap === 0 ? comment.data.lien_ket_id : '', 
                        idExam: comment.data.loai_hoi_dap === 1 ? comment.data.lien_ket_id.split('/')[0] : '', 
                        index: comment.data.loai_hoi_dap === 1 ? comment.data.lien_ket_id.split('/')[1] : '', 
                        Teacher: comment.data.hoc_vien_id !== null ? comment.data.hoc_vien_id : '' }));
                }
                // cập nhật trạng thái bình luận
                const editdata = {tra_loi: 1}
                dispatch(commentAction.EditCOMMENT({ formData: editdata, idComment: state.idComment }, (res) => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        dispatch(commentAction.getCOMMENTs({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, type: filter.trang_thai }));
                        dispatch(commentAction.getSUBCCOMMENTs({ idComment: state.idComment }));
                        setState({...state, activeTab: "1", fileImg: '' });
                        form.resetFields();
                    } 
                }));

            } else {
                notification.error({
                    message: 'Thông báo',
                    description: !state.isEdit ? 'Thêm bình luận thất bại' : 'Sửa bình luận thất bại',
                })
            }
        };
        
        const formData = new FormData();
        formData.append('noi_dung', values.nhan_xet)
        if (state.fileImg !== '') {
            formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
        }
        if (state.isEdit) { // sửa
            dispatch(commentAction.EditSUBCCOMMENT({ formData: formData, idSubComment: state.idSubComment }, callback));
        } else { // Thêm
            formData.append('binh_luan_id', state.idComment);
            dispatch(commentAction.CreateSUBCCOMMENT(formData, callback));
        }
    };

    const deleteComment = (binh_luan_phu_id) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                dispatch(commentAction.getSUBCCOMMENTs({ idComment: state.idComment }));

                notification.success({
                    message: 'Thành công',
                    description: 'Xóa bình luận thành công',
                });
                // Xóa thông báo
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Xóa bình luận mới thất bại',
                })
            };
        }

        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa bình luận này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                dispatch(commentAction.DeleteSUBCCOMMENT({ idComment: binh_luan_phu_id }, callback));
            },
        });
    };

    const editComment = (binh_luan_phu_id) => {
        setState({ ...state, idSubComment: binh_luan_phu_id, isEdit: true });
        dispatch(commentAction.getSUBCOMMENT({ id: binh_luan_phu_id }, (res) => {
            if (res.status === 'success') {
                if (res.data) form.setFieldsValue({ nhan_xet: res.data.noi_dung });
            }
        }))
    };

    const cancelEdit = () => {
        setState({ ...state, idSubComment: 0, isEdit: false });
        form.resetFields();
    };

    return (
        <>
            <div className="content">
                <Row className="app-main">
                    <Col xl={24} className="body-content">
                        <Row>
                            <Col xl={24} sm={24} xs={24}>
                                <AppFilter
                                    title="Hỏi đáp"
                                    isShowCourse={true}
                                    isShowModule={true}
                                    isShowStatus={true}
                                    courses={courses.data}
                                    onFilterChange={(field, value) => onFilterChange(field, value)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Hỏi đáp" key="1">
                        {state.comment !== '' &&
                            <Table className="table-striped-rows" columns={columns} dataSource={state.comment} />
                        }
                    </TabPane>
                    <TabPane tab="Chi tiết hỏi đáp" disabled key="2">
                        {(comment.status === 'success' && subcomments.status === 'success') && 
                        <div className='tab-panels'>
                            {/* Show comment */}
                            <ul>
                                {/* Main comment */}
                                <li>
                                    <Row className="comment">
                                        <Col xs={4} sm={1} className="avatar-user">
                                            <Row style={{height: '100%', flexDirection: 'column'}}>
                                                <Avatar size={"large"} src={comment.data.anh_dai_dien !== null ? config.API_URL + comment.data.anh_dai_dien : defaultImage} />
                                            </Row>
                                        </Col>
                                        <Col xs={20} sm={8} className="content-user">
                                            <span className="name-user">{comment.data.ho_ten}</span>
                                            <div className="content-comment">
                                                <div dangerouslySetInnerHTML={{ __html: comment.data.noi_dung }}></div><br/>
                                                {comment.data.anh_dinh_kem !== null && <img src={config.API_URL + comment.data.anh_dinh_kem} alt="ảnh bình luận"/>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <ul>
                                        <Row>
                                            <Col xs={4} sm={1} ></Col>
                                            <Col xs={20} sm={8}>
                                                <Row>
                                                    {/* <li><Button style={{margin: 0, fontSize: '12px'}} type="link" onClick={() => replyComment(comment.data.binh_luan_id)}>Phản hồi</Button></li> */}
                                                    <li><Button style={{margin: 0, fontSize: '12px'}} type="link">{diff(comment.data.ngay_sua)}</Button></li>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ul>
                                </li>
                                {/* Sub Comment */}
                                <div id={comment.data.binh_luan_id}>

                                    {subcomments.data.map((item, index) => (
                                        <li className='ml-10' key={index}>
                                            <Row className="comment">
                                                <Col xs={4} sm={1} className="avatar-user">
                                                    <Row style={{height: '100%', flexDirection: 'column'}}>
                                                        <Avatar size={"large"}  src={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage}/>
                                                    </Row>
                                                </Col>
                                                <Col xs={20} sm={8} className="content-user">
                                                    <span className="name-user">{item.ho_ten}</span>
                                                    <div className="content-comment">
                                                        <div dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div><br/>
                                                        {item.anh_dinh_kem !== null && <img src={config.API_URL + item.anh_dinh_kem} alt="ảnh bình luận"/>}
                                                    </div>
                                                </Col>
                                                {(item.nguoi_tra_loi_id === JSON.parse(localStorage.getItem('userInfo')).giao_vien_id && item.loai_quyen === 1) && 
                                                <Col className="ml-3">
                                                    <Dropdown overlay={
                                                        <Menu
                                                            items={[
                                                                {
                                                                    label: <Button type="link" onClick={() => editComment(item.binh_luan_phu_id)} size='large' style={{width: '100%'}}>Chỉnh sửa</Button>,
                                                                    key: '0',
                                                                },
                                                                {
                                                                    label: <Button type="link" size='large' style={{width: '100%'}} onClick={() => deleteComment(item.binh_luan_phu_id)}>Xóa</Button>,
                                                                    key: '1',
                                                                },
                                                            ]}
                                                        />
                                                    } 
                                                    trigger={['click']}>
                                                        <a href="#/" onClick={(e) => e.preventDefault()}>
                                                            <Space>
                                                                <DashOutlined />
                                                            </Space>
                                                        </a>
                                                    </Dropdown>
                                                </Col>
                                                }
                                            </Row>
                                            <ul>
                                                <Row>
                                                    <Col xs={4} sm={1} ></Col>
                                                    <Col xs={20} sm={8}>
                                                        <Row>
                                                            <li><Button style={{margin: 0, fontSize: '12px'}} type="link">{diff(item.ngay_sua)}</Button></li>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </ul>
                                        </li>             
                                        ))  
                                    }                                                                 
                                </div>
                            </ul>
                            <br/>
                            <Row id='review' className='woocommerce-Reviews'>
                                <Col span={24}>
                                    <div className='col-inner' id='review_form'>
                                        <div className='review-form-inner has-border'>
                                            <div id='response' className='comment-respond'>
                                                <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={submitComment}>
                                                    <Form.Item 
                                                        className="input-col"
                                                        label="Nhận xét của bạn *"
                                                        name="nhan_xet"
                                                        rules={[
                                                            {
                                                            required: true,
                                                            message: 'Nhận xét là trường bắt buộc.',
                                                            },
                                                        ]}
                                                        >
                                                            <TextEditorWidget2
                                                                placeholder="Bình luận bài giảng"
                                                                showToolbar={true}
                                                                isMinHeight200={true}
                                                                isSimple={false}
                                                            />
                                                    </Form.Item>

                                                    <Form.Item className="input-col" label="Hình ảnh" name="hinh_anh" rules={[]}>
                                                        <Dragger {...propsImage} maxCount={1}
                                                            listType="picture"
                                                            className="upload-list-inline"
                                                        >
                                                            <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                                            <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                                        </Dragger>
                                                    </Form.Item>
                                                    <Form.Item className="button-col" htmlType="submit">
                                                        {state.isEdit === false ?
                                                            <Button type="primary" htmlType="submit">BÌNH LUẬN</Button>
                                                            :
                                                            <Space>
                                                                <Button type="primary"htmlType="submit" size='large'>GỬI ĐI</Button>  
                                                                <Button type="primary" danger onClick={() => cancelEdit()} size='large'>HỦY</Button>  
                                                            </Space>
                                                        }
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        }
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
};

export default ReplyPage;