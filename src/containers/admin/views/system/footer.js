import React, { useEffect, useState } from 'react';
// component
import Footer from 'components/parts/Footers/Footer';

// helper
import config from '../../../../configs/index';
import moment from "moment";
import { cutString } from 'helpers/common.helper';
// components
import { Table, Button, Row, Col, notification, Space, Form, Input, Modal, } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import LoadingCustom from 'components/parts/loading/Loading';
import TextEditorWidget2 from 'components/common/TextEditor/TextEditor2';

// redux
import * as footerAction from '../../../../redux/actions/footer';
import { useSelector, useDispatch } from "react-redux";

//  Chú ý khi tạo: 
//      Cột thứ 3 luôn là fanpage: noi_dung là link của fanpage

const FooterPage = (props) => {
    let data = [];
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const footer = useSelector(state => state.footer.item.result);
    const footers = useSelector(state => state.footer.list.result);
    const loadingFooter = useSelector(state => state.footer.item.loading);

    const [state, setState] = useState({
        idFooter: 1,
        isEdit: false,
    })

    useEffect(() => {
        dispatch(footerAction.getFOOTERs());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (footers.status === 'success') {
        data = footers.data.map((item, index) => ({...item, key: index}));
        form.resetFields();
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên footer',
            dataIndex: 'ten_footer',
            key: 'ten_footer',
            responsive: ['md'],
        },
        {
            title: 'Nội dung',
            dataIndex: 'noi_dung',
            key: 'noi_dung',
            responsive: ['md'],
            render: (noi_dung) => (
                cutString(noi_dung, 20) + ' ...'
            )
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
            key: 'footer_id',
            dataIndex: 'footer_id',
            // Redirect view for edit
            render: (footer_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditFooter(footer_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button  type="button" onClick={() => DeleteFooter(footer_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
                </Space>
            ),
        },
    ];

    const onSubmitForm = (values) => {
        const callback = (res) => {
            console.log(res);
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                dispatch(footerAction.getFOOTERs());
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm thông tin thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm thông tin thất bại',
                })
            }
        };

        const data = {
            ten_footer: values.ten_footer,
            noi_dung: values.noi_dung
        };

        if (state.isEdit) {
            dispatch(footerAction.EditFOOTER({ formData: data, id: state.idFooter }, callback))
        } else {
            dispatch(footerAction.CreateFOOTER(data, callback));
        }
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
        document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    };

    const EditFooter = (id) => {
        dispatch(footerAction.getFOOTER({ id: id }));
        setState({ ...state, isEdit: true, idFooter: id });
        let body = document.getElementsByClassName('cate-form-block')[0];
        body.scrollIntoView();
    };

    useEffect(() => {
        if (footer.status === 'success') {        
            form.setFieldsValue(footer.data);
        }
    }, [footer]);  // eslint-disable-line react-hooks/exhaustive-deps
    
    const DeleteFooter = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa thông tin này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(footerAction.getFOOTERs());
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
                dispatch(footerAction.DeleteFOOTER({ id: id }, callback))
            },
        });
    };
    
    return (
        <>
            <div className="content">
                <br/>
                <h5>Quản lý Footer trang chủ</h5>
                {footers.status === 'success' && 
                    <Table className="table-striped-rows" columns={columns} dataSource={data} />
                }
                <Footer />
                <br/>
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loadingFooter && <LoadingCustom/>}   
                    {(state.isEdit && footer.status === 'success' && footer) ? <h5>Sửa thông tin footer</h5> : <h5>Thêm mới footer</h5>}  
                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={onSubmitForm}>
                            <Form.Item
                                className="input-col"
                                label="Tên footer"
                                name="ten_footer"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Tên footer là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <Input placeholder="Nhập tên cột"/>
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Nội dung"
                                name="noi_dung"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nội dung là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <TextEditorWidget2
                                        placeholder="Nội dung footer"
                                        showToolbar={true}
                                        isMinHeight200={true}
                                        isSimple={false}
                                    />
                            </Form.Item>
                            <Form.Item className="button-col">
                                <Space>
                                    <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && footer.status === 'success' && footer) ? 'Cập nhật' : 'Thêm mới'}   
                                    </Button>
                                    {(state.isEdit && footer.status === 'success' && footer) 
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

export default FooterPage;