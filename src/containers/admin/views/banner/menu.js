import React, { useState, useEffect } from 'react';

// helper
import config from '../../../../configs/index';
import moment from 'moment';
// component
import { Select, notification, Row, Form, Col, Input, Timeline, InputNumber, 
    Modal, Space, Button, Table } from 'antd';
    import { ExclamationCircleOutlined, } from '@ant-design/icons';
// redux
import { useDispatch, useSelector } from 'react-redux';
import * as menuAction from '../../../../redux/actions/menu';
import * as programmeAction from '../../../../redux/actions/programme';
import * as courseAction from '../../../../redux/actions/course';
import * as moduleAction from '../../../../redux/actions/part';

const { Option } = Select;

const MenuPage = (props) => {
    const dispatch = useDispatch();
    const dataMenus = [];
    const [form] = Form.useForm();

    const typesMenu = useSelector(state => state.menu.listType.result);
    const LoadingtypesMenu = useSelector(state => state.menu.listType.loading);
    const menus = useSelector(state => state.menu.list.result);
    const errorMenus = useSelector(state => state.menu.list.error);
    
    const menu = useSelector(state => state.menu.item.result);
    const programmes = useSelector(state => state.programme.list.result);
    const courses = useSelector(state => state.course.list.result);
    // const modules = useSelector(state => state.part.list.result);
    
    const [state, setState] = useState({
        isEdit: false,
        idMenu: 0, 
        idType: 1,
    });

    const columns = [
        {
            title: 'Tên menu',
            dataIndex: 'ten_menu',
            key: 'ten_menu',
            responsive: ['md'],
        },
        {
            title: 'Loại menu',
            dataIndex: 'loai_menu',
            key: 'loai_menu',
            responsive: ['md'],
        },
        {
            title: 'Giá trị',
            dataIndex: 'gia_tri',
            key: 'gia_tri',
            responsive: ['md'],
        },
        {
            title: 'Vị trí',
            dataIndex: 'vi_tri_hien_thi',
            key: 'vi_tri_hien_thi',
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
            key: 'menu_id',
            dataIndex: 'menu_id',
            // Redirect view for edit
            render: (menu_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditMenu(menu_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" onClick={() => DeleteMenu(menu_id)} type="danger">Xóa</Button> 
                </Space>
            ),
        },
    ];

    useEffect(() => {
        dispatch(menuAction.getTypesMenus());
        dispatch(menuAction.getMenus());
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(courseAction.getCourses({ idkct: 1, status: 1, search: '' })); // call default API với id khung chương trình là 1
        dispatch(moduleAction.getModulesByIdCourse2({ idCourse: 1 })) // call default API với id khóa học là 1 
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (menus.status === 'success') {
        menus.data.map((item, index) => {
            dataMenus.push({...item, key: index});
            return null;
        });
    };

    const renderTypesMenu = () => {
        let options = [];
        if (typesMenu.status === 'success') {
            options = typesMenu.data.map((typeMenu) => (
                <Option key={typeMenu.loai_menu_id} value={typeMenu.loai_menu_id} >{typeMenu.ten_loai_menu}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                loading={LoadingtypesMenu}
                placeholder="Chọn loại menu"
                onChange={(loai_menu_id) => onChangeType(loai_menu_id)}
            >
            {options}
            </Select>
        );
    };

    const onChangeType = (loai_menu_id) => {
        setState({ ...state, idType: loai_menu_id });
    };

    const renderProgramme = () => {
        let options = [];
        if (programmes.status === 'success') {
            options = programmes.data.map((programme) => (
                <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
            ))
        }
        return (
            <Select mode={state.idType === 2 ? 'multiple' : 'default'}
                showSearch={false}
                placeholder="Chọn khung chương trình"
                onChange={(kct_id) => {
                    dispatch(courseAction.getCourses({ idkct: kct_id, status: '', search: '' }));
                }}
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
                showSearch={false}
                placeholder="Chọn khóa học"
                onChange={(khoa_hoc_id) => {
                    dispatch(moduleAction.getModulesByIdCourse2({ idCourse: khoa_hoc_id }));
                }}
            >
            {options}
            </Select>
        );
    };

    const EditMenu = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                setState({ ...state, isEdit: true, idMenu: res.data.menu_id, idType: res.data.loai_menu_id});
                if (res.data.loai_menu_id === 2 || res.data.loai_menu_id === 3) res.data.gia_tri = res.data.gia_tri.split(',').map(Number);
                if (res.data.loai_menu_id === 4 || res.data.loai_menu_id === 5) res.data.gia_tri = parseInt(res.data.gia_tri);
                form.setFieldsValue(res.data);
                document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
            }
        }
        dispatch(menuAction.getMenu({ id: id }, callback))
    }

    const addMenu = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                setState({ ...state, isEdit: false });
                dispatch(menuAction.getMenus());
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ?  'Sửa menu thành công' : 'Thêm menu mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Sửa menu thất bại' : 'Thêm menu mới thất bại',
                })
            }
        };

        let data = {};
        if (state.idType === 1) { // loại liên kết
            data = {
                "ten_menu": values.ten_menu,
                "vi_tri_hien_thi": values.vi_tri_hien_thi,
                "gia_tri": values.gia_tri,
                "loai_menu_id": values.loai_menu_id
            };
        } else {
            data = {
                "ten_menu": values.ten_menu,
                "vi_tri_hien_thi": values.vi_tri_hien_thi,
                "gia_tri": (values.gia_tri.length > 0 && typeof values.gia_tri !== 'number') ? values.gia_tri.join(',') : values.gia_tri,
                "loai_menu_id": values.loai_menu_id
            };
        }
        if (state.isEdit) {
            dispatch(menuAction.EditMenu({ formData: data, id: state.idMenu }, callback))
        } else {
            dispatch(menuAction.CreateMenu(data, callback));
        }
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };
    
    const DeleteMenu = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa menu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(menuAction.getMenus());
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa menu thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa menu mới thất bại',
                        })
                    };
                }
                dispatch(menuAction.DeleteMenu({ id: id }, callback))
            },
        });
    };

    return (
        <>
        <br/>
            <div className='content'>
                <br/>
                {dataMenus.length > 0 && 
                    <Table className="table-striped-rows" columns={columns} dataSource={dataMenus}></Table>
                }
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {(state.isEdit && menu.status === 'success' && menu) 
                            ? 
                                <h5>Sửa menu</h5> 
                            : 
                                <h5>Thêm mới menu</h5>
                        }  
                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={addMenu}>
                            <Form.Item
                                    className="input-col"
                                    label="Loại menu"
                                    name="loai_menu_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Loại menu là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderTypesMenu()}
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Tên menu"
                                name="ten_menu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên menu là trường bắt buộc.',
                                    },
                                ]}
                            >
                                    <Input placeholder='Nhập tên menu'/>
                            </Form.Item>
                            {(state.idType === 4 ) && <Form.Item
                                className="input-col" initialValue={1} 
                                label="Khung chương trình"
                                name="khung_chuong_trinh"
                                rules={[]}
                            >
                                {renderProgramme()}
                            </Form.Item>
                            }
                            {/* {(state.idType === 5) && <Form.Item
                                className="input-col" initialValue={1}
                                label="Khóa học"
                                name="khoa_hoc" rules={[]}
                            >
                                {renderCourses()}
                            </Form.Item>
                            } */}

                            <Form.Item
                                className="input-col"
                                label="Giá trị"
                                name="gia_tri"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Giá trị là trường bắt buộc.',
                                    },
                                ]}
                            >
                                    {state.idType === 1 ? <Input placeholder='Nhập Giá trị' /> 
                                    : state.idType === 4 ? renderCourses()
                                    : (state.idType === 3 || state.idType === 2 || state.idType === 5) ? renderProgramme() 
                                    : <Input placeholder='Nhập Giá trị' />}
                            </Form.Item>
                            <Form.Item
                                className="input-col"
                                label="Vị trí"
                                name="vi_tri_hien_thi"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vị trí là trường bắt buộc.',
                                    },
                                ]}
                            >
                                    <InputNumber style={{width: '100%'}} placeholder='Nhập số thứ tự hiển thị'/>
                            </Form.Item>
                            <Form.Item className="button-col">
                                <Space>
                                    <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && menu.status === 'success' && menu) ? 'Cập nhật' : 'Thêm mới'}   
                                    </Button>
                                    {(state.isEdit && menu.status === 'success' && menu) 
                                    ?  <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
                                        Hủy bỏ
                                    </Button>
                                    : ''}    
                                </Space>    
                            </Form.Item>
                        </Form>                
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        <Form layout="vertical" className="category-form" autoComplete="off" >
                            <Timeline>
                                <Timeline.Item>Vị trí là số thứ tự hiển thị trên menu từ trái qua phải (Nếu vị trí giống nhau sẽ lỗi)</Timeline.Item>
                                <Timeline.Item>Nếu loại menu là Loại Liên kết : thì giá trị là Link liên kết.</Timeline.Item>
                                <Timeline.Item>Nếu là Mua bán : thì giá trị sẽ là list ID các khung chương trình được chọn cho hiển thị trên menu</Timeline.Item>
                                <Timeline.Item>Nếu là Khung chương trình: thì giá trị là Id_khung chương trình</Timeline.Item>
                                <Timeline.Item>Nếu là Khóa học thì giá trị là Id_khóa học</Timeline.Item>
                                <Timeline.Item>Nếu là Thi thử thì giá trị là Id_Khung chương trình</Timeline.Item>
                            </Timeline>
                        </Form>
                    </Col>
                </Row>
            </div>
            {(errorMenus) && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu menu',
            })}
        </>
    )
};

export default MenuPage;