import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import AppFilter from 'components/common/AppFilter';

// antd
import { Table, Tag, Button, Row, Col, notification, Space, Avatar, Form, Modal,
  Input, Upload, message, Select, DatePicker, Checkbox, Timeline, Pagination } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// redux
import * as userAction from '../../../../redux/actions/user';
import { useSelector, useDispatch } from "react-redux";

// hooks
import useDebounce from 'hooks/useDebounce';

const { Option } = Select;
const { Dragger } = Upload;

const StaffPage = () => {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const dispatch = useDispatch();
    const staff = useSelector(state => state.user.staff.result);

    const staffs = useSelector(state => state.user.listStaff.result);
    const errorstaffs = useSelector(state => state.user.listStaff.error);

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

    const defaultForm = {
        gioi_tinh: "Nam",
        trang_thai: true,
        vai_tro: 'nhân viên',
    };
    const [permission, setPermission] = useState([]);
    const [state, setState] = useState({
        isEdit: false,
        idStudent: '',
        idStaff: '',
        idTeacher: '',
        form: defaultForm,
        fileImg: '',
        ngay_sinh: ''
    });

    const [filter, setFilter] = useState({
      trang_thai: '',
      search: '',
      start: '',
      end: '',
    });
    const searchValue = useDebounce(filter.search, 250);

    useEffect(() => {
        dispatch(userAction.getStaffs({ search: filter.search, startDay: filter.start, 
          endDay: filter.end, status: filter.trang_thai, pageIndex: pageIndex - 1, pageSize: pageSize }, (res) => {
            if (res.status === 'success') {
              res.data = (res.data.map((staff) => {
                return {...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id };
              }));
              setData([...res.data]);
              form.resetFields();
              setState({ ...state, isEdit: false });
            }
          }));
    }, [pageSize, pageIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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
          title: 'Họ và tên',
          dataIndex: 'ho_ten',
          key: 'ho_ten',
          responsive: ['md'],
        },
        {
          title: 'Giới tính',
          dataIndex: 'gioi_tinh',
          key: 'gioi_tinh',
          responsive: ['md'],
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          responsive: ['md'],
        },
        {
          title: 'Trạng thái',
          dataIndex: 'trang_thai',
          key: 'trang_thai',
          responsive: ['md'],
          render: (trang_thai) => (
            <Tag color={trang_thai === 1 ? 'green' : trang_thai === 2 ? 'orange' : 'red'} key={trang_thai}>
              {trang_thai === 1 ? "Hoạt động" : trang_thai === 2 ? "Chờ kích hoạt" : "Tạm dừng"}
            </Tag>
          ),
        },
        {
          title: 'Số điện thoại',
          dataIndex: 'sdt',
          key: 'sdt',
          responsive: ['md'],
        },
        {
          title: 'Ngày sinh',
          dataIndex: 'ngay_sinh',
          key: 'ngay_sinh',
          responsive: ['md'],
          render: (ngay_sinh) => (
              <span>{ngay_sinh !== null ? moment(ngay_sinh).format(config.DATE_FORMAT) : ''}</span>
            )
        },
        {
          title: 'Tùy chọn',
          key: 'id',
          dataIndex: 'id',
          // Redirect view for edit
          render: (id, vai_tro) => (
            <Space size="middle">
              <Button  type="button" onClick={() => EditUser(vai_tro)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
              {(vai_tro.trang_thai === 1) && <Button shape="round" type="danger" onClick={() => DeleteUser(id, vai_tro)}>Tạm dừng</Button>}
              {(vai_tro.trang_thai === 0 || vai_tro.trang_thai === 2) && <Button shape="round" type="danger" onClick={() => DeleteUser(id, vai_tro)}>Kích hoạt</Button>}
            </Space>
          ),
        },
    ]

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
      dispatch(userAction.getStaffs({ search: filter.search, startDay: filter.start, 
        endDay: filter.end, status: filter.trang_thai, pageIndex: pageIndex - 1, pageSize: pageSize }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((staff) => {
              return {...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id };
            }));
            setData([...res.data]);
          }
        }));
    }, [filter.trang_thai, filter.start, filter.end]); // eslint-disable-line react-hooks/exhaustive-deps

    useMemo(() => {
      dispatch(userAction.getStaffs({ search: filter.search, startDay: filter.start, 
        endDay: filter.end, status: filter.trang_thai, pageIndex: pageIndex - 1, pageSize: pageSize }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((staff) => {
              return {...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id };
            }));
            setData([...res.data]);
          }
        }));
    }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderGender = () => {
        return (
          <Select
            value={state.form.gioi_tinh}
            onChange={(gioi_tinh) => setState({ ...state, gioi_tinh })}
            placeholder="Chọn giới tính"
          >
            <Option value={"Nam"} >Nam</Option>
            <Option value={"Nữ"} >Nữ</Option>
          </Select>
        );
    };

    const renderStatus = () => {
        return (
          <Select
            value={state.form.trang_thai}
            onChange={(trang_thai) => setState({ ...state, trang_thai, isChanged: true })}
            placeholder="Chọn trạng thái"
          >
            <Option value={1} >Kích hoạt</Option>
            <Option value={0} >Tạm dừng</Option>
          </Select>
        );
    };

    const renderRole = () => {
        return (
          <Select
            value={state.form.vai_tro}
            onChange={(vai_tro) => setState({ ...state, vai_tro: vai_tro })}
            placeholder="Chọn vai trò"
          >
            <Option value={'nhân viên'} >Nhân viên</Option>
          </Select>
        );
    };

    const renderPermission = () => {
      return (
        <Select mode='multiple'
          value={permission}
          onChange={(quyen) => setPermission(quyen)}
          placeholder="Chọn quyền"
        >
          <Option value={'quyen_he_thong'} >Quyền hệ thống</Option>
          <Option value={'quyen_nhan_su'} >Quyền nhân sự</Option>
          <Option value={'quyen_kinh_doanh'} >Quyền kinh doanh</Option>
          <Option value={'quyen_khao_thi'} >Quyền khảo thí</Option>
        </Select>
      );
    };

    const EditUser = (data) => {
      if (data.vai_tro === 'giáo viên') {
        dispatch(userAction.getUserTeacher({ giao_vien_id: data.giao_vien_id }));
        setState({ ...state, isEdit: true, idTeacher: data.giao_vien_id });
      } else if (data.vai_tro === 'nhân viên') {
        setState({ ...state, isEdit: true, idStaff: data.nhan_vien_id });
        dispatch(userAction.getUserStaff({ nhan_vien_id: data.nhan_vien_id }));
      } else {
        setState({ ...state, isEdit: true, idStudent: data.hoc_vien_id });
        dispatch(userAction.getUserStudent({ hoc_vien_id: data.hoc_vien_id }));
      }
      document.getElementsByClassName("cate-form-block")[0].scrollIntoView();
    };

    useEffect(() => {
      if (staff.status === 'success') {  
        // let permissionSub = ['quyen_he_thong', 'quyen_nhan_su', 'quyen_kinh_doanh', 'quyen_khao_thi'];

        form.setFieldsValue({ ...staff.data[0], 'vai_tro': 'nhân viên', 
          // 'quyen': permissionSub, 
          'ngay_sinh': staff.data[0].ngay_sinh !== null ? moment(staff.data[0].ngay_sinh, "YYYY/MM/DD") : null, });
      }
    }, [staff]);  // eslint-disable-line react-hooks/exhaustive-deps

    const DeleteUser = (id, vai_tro) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: vai_tro.trang_thai ? 'Bạn có chắc chắn muốn hủy kích hoạt thành viên này?' : 'Bạn có chắc chắn muốn kích hoạt thành viên này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.status === 'success') {
              dispatch(userAction.getStaffs({ search: filter.search, startDay: filter.start, 
                  endDay: filter.end, status: filter.trang_thai, pageIndex: pageIndex - 1, pageSize: pageSize }, (res) => {
                    if (res.status === 'success') {
                      res.data = (res.data.map((staff) => {
                        return {...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id };
                      }));
                      setData([...res.data]);
                    }
                  }));
                notification.success({
                    message: 'Thành công',
                    description: 'Kích hoạt / Tạm dừng nhân viên thành công',
                })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Kích hoạt / Tạm dừng nhân viên thất bại',
              })
            };
          }
          if (vai_tro.vai_tro === 'nhân viên') {
            dispatch(userAction.deleteStaff({ id: id }, callback))
          } else if (vai_tro.vai_tro === 'giáo viên') {
            dispatch(userAction.deleteTeacher({ id: id }, callback))
          } else {
            dispatch(userAction.deleteStudent({ id: id }, callback))
          }
        },
      });
    };

    const createUser = (values) => {
        const formData = new FormData();
        formData.append('ho_ten', values.ho_ten);
        formData.append('gioi_tinh', (values.gioi_tinh === null || values.gioi_tinh === undefined) ? 'Nam' : values.gioi_tinh );
        formData.append('dia_chi', (values.dia_chi === null || values.dia_chi === undefined) ? '' : values.dia_chi);
        formData.append('email', values.email);
        if (state.isEdit)
          formData.append('trang_thai', values.trang_thai);
        if (state.ngay_sinh !== '') {
          formData.append('ngay_sinh', state.ngay_sinh);
        }
        formData.append('sdt', (values.sdt === null || values.sdt === undefined) ? '':  values.sdt);
        // Note phân quyền id

        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');

        const callback = (res) => {
            if (res.status === 'success') {
                form.resetFields();
                dispatch(userAction.getStaffs({ search: filter.search, startDay: filter.start, endDay: filter.end, 
                  status: filter.trang_thai, pageIndex: pageIndex - 1, pageSize: pageSize }, (res) => {
                    if (res.status === 'success') {
                      res.data = (res.data.map((staff) => {
                        return {...staff, 'vai_tro': 'nhân viên', 'key': staff.mat_khau, 'id': staff.nhan_vien_id };
                      }));
                      setData([...res.data]);
                    }
                  }));
                notification.success({
                  message: 'Thành công',
                  description: state.isEdit ? 'Sửa thông tin thành viên thành công' : 'Thêm thành viên mới thành công', 
                })
            } else {
                notification.error({
                message: 'Thông báo',
                description: state.isEdit ? 'Sửa thông tin thành viên thất bại' : 'Thêm thành viên mới thất bại',
                })
            }
        };

        if (state.isEdit) {
          if (values.vai_tro === 'nhân viên') {
            let Parentpermission = ['quyen_he_thong', 'quyen_nhan_su', 'quyen_kinh_doanh', 'quyen_khao_thi'];
            let remainSubPermission = [];

            if (values.quyen !== undefined) { // số quyền chọn
              values.quyen.map(value => {
                if (values[value] !== undefined) {
                  let permission = ['0', '0'];
                  values[value].map((item) => {
                    if (item === '1') permission[0] = '1';
                    else permission[1] = '1';
                    return null;
                  })
                  formData.append(value, permission.join(''));
                } 
                else {
                  formData.append(value, '00');
                } 
                return null;
              })
            };
            remainSubPermission = Parentpermission.filter(element => values.quyen.indexOf(element) === -1);
            remainSubPermission.map((item) => formData.append(item, '00'));

            dispatch(userAction.editStaff( {formData: formData, nhan_vien_id: state.idStaff}, callback));
          } else if (values.vai_tro === 'giáo viên') {
            dispatch(userAction.editTeacher({formData: formData, giao_vien_id: state.idTeacher}, callback));
          } else {
            dispatch(userAction.editStudent({formData: formData, hoc_vien_id: state.idStudent}, callback));
          }
        } else {
          switch(values.vai_tro) {
            case 'nhân viên':
              let Parentpermission = ['quyen_he_thong', 'quyen_nhan_su', 'quyen_kinh_doanh', 'quyen_khao_thi'];
              let remainSubPermission = [];

              if (values.quyen !== undefined) {
                values.quyen.map(value => {
                  if (values[value] !== undefined) {
                    let permission = ['0', '0'];
                    values[value].map((item) => {
                      if (item === '1') permission[0] = '1';
                      else permission[1] = '1';
                      return null;
                    })
                    formData.append(value, permission.join(''));
                  } else {
                    formData.append(value, '00');
                  } 
                  return null;
                })
              }
              remainSubPermission = Parentpermission.filter(element => values.quyen.indexOf(element) === -1);
              remainSubPermission.map((item) => formData.append(item, '00'));
              dispatch(userAction.createStaff(formData, callback));
              break;
            case 'giáo viên':
              dispatch(userAction.createTeacher(formData, callback));
              break;
            default:
              dispatch(userAction.createStudent(formData, callback));
              break;
          }
        }
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false })
        form.resetFields();
    };

    const onChangeStart = (value, dateString) => {
      setState({...state, ngay_sinh: dateString });
    };

    const onChange = (page) => {
      setPageIndex(page);
    };
    
    const onShowSizeChange = (current, pageSize) => {
      setPageSize(pageSize);
    };

    return (
      <div className='content'>
        <Col xl={24} className="body-content">
              <Row className="app-main">
                  <Col xl={24} sm={24} xs={24}>
                      <AppFilter
                        title="Quản lý Nhân viên"
                        isShowStatus={true}
                        isShowSearchBox={true}
                        isShowDatePicker={true}
                        isRangeDatePicker={true}
                        onFilterChange={(field, value) => onFilterChange(field, value)}
                      />
                  </Col>
              </Row>
          </Col>
          {data.length > 0 && 
            <>
              <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}/>
              <br/>
              <Pagination current={pageIndex} onChange={onChange} total={staffs.total} showSizeChanger onShowSizeChange={onShowSizeChange} defaultPageSize={pageSize}/>
            </>
          }
          {(errorstaffs) && notification.error({
              message: 'Thông báo',
              description: 'Lấy dữ liệu thành viên thất bại',
          })}
          <br/>
          <Row>
              <Col xl={24} sm={24} xs={24} className="cate-form-block">
              {(state.isEdit) ? <h5>Sửa thông tin thành viên</h5> : <h5>Thêm mới thành viên</h5>}  
                  <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createUser}>
                      <Form.Item
                          className="input-col"
                          label="Họ và tên"
                          name="ho_ten"
                          rules={[
                              {
                              required: true,
                              message: 'Họ và tên là trường bắt buộc.',
                              },
                          ]}
                          >
                              <Input placeholder="Nhập họ và tên"/>
                      </Form.Item>
                      <Form.Item
                          className="input-col"
                          label="Giới tính"
                          name="gioi_tinh"
                          rules={[]}
                      >
                          {renderGender()}
                      </Form.Item>     

                      <Form.Item
                          className="input-col"
                          label="Ngày sinh"
                          name="ngay_sinh"
                          rules={[]}
                        >
                            <DatePicker
                              placeholder='Ngày sinh'
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
                      <Form.Item name="sdt" label="Số điện thoại">
                          <Input size="normal" type={"tel"} placeholder='Số điện thoại' />
                      </Form.Item>
                      <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                              { required: true, message: 'E-mail là trường bắt buộc.' },
                              { type: 'email', message: 'Không đúng định dạng E-mail.' },
                          ]}
                      >
                          <Input size="normal" placeholder='Email' />
                      </Form.Item>
                      <Form.Item
                          name="dia_chi"
                          label="Địa chỉ"
                          rules={[]}
                      >
                          <Input size="normal" placeholder='Địa chỉ' />
                      </Form.Item>
                      {/* Vai trò */}
                      <Form.Item
                          name="vai_tro"
                          label="Vai trò"
                          rules={[
                              { required: true, message: 'Vai trò là trường bắt buộc.' },
                          ]}
                          initialValue={state.form.vai_tro}
                      >
                          {renderRole()}
                      </Form.Item>
                      {/* Quyền */}
                      <Form.Item
                          name="quyen"
                          label="Quyền"
                          rules={[
                              { required: state.isEdit ? false : true, message: 'Quyền là trường bắt buộc.' },
                          ]}
                      >
                          {renderPermission()}
                      </Form.Item>
                      {(permission.length > 0) &&
                        <Row>
                          {(permission.filter((item) => item === 'quyen_he_thong')[0] === 'quyen_he_thong' ) && 
                            <Col xl={6} xs={24}>
                              <Form.Item valuePropName="checked"
                                  name="quyen_he_thong"
                                  label="Quyền hệ thống"
                              >
                                  <Checkbox.Group>
                                    <Checkbox value="1">Ghi</Checkbox>
                                    <Checkbox value="2">Đọc</Checkbox>
                                  </Checkbox.Group>
                              </Form.Item>
                            </Col>
                          }
                          {(permission.filter((item) => item === 'quyen_nhan_su')[0] === 'quyen_nhan_su' ) && 
                            <Col xl={6} xs={24}>
                              <Form.Item
                                  name="quyen_nhan_su"
                                  label="Quyền nhân sự"
                                  rules={[]}
                              >
                                  <Checkbox.Group >
                                    <Checkbox value="1">Ghi</Checkbox>
                                    <Checkbox value="2">Đọc</Checkbox>
                                  </Checkbox.Group>
                              </Form.Item>
                            </Col>
                          }
                          {(permission.filter((item) => item === 'quyen_kinh_doanh')[0] === 'quyen_kinh_doanh' ) && 
                            <Col xl={6} xs={24}>
                              <Form.Item
                                  name="quyen_kinh_doanh"
                                  label="Quyền kinh doanh"
                                  rules={[]}
                              >
                                  <Checkbox.Group >
                                    <Checkbox value="1">Ghi</Checkbox>
                                    <Checkbox value="2">Đọc</Checkbox>
                                  </Checkbox.Group>
                              </Form.Item>
                            </Col>
                          }
                          {(permission.filter((item) => item === 'quyen_khao_thi')[0] === 'quyen_khao_thi' ) && 
                            <Col xl={6} xs={24}>
                              <Form.Item
                                  name="quyen_khao_thi"
                                  label="Quyền khảo thí"
                              >
                                  <Checkbox.Group> 
                                    <Checkbox value="1">Ghi</Checkbox>
                                    <Checkbox value="2">Đọc</Checkbox>
                                  </Checkbox.Group>
                              </Form.Item>
                            </Col>
                          }
                        </Row>
                      }
                      {/* Trạng thái */}
                      {(state.isEdit) ?  
                        <Form.Item 
                          initialValue={state.form.trang_thai}
                          label="Trạng thái"
                          className="input-col"
                          name="trang_thai"
                          rules={[]} >
                            {renderStatus()}
                        </Form.Item>  
                      : <Form.Item style={{display: 'none'}}
                          initialValue={state.form.trang_thai}
                          label="Trạng thái"
                          className="input-col"
                          name="trang_thai"
                          rules={[]} >
                            {renderStatus()}
                        </Form.Item> 
                      }
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
                      <Form.Item className="button-col">
                          <Space>
                              <Button shape="round" type="primary" htmlType="submit" >
                              {(state.isEdit ) ? 'Cập nhật' : 'Thêm mới'}   
                              </Button>
                              {(state.isEdit ) 
                              ?  <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
                                  Hủy bỏ
                              </Button>
                              : ''}    
                          </Space>    
                      </Form.Item>
                    <Timeline>
                      <Timeline.Item style={{color: 'red', fontSize: '18px'}}>Lưu ý: Khi sửa phải chọn lại quyền</Timeline.Item>
                    </Timeline>
                  </Form>
              </Col>
          </Row>
      </div>
        
    )
}

export default StaffPage;