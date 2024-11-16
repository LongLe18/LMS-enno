import React, { useState, useEffect } from 'react';

// helper
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import moment from "moment";

// component
import { Table, Tag, Button, Row, Col, notification, Space, Avatar, Form, 
    Input, Upload, message, Select, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AppFilter from "components/common/AppFilter";
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import * as documentAction from '../../../../redux/actions/document';
import { useSelector, useDispatch } from "react-redux";

const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;

const DocumentPage = (props) => {
    const data = [];
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const documents = useSelector(state => state.document.listDoc.result);
    const document = useSelector(state => state.document.itemDoc.result);
    const loadingDocument = useSelector(state => state.document.itemDoc.loading);

    const [state, setState] = useState({
        idDocument: 1,
        fileImg: '',
        isEdit: false,
        documentData: {},
    })

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
                    {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
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
            key: 'tai_lieu_id',
            dataIndex: 'tai_lieu_id',
            // Redirect view for edit
            render: (tai_lieu_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditDocument(tai_lieu_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" onClick={() => DeleteDocument(tai_lieu_id)} type="danger"  >Xóa</Button> 
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

    const [filter, setFilter] = useState({
        trang_thai: 2,
        search: '',
        typeId: '',
        start: '',
        end: '',
    });

    useEffect(() => {
        dispatch(documentAction.getDocs({ status: '', search: filter.search, start: filter.start, 
            end: filter.end, typeId: filter.typeId }, (res) => {
                form.resetFields();
            }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (documents.status === 'success') {
        documents.data.map((item, index) => { data.push({...item, 'key': index}); return null; });
    };

    const renderStatus = () => {
        return (
          <Select
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
        dispatch(documentAction.getDocs({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
          start: filter.start, end: filter.end, typeId: filter.typeId }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const EditDocument = (id) => {
        dispatch(documentAction.getDoc({ id: id }));
        setState({ ...state, isEdit: true, idDocument: id });
        window.document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    }

    const DeleteDocument = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tài liệu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(documentAction.getDocs({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
                            start: filter.start, end: filter.end, typeId: filter.typeId }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tài liệu thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tài liệu mới thất bại',
                        })
                    };
                }
                dispatch(documentAction.DeleteDoc({ id: id }, callback))
            },
        });
    };
    
    useEffect(() => {
        if (document.status === 'success') {          
            form.setFieldsValue(document.data);
        }
    }, [document]);  // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const createDocument = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
              form.resetFields();
              setState({ ...state, isEdit: false });
              dispatch(documentAction.getDocs({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, search: filter.search,
                start: filter.start, end: filter.end, typeId: filter.typeId }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ?  'Sửa tài liệu thành công' : 'Thêm tài liệu mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Sửa tài liệu thất bại' : 'Thêm tài liệu mới thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('ten_tai_lieu', values.ten_tai_lieu);
        formData.append('mo_ta', values.mo_ta ? values.mo_ta : '');
        formData.append('trang_thai', (values.trang_thai !== null || values.trang_thai !== undefined)  ? values.trang_thai : true);
        // video , image
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        if (state.isEdit) {
            dispatch(documentAction.EditDoc({ formData: formData, id: state.idDocument }, callback))
        } else {
            dispatch(documentAction.CreateDoc(formData, callback));
        }
    };

    return (
        <div className='content'>
            <Row className="app-main">
                <Col xl={24} className="body-content">
                    <Row>
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Danh sách tài liệu"
                                isShowCourse={false}
                                isShowModule={false}
                                isShowThematic={false}
                                isShowStatus={true}
                                isShowSearchBox={true}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                                courses={data.data}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {data.length > 0 && 
                <Table className="table-striped-rows" columns={columns} dataSource={data} />
            }
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loadingDocument && <LoadingCustom/>}   
                    {(state.isEdit && document.status === 'success' && document) 
                        ? 
                        <h5>Sửa thông tin tài liệu</h5> 
                        : 
                        <h5>Thêm mới tài liệu</h5>
                    }  
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createDocument}>
                        <Form.Item
                            className="input-col"
                            label="Tên tài liệu"
                            name="ten_tai_lieu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên tài liệu là trường bắt buộc.',
                                },
                            ]}
                            >
                                <Input placeholder="Nhập tên tài liệu"/>
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Mô tả"
                            name="mo_ta"
                            rules={[]}
                            >
                                <TextArea placeholder="Nhập mô tả"/>
                        </Form.Item>
                        <Form.Item className="input-col" label="Trạng thái" name="trang_thai" rules={[]} initialValue={true}>
                            {renderStatus()}
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
                        <Form.Item className="button-col">
                            <Space>
                                <Button shape="round" type="primary" htmlType="submit" >
                                {(state.isEdit && document.status === 'success' && document) ? 'Cập nhật' : 'Thêm mới'}   
                                </Button>
                                {(state.isEdit && document.status === 'success' && document) 
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

export default DocumentPage;