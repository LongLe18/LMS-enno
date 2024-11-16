import React, { useEffect, useState } from "react";

// helper
import config from '../../../../configs/index';
import moment from "moment";
import Hashids from 'hashids';

// component
import AppFilter from "components/common/AppFilter";
import LoadingCustom from 'components/parts/loading/Loading';
import { Table, Button, Row, Col, notification, Space, Form, Select, Input, Pagination } from 'antd';
import TextEditorWidget2 from "components/common/TextEditor/TextEditor2";

// redux
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import * as descriptionAction from '../../../../redux/actions/descriptionCourse';
import { useSelector, useDispatch } from "react-redux";


const { Option } = Select;

const BussinessCourses = (props) => {
    
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const hashids = new Hashids();

    const [state, setState] = useState({
        idDescription: 1,
        isEdit: false,
        dataCourse: [],
    })
    const [pageIndex, setPageIndex] = useState(1);

    const courses = useSelector(state => state.course.list.result);
    const programmes = useSelector(state => state.programme.list.result);

    const description = useSelector(state => state.descriptionCourse.item.result);
    const descriptions = useSelector(state => state.descriptionCourse.list.result);
    const loading = useSelector(state => state.descriptionCourse.item.loading);

    const [filter, setFilter] = useState({
        trang_thai: 2,
        search: '',
        start: '',
        kct_id: '',
        end: '',
    });

    const columns = [
        {
          title: 'Tên khóa học',
          dataIndex: 'ten_khoa_hoc',
          key: 'ten_khoa_hoc',
          responsive: ['md'],
          render: (ten_khung_ct, description) => (
            description?.khoa_hoc?.ten_khoa_hoc
          )
        },
        {
          title: 'Khung chương trình',
          dataIndex: 'ten_khung_ct',
          key: 'ten_khung_ct',
          responsive: ['md'],
          render: (ten_khung_ct, description) => (
            description?.khoa_hoc?.khung_chuong_trinh?.ten_khung_ct
          )
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
          key: 'khoa_hoc_id',
          dataIndex: 'khoa_hoc_id',
          // Redirect view for edit
          render: (khoa_hoc_id) => (
            <Space size="middle">
              <Button  type="button" onClick={() => goToDetail(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Xem</Button>
              <Button  type="button" onClick={() => EditDescription(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
            </Space>
          ),
        },
    ];

    const goToDetail = (id) => {
        window.open(config.BASE_URL + `/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(id)}`, '_blank');
    }

    useEffect(() => {
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(descriptionAction.getDescriptionCourses({ pageSize: 10, pageIndex: pageIndex, kct_id: filter.kct_id }));
    }, [pageIndex]); // eslint-disable-line react-hooks/exhaustive-deps
    

    useEffect(() => {
        dispatch(courseAction.filterCourses({ status: '', search: filter.search, start: filter.start, end: filter.end, pageIndex: 1, pageSize: 10000000}));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        dispatch(descriptionAction.getDescriptionCourses({ pageSize: 10, pageIndex: pageIndex, kct_id: filter.kct_id }));
    }, [filter.trang_thai, filter.start, filter.end, filter.kct_id]); // eslint-disable-line react-hooks/exhaustive-deps


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

    const EditDescription = (idCourse) => {
        const callback = (res) => {
            if (res.status === 'success') {
                if (res.data === null) form.setFieldsValue({'khoa_hoc_id': idCourse});
                form.setFieldsValue(res.data);
                document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
            }
        }
        form.resetFields();
        dispatch(descriptionAction.getDescriptionCourse({ id: idCourse }, callback));
        setState({ ...state, idDescription: idCourse, isEdit: true });
    };  

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const submitForm = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                setState({ ...state, isEdit: false });
                dispatch(descriptionAction.getDescriptionCourses({ pageSize: 10, pageIndex: pageIndex, kct_id: filter.kct_id }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ?  'Sửa mô tả khóa học thành công' : 'Thêm mô tả khóa học mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Sửa mô tả khóa học thất bại' : 'Thêm mô tả khóa học mới thất bại',
                })
            }
        };

        const dataSubmit = {
            khoa_hoc_id: values.khoa_hoc_id,
            mo_ta_chung: values.mo_ta_chung !== undefined ? values.mo_ta_chung : '',
            gioi_thieu: values.gioi_thieu !== undefined ? values.gioi_thieu : '',
            hinh_thuc_dao_tao: values.hinh_thuc_dao_tao !== undefined ? values.hinh_thuc_dao_tao : '',
            muc_tieu_cam_ket: values.muc_tieu_cam_ket !== undefined ? values.muc_tieu_cam_ket : '',
            doi_tuong: values.doi_tuong !== undefined ? values.doi_tuong : '',
            noi_dung_chi_tiet: values.noi_dung_chi_tiet !== undefined ? values.noi_dung_chi_tiet : '',
            xep_lop_thoi_gian: values.xep_lop_thoi_gian !== undefined ? values.xep_lop_thoi_gian : '',
            gia_goc: values.gia_goc !== undefined ? values.gia_goc : '',
        };
        if (state.isEdit) {
            dispatch(descriptionAction.EditDescriptionCourse({ idCourse: state.idDescription, formData: dataSubmit }, callback));
        } else {
            dispatch(descriptionAction.CreateDescriptionCourse(dataSubmit, callback))
        }
    };
    
    // event thay đổi trang
    const onChange = (page) => {
        setPageIndex(page);
    };

    return (
        <div className="content">
            <Row className="app-main">
                <Col xl={24} className="body-content">
                    <Row>
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Danh sách khóa học"
                                isShowProgramme={true}
                                programmes={programmes.data}
                                courses={courses.data}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Table className="table-striped-rows" columns={columns} dataSource={descriptions?.data} pagination={false}/>
            <br/>
            <Pagination current={pageIndex} onChange={onChange} total={descriptions?.totalCount} />
            <br/>
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loading && <LoadingCustom/>}  
                    {(state.isEdit && description.status === 'success' && description) ? <h5>Sửa thông tin mô tả khóa học</h5> : <h5>Thêm mới mô tả khóa học</h5>}  
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={submitForm}>  
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
                            label="Mô tả chung"
                            name="mo_ta_chung"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Mô tả khóa học"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Giới thiệu Khóa học"
                            name="gioi_thieu"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Giới thiệu khóa học"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>         
                        <Form.Item
                            className="input-col"
                            label="Hình thức đào tạo"
                            name="hinh_thuc_dao_tao"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Hình thức đào tạo"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Mục tiêu cam kết"
                            name="muc_tieu_cam_ket"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Mục tiêu cam kết"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Đối tượng"
                            name="doi_tuong"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Đối tượng"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Nội dung chi tiết"
                            name="noi_dung_chi_tiet"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Nội dung chi tiết"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Xếp lớp thời gian"
                            name="xep_lop_thoi_gian"
                            rules={[]}
                        >
                                <TextEditorWidget2
                                    placeholder="Xếp lớp thời gian"
                                    showToolbar={true}
                                    isMinHeight200={true}
                                    isSimple={false}
                                />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Giá gốc (Nhập liền không dấu. Ví dụ: 10000)"
                            name="gia_goc"
                            rules={[]}
                        >
                                <Input placeholder='Giá gốc'/>
                        </Form.Item>
                        <Form.Item className="button-col">
                            <Space>
                                <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && description.status === 'success' && description) ? 'Cập nhật' : 'Thêm mới'}   
                                </Button>
                                {(state.isEdit && description.status === 'success' && description) 
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
    )
};

export default BussinessCourses;