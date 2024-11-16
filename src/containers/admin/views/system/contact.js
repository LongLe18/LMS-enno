import React, { useEffect, useState } from 'react';

// helper
import config from '../../../../configs/index';
import moment from "moment";

// components
import { Table, Button, Row, Col, notification, Space, Form, Input, Modal } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import * as contactAction from '../../../../redux/actions/contact';
import { useSelector, useDispatch } from "react-redux";

const ContactPage = (props) => {
    let data = [];
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const contact = useSelector(state => state.contact.item.result);
    const contacts = useSelector(state => state.contact.list.result);
    const loadingContact = useSelector(state => state.contact.item.loading);

    const [state, setState] = useState({
        idContact: 1,
        isEdit: false,
    })

    useEffect(() => {
        dispatch(contactAction.getCONTACTs());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    if (contacts.status === 'success') {
        data = contacts.data.map((item, index) => ({...item, key: index}));
        form.resetFields();
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên liên hệ',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            responsive: ['md'],
        },
        {
            title: 'Link liên kết',
            dataIndex: 'link_lien_ket',
            key: 'link_lien_ket',
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
            key: 'lien_he_id',
            dataIndex: 'lien_he_id',
            // Redirect view for edit
            render: (lien_he_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditContact(lien_he_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button  type="button" onClick={() => DeleteContact(lien_he_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
                </Space>
            ),
        },
    ];

    const onSubmitForm = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                dispatch(contactAction.getCONTACTs());
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm thông tin liên hệ thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm thông tin liên hệ thất bại',
                })
            }
        };

        const data = {
            mo_ta: values.mo_ta.toUpperCase(),
            link_lien_ket: values.link_lien_ket
        };

        if (state.isEdit) {
            dispatch(contactAction.EditCONTACT({ formData: data, id: state.idContact }, callback))
        } else {
            dispatch(contactAction.CreateCONTACT(data, callback));
        }
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const EditContact = (id) => {
        dispatch(contactAction.getCONTACT({ id: id }));
        setState({ ...state, isEdit: true, idContact: id });
        document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    };

    useEffect(() => {
        if (contact.status === 'success') {        
            form.setFieldsValue(contact.data);
        }
    }, [contact]);  // eslint-disable-line react-hooks/exhaustive-deps
    
    const DeleteContact = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa thông tin này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(contactAction.getCONTACTs());
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa thông tin thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa thông tin thất bại',
                        })
                    };
                }
                dispatch(contactAction.DeleteCONTACT({ id: id }, callback))
            },
        });
    };

    return (
        <>
            <div className="content">
                <br/>
                <h5>Quản lý liên hệ</h5>
                {contacts.status === 'success' && 
                    <Table className="table-striped-rows" columns={columns} dataSource={data} />
                }
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loadingContact && <LoadingCustom/>}   
                    {(state.isEdit && contact.status === 'success' && contact) ? <h5>Sửa thông tin footer</h5> : <h5>Thêm mới footer</h5>}  
                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={onSubmitForm}>
                            <Form.Item
                                className="input-col"
                                label="Tên liên hệ"
                                name="mo_ta"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Tên liên hệ là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <Input placeholder="Nhập tên liên hệ"/>
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Link liên kết"
                                name="link_lien_ket"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nội dung là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <Input placeholder='Nhập link liên kết'/>
                            </Form.Item>
                            <Form.Item className="button-col">
                                <Space>
                                    <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && contact.status === 'success' && contact) ? 'Cập nhật' : 'Thêm mới'}   
                                    </Button>
                                    {(state.isEdit && contact.status === 'success' && contact) 
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
        </>
    )
};

export default ContactPage;