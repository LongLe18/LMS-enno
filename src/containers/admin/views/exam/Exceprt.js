import React, { useEffect, useState } from 'react';
// import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';
import moment from 'moment';
import MathJax from 'react-mathjax';
import './css/exceprt.css';

// component
import { Row, Col, Table, notification, Button, Space, Form, Input, Modal, Pagination, Select } from 'antd';
import LoadingCustom from 'components/parts/loading/Loading';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// redux
import * as exceprtAction from '../../../../redux/actions/exceprt';
import { useSelector, useDispatch } from "react-redux"; 
import useDebounce from 'hooks/useDebounce';

// const { Dragger } = Upload;
const { TextArea, Search } = Input;
const { Option } = Select;

const Exceprt = (props) => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const data = [];
    const exceprts = useSelector(state => state.exceprt.list.result);
    const loading = useSelector(state => state.exceprt.list.loading);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const [isEdit, setIsEdit] = useState(false);
    const [state, setState] = useState({
        idExceprt: '',
        fileImg: '',
        search: ''
    });

    const searchValue = useDebounce(state.search, 250);

    useEffect(() => {
        dispatch(exceprtAction.getExceprts({ pageSize: pageSize, pageIndex: pageIndex, id: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (exceprts.status === 'success') {
        exceprts.data.map((item, index) => {
            let doan_trichs = item.noi_dung.split('$').map((doan_trich) => {
                if (doan_trich.includes('\\underline')) {
                    doan_trich = '<span class="underline">' + doan_trich.split('\\underline{')[1].split('}')[0] + '</span>';
                } else if (doan_trich.includes('\\bold')) {
                    doan_trich = '<span class="bold">' + doan_trich.split('\\bold{')[1].split('}')[0] + '</span>';
                }
                return doan_trich
            })
            data.push({...item, 'key': index, noi_dung: doan_trichs?.join('') })
            return null;
        });
    }

    const columns = [
        {
            title: 'ID trích đoạn',
            dataIndex: 'trich_doan_id',
            key: 'trich_doan_id',
            responsive: ['md'],
        },
        {
            title: 'Nội dung',
            dataIndex: 'noi_dung',
            key: 'noi_dung',
            responsive: ['md'],
            render: (noi_dung) => (
                <div className='answer-content'>
                    <MathJax.Provider>
                        <div style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: noi_dung }}></div>
                    </MathJax.Provider>
                </div>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngay_tao',
            key: 'ngay_tao',
            responsive: ['md'],
            render: (ngay_tao) => moment(ngay_tao).format(config.DATE_FORMAT)
        },
        {
            title: 'Tùy chọn',
            key: 'trich_doan_id',
            dataIndex: 'trich_doan_id',
            // Redirect view for edit
            render: (trich_doan_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => editExceprt(trich_doan_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button shape="round" type="danger" onClick={() => deleteExceprt(trich_doan_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];  

    // props for upload image
    // const propsImage = {
    //     name: 'file',
    //     action: '#',
  
    //     beforeUpload: file => {
    //       const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
    //       if (!isPNG) {
    //         message.error(`${file.name} có định dạng không phải là png/jpg`);
    //       }
    //       return isPNG || Upload.LIST_IGNORE;
    //     },
  
    //     onChange(info) {
    //       setState({ ...state, fileImg: info.file.originFileObj });
    //     },
  
    //     async customRequest(options) {
    //       const { onSuccess } = options;
    
    //       setTimeout(() => {
    //         onSuccess("ok");
    //       }, 0);
    //     },
  
    //     onRemove(e) {
    //       console.log(e);
    //       setState({ ...state, fileImg: '' });
    //     },
    // };
    
    const renderTypeExceprt = () => {
        let data = [{
            id: 1,
            tieu_de: 'Đọc đoạn trích sau đây và trả lời các câu hỏi từ'
        }, {
            id: 2,
            tieu_de: 'Đọc nội dung bài toán sau đây để trả lời các câu hỏi từ'
        }, {
            id: 3,
            tieu_de: 'Dựa vào dữ liệu sau đây để trả lời các câu hỏi từ'
        }, , {
            id: 4,
            tieu_de: 'Đọc đoạn thông tin sau và trả lời các câu hỏi từ'
        }, {
            id: 5,
            tieu_de: 'Đọc bảng tóm tắt sau và trả lời các câu hỏi từ'
        }, {
            id: 6,
            tieu_de: 'Đọc đoạn tư liệu sau và trả lời các câu hỏi từ'
        }, {
            id: 7,
            tieu_de: 'Đọc bảng số liệu sau và trả lời các câu hỏi từ'
        }, {
            id: 8,
            tieu_de: 'Fill in each blank from'
        }, {
            id: 9,
            tieu_de: 'Answer each question from'
        }]
        let options = [];
        options = data.map((item) => (
            <Option key={item.id} value={item.id} >{item.tieu_de}</Option>
        ))
        return (
            <Select
                showSearch={false}
                placeholder="Chọn Tiêu đề trích đoạn"
            >
                {options}
            </Select>
        );
    };

    const editExceprt = (trich_doan_id) => {
        const callback = (res) => {
            if (res.status === 'success') form.setFieldsValue(res.data);
            document.getElementById('form-control').scrollIntoView();
        };

        setIsEdit(true);
        setState({...state, idExceprt: trich_doan_id});
        dispatch(exceprtAction.getEXCEPRT({ id: trich_doan_id }, callback))
    };

    const deleteExceprt = (trich_doan_id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chán muốn xóa trích đoạn này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(exceprtAction.getExceprts({ pageSize: pageSize, pageIndex: pageIndex, id: state.search }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa trích đoạn thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa trích đoạn thất bại',
                        })
                    };
                }
                  dispatch(exceprtAction.deleteEXCEPRT({ id: trich_doan_id }, callback))
            },
        });
    };

    const createExceprt = (values) => {
        const formData = new FormData();
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                notification.success({
                    message: 'Thành công',
                    description: state.isEdit ? 'Sửa thông tin trích đoạn thành công' : 'Thêm trích đoạn mới thành công', 
                });
                dispatch(exceprtAction.getExceprts({ pageSize: pageSize, pageIndex: pageIndex, id: state.search }));
                form.resetFields();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm mới trích đoạn thất bại',
                })
            }
        };

        // if (state.fileImg !== '')
        //     formData.append('noi_dung', state.fileImg !== undefined ? state.fileImg : '');
        formData.append('noi_dung', values.noi_dung);
        formData.append('loai_trich_doan_id', values.loai_trich_doan_id);
        if (!isEdit)
            dispatch(exceprtAction.createEXCEPRT(formData, callback));
        else dispatch(exceprtAction.editEXCEPRT({ id: state.idExceprt, formData: formData }, callback));
    };

    const onChange = (page) => {
        setPageIndex(page);
    };

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize);
    };

    useEffect(() => {
        dispatch(exceprtAction.getExceprts({ pageSize: pageSize, pageIndex: pageIndex, id: state.search }));
    }, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setPageIndex(1); // reset page index
        dispatch(exceprtAction.getExceprts({ pageSize: pageSize, pageIndex: 1, id: state.search }));
      }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFilterChange = (field, value) => {
        setPageIndex(1);
        setState({...state, search: value});
    };

    return (
        <>
            {loading && <LoadingCustom/>}
            <div className='content'>
                <Row className="app-main">
                    <Col xl={24} className="body-content">
                        <h5>Trích đoạn đề thi</h5>
                        <Search placeholder={"Tìm kiếm theo ID đoạn trích"} 
                            onChange={(e) => onFilterChange('search', e.target.value)} style={{width:"20%"}}
                            allowClear
                        />
                    </Col>
                </Row>
                <Row className="select-action-group" gutter={[8, 8]}>
                    <Col xl={12} sm={12} xs={24}></Col>
                    <Col xl={12} sm={12} xs={24} className="right-actions">
                        <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" 
                            onClick={() => {
                                // scroll to form-control
                                document.getElementById('form-control').scrollIntoView();
                                setIsEdit(false);
                            }}
                        >
                            Thêm mới trích đoạn
                        </Button>
                    </Col>
                </Row>
                {exceprts.status === 'success' &&
                    <>
                        <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChange} total={exceprts.totalCount} onShowSizeChange={onShowSizeChange} showSizeChanger defaultPageSize={pageSize}/>
                        <br/>
                    </>
                }

                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {!isEdit ? <h5>Thêm mới trích đoạn đề thi</h5> :  <h5>Sửa trích đoạn đề thi</h5>}
                        <Form id='form-control' layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createExceprt}>
                            <Row gutter={25}>
                                <Col xl={24} sm={24} xs={24}>
                                    <Form.Item 
                                        className="input-col"
                                        label="Tiêu đề trích đoạn"
                                        name="loai_trich_doan_id"
                                        rules={[
                                            {
                                            required: true,
                                            message: 'Nội dungTiêu đề trích đoạn là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        {renderTypeExceprt()}
                                    </Form.Item>
                                </Col>
                                <Col xl={24} sm={24} xs={24} className="right-content">
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
                                        <TextArea placeholder="Nhập nội dung câu hỏi" showCount style={{width: '100%', height: 400}}/>
                                        {/* <Dragger {...propsImage} maxCount={1}
                                            listType="picture"
                                            className="upload-list-inline"
                                        >
                                            <p className="ant-upload-drag-icon">
                                            <UploadOutlined />
                                            </p>
                                            <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                        </Dragger> */}
                                    </Form.Item>                         
                                    <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                        {isEdit && <Button style={{marginRight: 6}} shape="round" type="primary" danger onClick={() => {setIsEdit(false); setState({...state, idExceprt: ''}); }} >Hủy</Button> }
                                        {!isEdit ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                                    </Form.Item>
                                </Col>
                            </Row>                                     
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
};

export default Exceprt;