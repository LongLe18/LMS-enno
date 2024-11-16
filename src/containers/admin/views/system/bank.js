import React, { useEffect, useState } from 'react';

// helper
import config from '../../../../configs/index';
import moment from "moment";

// components
import { Table, Button, Row, Col, notification, Space, Form, Select, Input, Modal } from 'antd';
import LoadingCustom from 'components/parts/loading/Loading';
import { ExclamationCircleOutlined, } from '@ant-design/icons';

// redux
import * as bankAction from '../../../../redux/actions/bank';
import { useSelector, useDispatch } from "react-redux";

const dataBank = [
    {
        value: 'AB Bank',
        label: 'ABBANK'
    },
    {
        value: 'AgriBank',
        label: 'AgriBank'
    },
    {
        value: 'BaoVietBank',
        label: 'Bao Viet Bank'
    },
    {
        value: 'BIDV',
        label: 'BIDV'
    },
    {
        value: 'EximBank',
        label: 'EximBank'
    },
    {
        value: 'VietTinBank',
        label: 'VietTin Bank'
    },
    {
        value: 'IVB Bank',
        label: 'IVB Bank'
    },
    {
        value: 'MB Bank',
        label: 'MB Bank'
    },
    {
        value: 'NAM Á Bank',
        label: 'Nam Á Bank'
    },
    {
        value: 'OCB Bank',
        label: 'OCB Bank'
    },
    {
        value: 'OCEAN Bank',
        label: 'OCEAN Bank'
    },
    {
        value: 'Bắc Á Bank',
        label: 'Bắc Á Bank'
    },
    {
        value: 'BIDC',
        label: 'BIDC Bank'
    },
    {
        value: 'HD Bank',
        label: 'HD Bank'
    },
    {
        value: 'Kiên Long Bank',
        label: 'Kiên Long Bank'
    },
    {
        value: 'MSB',
        label: 'MSB Bank'
    },
    {
        value: 'Sài Gòn Bank',
        label: 'Sài Gòn Bank'
    },
    {
        value: 'TECHCOMBANK',
        label: 'TechCom Bank'
    },
    {
        value: 'TPBANK',
        label: 'TP Bank'
    },
    {
        value: 'VIB Bank',
        label: 'VIB Bank'
    },
    {
        value: 'VIETABANK',
        label: 'Việt Á Bank'
    },
    {
        value: 'SCB',
        label: 'SCB Bank'
    },
    {
        value: 'VCBBANK',
        label: 'VCB Bank'
    },
    {
        value: 'VIETBANK',
        label: 'VietBank'
    },
    {
        value: 'VIETCOMBANK',
        label: 'VietCom Bank'
    },
    {
        value: 'VPBANK',
        label: 'VP Bank'
    },
];

const { Option } = Select;

const BankInfoPage = (props) => {
    let data = [];
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const banks = useSelector(state => state.bank.list.result);
    const bank = useSelector(state => state.bank.item.result);
    const loadingBank = useSelector(state => state.bank.item.loading);

    useEffect(() => {
        dispatch(bankAction.getBANKs());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (banks.status === 'success') {
        data = banks.data.map((item, index) => ({...item, key: index}));
        form.resetFields();
    };
    
    const [state, setState] = useState({
        idBank: 1,
        isEdit: false,
    })

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên ngân hàng',
            dataIndex: 'ten_ngan_hang',
            key: 'ten_ngan_hang',
            responsive: ['md'],
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'so_tai_khoan',
            key: 'so_tai_khoan',
            responsive: ['md'],
        },
        {
            title: 'Đơn vị thụ hưởng',
            dataIndex: 'ten_dvth',
            key: 'ten_dvth',
            responsive: ['md'],
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'chi_nhanh',
            key: 'chi_nhanh',
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
            key: 'tai_khoan_bank_id',
            dataIndex: 'tai_khoan_bank_id',
            // Redirect view for edit
            render: (tai_khoan_bank_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditBank(tai_khoan_bank_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button  type="button" onClick={() => DeleteBank(tai_khoan_bank_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
                </Space>
            ),
        },
    ];

    const renderBanks = () => {
        let options = [];
        options = dataBank.map((bank) => (
            <Option key={bank.value} value={bank.value} >{bank.label}</Option>
        ))
        return (
            <Select
                showSearch={false}
                placeholder="Chọn ngân hàng"
            >
            {options}
            </Select>
        );
    };

    const EditBank = (id) => {
        dispatch(bankAction.getBANK({ id: id }))
        setState({ ...state, isEdit: true, idBank: id });
        document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    };

    useEffect(() => {
        if (bank.status === 'success') {        
            form.setFieldsValue(bank.data);
        }
    }, [bank]);  // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const onSubmitForm = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                dispatch(bankAction.getBANKs());
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm thông tin ngân hàng thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm thông tin ngân hàng thất bại',
                })
            }
        };

        const data = {
            ten_ngan_hang: values.ten_ngan_hang,
            so_tai_khoan: values.so_tai_khoan,
            ten_dvth: values.ten_dvth,
            chi_nhanh: values.chi_nhanh
        };

        if (state.isEdit) {
            dispatch(bankAction.EditBANK({ formData: data, id: state.idBank }, callback))
        } else {
            dispatch(bankAction.CreateBANK(data, callback));
        }
    };

    const DeleteBank = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa thông tin ngân hàng này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(bankAction.getBANKs());
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa thông tin ngân hàng thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa thông tin ngân hàng thất bại',
                        })
                    };
                }
                dispatch(bankAction.DeleteBANK({ id: id }, callback))
            },
        });
    };

    return (
        <div className='content'>
            <br/>
            <h5>Quản lý tài khoản ngân hàng</h5>
            {banks.status === 'success' && 
                <Table className="table-striped-rows" columns={columns} dataSource={data} />
            }
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                {loadingBank && <LoadingCustom/>}   
                {(state.isEdit && bank.status === 'success' && bank) ? <h5>Sửa thông tin ngân hàng</h5> : <h5>Thêm mới ngân hàng</h5>}  
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={onSubmitForm}>
                        <Form.Item
                            className="input-col"
                            label="Tên ngân hàng"
                            name="ten_ngan_hang"
                            rules={[
                                {
                                required: true,
                                message: 'Tên ngân hàng là trường bắt buộc.',
                                },
                            ]}
                            >
                                {renderBanks()}
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Số tài khoản"
                            name="so_tai_khoan"
                            rules={[
                                {
                                required: true,
                                message: 'Số tài khoản là trường bắt buộc.',
                                },
                            ]}
                            >
                                <Input placeholder="Nhập số tài khoản"/>
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Đơn vị hưởng thụ"
                            name="ten_dvth"
                            rules={[]}
                        >
                            <Input placeholder='Nhập tên đơn vị hưởng thụ' />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Chi nhánh"
                            name="chi_nhanh"
                            rules={[]}
                        >
                            <Input placeholder='Nhập tên chi nhánh' />
                        </Form.Item>
                        <Form.Item className="button-col">
                            <Space>
                                <Button shape="round" type="primary" htmlType="submit" >
                                {(state.isEdit && bank.status === 'success' && bank) ? 'Cập nhật' : 'Thêm mới'}   
                                </Button>
                                {(state.isEdit && bank.status === 'success' && bank) 
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
};

export default BankInfoPage;