import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Row, Col, Table, Form, notification, Space, Button, Select, InputNumber, Modal } from 'antd';
import AppFilter from "components/common/AppFilter";
import { ExclamationCircleOutlined, } from '@ant-design/icons';
// redux
import * as dealerAction from '../../../../redux/actions/dealer';
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import * as userAction from '../../../../redux/actions/user';
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;

const DealerPage = (props) => {
    const data = [];
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const history = useHistory();

    const dealer = useSelector(state => state.dealer.item.result);
    const dealers = useSelector(state => state.dealer.list.result);
    const courses = useSelector(state => state.course.list.result);
    const programmes = useSelector(state => state.programme.list.result);
    const teachers = useSelector(state => state.user.listTeacher.result);

    const [state, setState] = useState({
        isEdit: false,
        idDealer: 0,
    });

    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
        search: '',
    });

    useEffect(() => {
        dispatch(dealerAction.getDealers({ name: filter.search, idCourse: filter.khoa_hoc_id }));
        dispatch(courseAction.filterCourses({ status: '', search: '', start: '', end: '', pageIndex: 1, pageSize: 100000000 }));
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(userAction.getTeachers({ idMajor: '', status: '', startDay: '', endDay: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (dealers.status === 'success') {
        dealers.data.map((item, index) => {
            data.push({...item, key: index})
            return null;
        })
    };
    
    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Giáo viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Mức chiết khấu sinh viên',
            dataIndex: 'chiet_khau_sv',
            key: 'chiet_khau_sv',
            responsive: ['md'],
        },
        {
            title: 'Mức chiết khấu giáo viên',
            dataIndex: 'chiet_khau_gv',
            key: 'chiet_khau_gv',
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
            key: 'chiet_khau_id',
            dataIndex: 'chiet_khau_id',
            // Redirect view for edit
            render: (chiet_khau_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => history.push(`/admin/business/detaildealer/${chiet_khau_id}`)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
                <Button  type="button" onClick={() => EditDealer(chiet_khau_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button  type="button" onClick={() => DeleteDealer(chiet_khau_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
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

    const renderTeachers = () => {
        let options = [];
        if (teachers.status === 'success') {
            options = teachers.data.map((course) => (
                <Option key={course.giao_vien_id} value={course.giao_vien_id} >{course.ho_ten}</Option>
            ))
        }
        return (
            <Select
            showSearch={false}
            placeholder="Chọn giáo viên"
            >
                {options}
            </Select>
        );
    };

    const EditDealer = (chiet_khau_id) => {
        const callback = (res) => { 
            console.log(res.data);
            if (res.status === 'success') {
                form.setFieldsValue(res.data);
                setState({ ...state, idDealer: res.data.chiet_khau_id, isEdit: true });
                document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
            }
        };
        dispatch(dealerAction.getDealer2({ id: chiet_khau_id }, callback));
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false, idDealer: 0 })
        form.resetFields();
    };
    
    const DeleteDealer = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn xóa chiết khấu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(dealerAction.getDealers({ name: filter.search, idCourse: filter.khoa_hoc_id }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa chiết khấu khóa học thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa chiết khấu khóa học thất bại',
                        })
                    };
                }
                dispatch(dealerAction.DeleteDealer({ id: id }, callback));
            },
        });
    };

    const submitForm = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                if (!state.isEdit) { // Nếu thêm mới
                    const data = {
                        "chiet_khau_id": res.data.data.chiet_khau_id
                    }
                    dispatch(dealerAction.CreateDealerDetail(data, (res) => {
                        if (res.status === 'success') {
                            dispatch(dealerAction.getDealers({ name: filter.search, idCourse: filter.khoa_hoc_id }));
                        }
                    }))
                } else dispatch(dealerAction.getDealers({ name: filter.search, idCourse: filter.khoa_hoc_id })); // sửa
                
                form.resetFields(); // reset form
                setState({ ...state, isEdit: false });
                
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ?  'Sửa chiết khấu thành công' : 'Thêm chiết khấu mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Sửa chiết khấu thất bại' : 'Thêm chiết khấu mới thất bại',
                })
            }
        };
     
        if (state.isEdit) {
            const dataEdit = {
                giao_vien_id: values.giao_vien_id,
                khoa_hoc_id: values.khoa_hoc_id,
                chiet_khau_sv: values.chiet_khau_sv,
                chiet_khau_gv: values.chiet_khau_gv,
            }
            dispatch(dealerAction.EditDealer({ id: state.idDealer, formData: dataEdit }, callback))
        } else {
            const dataAdd = {
                khoa_hoc_id: values.khoa_hoc_id,
                giao_vien_id: values.giao_vien_id,
                chiet_khau_sv: values.chiet_khau_sv,
                chiet_khau_gv: values.chiet_khau_gv,
                so_luong: values.so_luong,
            }
            dispatch(dealerAction.CreateDealer(dataAdd, callback));
        }
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
        dispatch(dealerAction.getDealers({ name: filter.search, idCourse: filter.khoa_hoc_id }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div className="content">
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Quản lý chiết khấu"
                                isShowStatus={false}
                                isShowSearchBox={true}
                                isShowDatePicker={false}
                                courses={courses.data}
                                isShowCourse={true}
                                isRangeDatePicker={false}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
                {(dealers.status === 'success') && 
                    <Table className="table-striped-rows" columns={columns} dataSource={data} />
                }
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {(state.isEdit && dealer.status === 'success' && dealers) 
                            ? <h5>Sửa thông tin chiết khấu</h5> 
                            : <h5>Thêm mới chiết khấu</h5>}  
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
                                label="Giáo viên"
                                name="giao_vien_id"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Giáo viên là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    {renderTeachers()}
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Số lượng"
                                name="so_luong"
                                rules={[
                                    {
                                        required: !state.isEdit,
                                        message: 'Số lượng là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <InputNumber placeholder="Nhập số lượng phiếu chiết khấu" style={{width: '100%'}} disabled={state.isEdit}/>
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Chiết khấu học viên"
                                name="chiet_khau_sv"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chiết khấu học viên là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <InputNumber placeholder="Nhập tỉ lệ chiết khấu" style={{width: '100%'}}/>
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Chiết khấu đại lý"
                                name="chiet_khau_gv"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chiết khấu đại lý là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <InputNumber placeholder="Nhập tỉ lệ chiết khấu" style={{width: '100%'}}/>
                            </Form.Item>
                            <Form.Item className="button-col">
                                <Space>
                                    <Button shape="round" type="primary" htmlType="submit" >
                                        {(state.isEdit && dealer.status === 'success' && dealer.data) ? 'Cập nhật' : 'Thêm mới'}   
                                    </Button>
                                    {(state.isEdit && dealer.status === 'success' && dealer.data) 
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

export default DealerPage;