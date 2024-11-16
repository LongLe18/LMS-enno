import React, { useEffect, useState } from 'react';
import constants from '../../../../helpers/constants';

import config from '../../../../configs/index';
import moment from "moment";

// react plugin for creating notifications over the dashboard
import { Table, Tag, Button, Row, Col, notification, Space, Form, Input, Upload, message, Radio, Modal, } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// component
import LoadingCustom from 'components/parts/loading/Loading';
import AppFilter from "components/common/AppFilter";

// redux
import * as programAction from '../../../../redux/actions/programme';
import { useSelector, useDispatch } from "react-redux";

const { TextArea } = Input;
const { Dragger } = Upload;

const ProgramPage = () => {
    const data = [];
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const programs = useSelector(state => state.programme.list.result);
    const error = useSelector(state => state.programme.list.error);

    const program = useSelector(state => state.programme.item.result);
    const loadingProgram = useSelector(state => state.programme.item.loading);

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
            setState({ ...state, fileImg: info.file.originFileObj });
        },
  
        async customRequest(options) {
            const { onSuccess } = options;
        
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
  
        onRemove(e) {
            setState({ ...state, fileImg: '' });
        },
    };

    const formDefault = {
        ten_khung_ct: '',
        mo_ta: '',
        kct_id: 1,
    };

    const [state, setState] = useState({
        form: formDefault,
        idProgramme: 1,
        fileImg: '',
        isEdit: false,
        programData: {},
    })

    const [filter, setFilter] = useState({
        trang_thai: 2,
        search: '',
        start: '',
        end: '',
    });

    const columns = [
        {
            title: 'Tên khung chương trình',
            dataIndex: 'ten_khung_ct',
            key: 'ten_khung_ct',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === true ? 'green' : 'red'} key={trang_thai}>
                {trang_thai === true ? "Đang hoạt động" : "Đã dừng"}
                </Tag>
            ),
        },
        {
            title: 'Loại khung chương trình',
            dataIndex: 'loai_kct',
            key: 'loai_kct',
            responsive: ['md'],
            render: (loai_kct) => (
                <Tag color={loai_kct === 0 ? 'green' : loai_kct === 1 ? 'orange' : loai_kct === 3 ? 'geekblue' : 'blue'} key={loai_kct}>
                    {loai_kct === 1 ? "Thi thử Online" : loai_kct === 0 ? "Đánh giá năng lực" : loai_kct === 3 ? 'Đánh giá tư duy BK' : 'Ôn luyện'}
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
            key: 'kct_id',
            dataIndex: 'kct_id',
            // Redirect view for edit
            render: (kct_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditProgram(kct_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round"onClick={() => DeleteProgram(kct_id)}  type="danger" >Dừng</Button> 
                </Space>
            ),
        },
    ];

    useEffect(() => {
        dispatch(programAction.getProgrammes({ status: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
      
    if (programs.status === 'success') {
        programs.data.map((module, index) => data.push({...module, 'key': index}))
    }

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
        dispatch(programAction.getProgrammes({ status: filter.trang_thai === 2 ? '' : filter.trang_thai }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const EditProgram = (id) => {
        dispatch(programAction.getProgramme({ id: id }))
        setState({ ...state, isEdit: true, idProgramme: id });
        let body = document.getElementsByClassName('cate-form-block')[0];
        body.scrollIntoView();
    }

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    useEffect(() => {
        if (program.status === 'success') {          
            form.setFieldsValue(program.data);
        }
    }, [program]);  // eslint-disable-line react-hooks/exhaustive-deps


    const createProgram = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                form.resetFields();
                dispatch(programAction.getProgrammes({ status: filter.trang_thai === 2 ? '' : filter.trang_thai }));
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ? 'Cập nhật khung chương trình thành công' : 'Thêm khung chương trình mới thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: state.isEdit ? 'Cập nhật khung chương trình thất bại' : 'Thêm khung chương trình mới thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('ten_khung_ct', values.ten_khung_ct);
        formData.append('mo_ta', values.mo_ta ? values.mo_ta : '');
        formData.append('loai_kct', values.loai_kct);
        // video , image
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        if (state.isEdit) {
            dispatch(programAction.editProgramme({ formData: formData, id: state.idProgramme }, callback))
        } else {
            dispatch(programAction.createProgramme(formData, callback));
        }
    };

    const DeleteProgram = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn dừng khung chương trình này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(programAction.getProgrammes({ status: filter.trang_thai === 2 ? '' : filter.trang_thai }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Dừng khung chương trình thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Dừng khung chương trình mới thất bại',
                        })
                    };
                }
                dispatch(programAction.deleteProgramme({ id: id }, callback))
            },
        });
    };

    return (
        <div className='content'>
            <Row className="app-main">
                <Col xl={24} className="body-content">
                    <Row>
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                            title="Danh sách khung chương trình"
                            isShowCourse={false}
                            isShowModule={false}
                            isShowThematic={false}
                            isShowStatus={false}
                            isShowSearchBox={false}
                            isShowDatePicker={false}
                            isRangeDatePicker={false}
                            courses={programs.data}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {data.length > 0 && 
                <Table className="table-striped-rows" columns={columns} dataSource={data} />
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu khung chương trình thất bại',
            })}
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {loadingProgram && <LoadingCustom/>}
                    {(state.isEdit && program.status === 'success' && program) ?
                        <h5>Sửa thông tin khung chương tình</h5> 
                        : 
                        <h5>Thêm mới khung chương trình</h5>
                    }  
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createProgram}>
                        <Form.Item
                            className="input-col"
                            label="Tên khung chương trình"
                            name="ten_khung_ct"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên khung chương trình là trường bắt buộc.',
                                },
                            ]}
                            >
                                <Input placeholder="Nhập tên khung chương trình"/>
                        </Form.Item>
                        <Form.Item
                            name="loai_kct"
                            label="Loại khung chương trình"
                            initialValue={0}
                            rules={[
                            {
                                required: true,
                                message: 'Loại khung chương trình là trường bắt buộc.',
                            },
                            ]}
                        >
                            <Radio.Group options={constants.TYPE_PROGRAMES}  />
                        </Form.Item>
                        <Form.Item
                            className="input-col"
                            label="Mô tả"
                            name="mo_ta"
                            rules={[]}
                            >
                                <TextArea placeholder="Nhập mô tả"/>
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
                        <br/>
                        <Form.Item className="button-col">
                            <Space>
                                <Button shape="round" type="primary" htmlType="submit" >
                                    {(state.isEdit && program.status === 'success' && program) ? 'Cập nhật' : 'Thêm mới'}   
                                </Button>
                                {(state.isEdit && program.status === 'success' && program) 
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

export default ProgramPage;