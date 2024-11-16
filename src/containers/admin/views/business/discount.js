import React, { useEffect, useState } from 'react';

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Row, Col, Table, Form, notification, Tag, Space, 
    Button, Select, InputNumber, DatePicker, Modal } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import AppFilter from 'components/common/AppFilter';
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import * as discountAction from '../../../../redux/actions/discount';
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DiscountPage = (props) => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const [state, setState] = useState({
        isEdit: false,
        idDiscount: 0,
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
        dataDiscounts: [],
    });
    const [filter, setFilter] = useState({
        trang_thai: 2,
        khoa_hoc_id: '',
    });

    const courses = useSelector(state => state.course.list.result);
    const programmes = useSelector(state => state.programme.list.result);

    const discount = useSelector(state => state.discount.item.result);
    const loading = useSelector(state => state.discount.item.loading);
    
    useEffect(() => {
        const callback = (res) => {
            if (res.status === 'success') {
                res.data.map((item, index) => {
                    item.key = index;
                    return null;
                });
                setState({ ...state, dataDiscounts: res.data })
            }
        };

        dispatch(courseAction.filterCourses({ status: '', search: '', start: '', end: '', pageSize: 10000000, pageIndex: 1 }));
        dispatch(discountAction.getDiscounts({ status: '', idCourse: '' }, callback));
        dispatch(programmeAction.getProgrammes({ status: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onFilterChange = (field, value) => {
        setFilter((state) => ({ ...state, [field]: value }));  
    };

    useEffect(() => {
        dispatch(discountAction.getDiscounts({ status: filter.trang_thai, idCourse: filter.khoa_hoc_id }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const columns = [
        {
          title: 'Mức giảm giá',
          dataIndex: 'muc_giam_gia',
          key: 'muc_giam_gia',
          responsive: ['md'],
        },
        {
          title: 'Khóa học',
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
                {trang_thai === 1 ? "Đang sử dụng" : "Tạm dừng"}
              </Tag>
            ),
        },
        {
          title: 'Ngày bắt đầu',
          dataIndex: 'ngay_bat_dau',
          key: 'ngay_bat_dau',
          responsive: ['md'],
          render: (date) => (
            moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
          )
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngay_ket_thuc',
            key: 'ngay_ket_thuc',
            responsive: ['md'],
            render: (date) => (
              moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
            )
        },
        {
          title: 'Tùy chọn',
          key: 'giam_gia_id',
          dataIndex: 'giam_gia_id',
          // Redirect view for edit
          render: (giam_gia_id) => (
            <Space size="middle">
              <Button  type="button" onClick={() => EditDiscount(giam_gia_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
              <Button  type="button" danger onClick={() => DeleteDiscount(giam_gia_id)} className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
            </Space>
          ),
        },
    ];

    const renderProgrammes = () => {
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
                onChange={(kct_id) => dispatch(courseAction.getCourses({ idkct: kct_id, status: '', search: '' }))}
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
                placeholder="Chọn khóa học"
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
                <Option value={true} >Sử dụng</Option>
                <Option value={false} >Tạm dừng</Option>
            </Select>
        );
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const EditDiscount = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                setState({ ...state, ngay_bat_dau: res.data.ngay_bat_dau, ngay_ket_thuc: res.data.ngay_ket_thuc, idDiscount: id, isEdit: true });
                res.data = {
                    ...res.data,
                    ngay_bat_dau: [res.data.ngay_bat_dau !== null ? moment(res.data.ngay_bat_dau, "YYYY/MM/DD") : null, 
                            res.data.ngay_ket_thuc !== null ? moment(res.data.ngay_ket_thuc, "YYYY/MM/DD") : null],
                }           
                form.setFieldsValue(res.data);
                document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
            }
        }
        dispatch(discountAction.getDiscount({ id: id }, callback));
    };

    const onChangeStart = (value, dateString) => {
        setState({...state, ngay_bat_dau: dateString[0], ngay_ket_thuc: dateString[1] });
    };

    const submitForm = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                setState({ ...state, isEdit: false });
                dispatch(discountAction.getDiscounts({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, idCourse: filter.khoa_hoc_id }, (res) => {
                    if (res.status === 'success') {
                        res.data.map((item, index) => {
                            item.key = index;
                            return null;
                        });
                        setState({...state, dataDiscounts: res.data})
                    };
                }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ?  'Sửa khuyến mãi thành công' : 'Thêm khuyến mãi mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Sửa khuyến mãi thất bại' : 'Thêm khuyến mãi mới thất bại',
                })
            }
        };

        const dataSubmit = {
            khoa_hoc_id: values.khoa_hoc_id,
            muc_giam_gia: values.muc_giam_gia,
            trang_thai: values.trang_thai,
            ngay_bat_dau: state.ngay_bat_dau,
            ngay_ket_thuc: state.ngay_ket_thuc
        }

        if (state.isEdit) {
            dispatch(discountAction.EditDiscount({ id: state.idDiscount, formData: dataSubmit }, callback));
        } else {
            dispatch(discountAction.CreateDiscount(dataSubmit, callback))
        }
    };

    const DeleteDiscount = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn xóa khuyến mãi này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(discountAction.getDiscounts({ status: filter.trang_thai === 2 ? '' : filter.trang_thai, idCourse: filter.khoa_hoc_id }, (res) => {
                            if (res.status === 'success') {
                                res.data.map((item, index) => {
                                    item.key = index;
                                    return null;
                                });
                                setState({...state, dataDiscounts: res.data})
                            };
                        }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa khuyến mãi khóa học thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa khuyến mãi khóa học mới thất bại',
                        })
                    };
                }
                dispatch(discountAction.DeleteDiscount({ id: id }, callback))
            },
        });
    };

    return (
        <>
            <div className='content'>
                <Row className="app-main">
                    <Col xl={24} className="body-content">
                        <Row>
                            <Col xl={24} sm={24} xs={24}>
                                <AppFilter
                                title="Danh sách khuyến mãi"
                                isShowCourse={true}
                                isShowModule={false}
                                isShowThematic={false}
                                isShowStatus={true}
                                isShowSearchBox={false}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                                courses={courses.data}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Table className="table-striped-rows" columns={columns} dataSource={state.dataDiscounts} />
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {loading && <LoadingCustom/>}  
                        {(state.isEdit && discount.status === 'success' && discount) ? <h5>Sửa thông tin khuyến mãi khóa học</h5> : <h5>Thêm mới khuyến mãi</h5>}  
                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={submitForm}>  
                            <Form.Item
                                className="input-col"
                                label="Khung chương trình"
                                name="kct_id"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Khung chương trình là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    {renderProgrammes()}
                            </Form.Item>
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
                                    {renderCourses()}
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Mức giảm giá"
                                name="muc_giam_gia"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Mức giảm giá là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <InputNumber placeholder='Nhập mức giảm giá cho khóa học' style={{width: '100%'}}/>
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Trạng thái"
                                name="trang_thai"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Trạng thái giá là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    {renderStatus()}
                            </Form.Item>
                            <Row>
                                <Form.Item
                                    className="input-col"
                                    label="Ngày bắt đầu / ngày kết thúc khóa học"
                                    name="ngay_bat_dau"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Ngày bắt đầu / ngày kết thúc là trường bắt buộc.',
                                            },
                                    ]}
                                >
                                  <RangePicker
                                    format="YYYY-MM-DD"
                                    onChange={onChangeStart}
                                    locale={{
                                        lang: {
                                            locale: 'en_US',
                                            rangePlaceholder: ['Từ ngày', 'Đến ngày'],
                                        },
                                    }}
                                  />
                                </Form.Item>     
                            </Row>
                            <Form.Item className="button-col">
                                <Space>
                                    <Button shape="round" type="primary" htmlType="submit" >
                                        {(state.isEdit && discount.status === 'success' && discount.data) ? 'Cập nhật' : 'Thêm mới'}   
                                    </Button>
                                    {(state.isEdit && discount.status === 'success' && discount.data) 
                                    ?   <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
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

export default DiscountPage;