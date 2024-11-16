import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import AppFilter from 'components/common/AppFilter';
import ReactExport from "react-export-excel";

// antd
import { Table, Tag, Button, Row, Col, notification, Space, Form, Input, Avatar, 
  Upload, message, Select, DatePicker, Pagination, Modal, InputNumber } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// redux
import * as userAction from '../../../../redux/actions/user';
import * as courseActions from '../../../../redux/actions/course';
import { useSelector, useDispatch } from "react-redux";

// hooks
import useDebounce from 'hooks/useDebounce';

const { Option } = Select;
const { Dragger } = Upload;
const { confirm } = Modal;

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const AccountPage = () => {
    let status = window.location.href.split('/')[7];

    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [formFastlyCreateModal] = Form.useForm();

    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [visiable, setVisible] = useState(false);
    const [visiableFastlyCreateAccount, setVisibleFastlyCreateAccount] = useState(false);
    const [province, setProvinces] = useState([]);

    const student = useSelector(state => state.user.user.result);
    const courses = useSelector(state => state.course.list.result);
    const students = useSelector(state => state.user.listUser.result);
    const errorusers = useSelector(state => state.user.listUser.error);

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
        vai_tro: 'Học viên'
    };
    const [state, setState] = useState({
        isEdit: false,
        idStudent: '',
        idStaff: '',
        idTeacher: '',
        form: defaultForm,
        fileImg: '',
        ngay_sinh: '',
        codeprovince: 1,
        courseId: 1,
    });

    const [filter, setFilter] = useState({
      trang_thai: status !== undefined ? status : '',
      search: '',
      start: '',
      end: '',
      tinh: '',
    });
    const searchValue = useDebounce(filter.search, 250);

    const getProvince = () => {
      axios.get(config.API_URL + '/province', )
        .then(
            res => {

                if (res.status === 200 && res.statusText === 'OK') {
                    res.data.data.push({ten: 'Tất cả', ttp_id: ''});
                    setProvinces(res.data.data);
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi lấy dữ liệu',
                    })
                }
            }
        )
        .catch(error => notification.error({ message: error.message }));
    }

    useEffect(() => {
      dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }, (res) => {
        form.resetFields();
        setState({ ...state, isEdit: false });
      }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        dispatch(userAction.getStudents({ search: filter.search, startDay: filter.start, 
          endDay: filter.end, status: filter.trang_thai, pageIndex: pageIndex, 
          pageSize: pageSize, province: filter.tinh }, (res) => {
            if (res.status === 'success') {
              res.data = (res.data.map((student) => {
                return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
              }));
              setData([...res.data]);
            }
          }));
    }, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

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
          title: 'Trường học',
          dataIndex: 'truong_hoc',
          key: 'truong_hoc',
          responsive: ['md'],
        },
        {
          title: 'Tỉnh',
          dataIndex: 'tinh',
          key: 'tinh',
          responsive: ['md'],
        },
        {
          title: 'Trạng thái',
          dataIndex: 'trang_thai',
          key: 'trang_thai',
          responsive: ['md'],
          render: (trang_thai) => (
            <Tag color={trang_thai === true ? 'green' : trang_thai === false ? 'red' : 'orange'} key={trang_thai}>
              {trang_thai === true ? "Hoạt động" : trang_thai === false ? "Tạm dừng" : "Chờ kích hoạt"}
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
              <Col style={{display: 'flex', flexDirection: 'column'}}>
                  <Button  type="button" onClick={() => EditUser(vai_tro)} className="ant-btn ant-btn-round ant-btn-primary" style={{marginBottom: '5px'}}>Sửa</Button>
                  <Button  type="danger" onClick={() => DeleteStudent(id)} style={{marginBottom: '5px'}} shape="round">Xóa</Button>
                  {(vai_tro.trang_thai === true) && <Button shape="round" type="danger" onClick={() => DeleteUser(id, vai_tro)}>Tạm dừng</Button>}
                  {(vai_tro.trang_thai === false || vai_tro.trang_thai === 2) && <Button shape="round" type="danger" onClick={() => DeleteUser(id, vai_tro)}>Kích hoạt</Button>}
              </Col>
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
      dispatch(userAction.getStudents({ status: filter.trang_thai, search: filter.search,
        startDay: filter.start, endDay: filter.end, pageIndex: pageIndex, 
        pageSize: pageSize, province: filter.tinh }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((student) => {
              return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
            }));
            setData([...res.data]);
          }
        }));
        getProvince();
    }, [filter.trang_thai, filter.start, filter.end, filter.tinh]); // eslint-disable-line react-hooks/exhaustive-deps

    useMemo(() => {
      dispatch(userAction.getStudents({ status: filter.trang_thai, search: filter.search,
        startDay: filter.start, endDay: filter.end, pageIndex: pageIndex, 
        pageSize: pageSize, province: filter.tinh }, (res) => {
          if (res.status === 'success') {
            res.data = (res.data.map((student) => {
              return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
            }));
            setData([...res.data]);
          }
        }));
        getProvince();
    }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderCourses = () => {
      let options = [];
      if (courses.status === 'success') {
        options = courses.data.map((course) => (
          <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
        ))
      }
      return (
        <Select 
          showSearch={true} value={state.courseId}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          onChange={(khoa_hoc_id) => setState({khoa_hoc_id, ...state })}
          placeholder="Chọn khóa học"
          mode="multiple"
        >
          {options}
        </Select>
      );
    }

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

    const renderProvince = () => {
      let options = [];
      if (province.length !== 0) {
          options = province.map((province) => (
              <Option key={province.ttp_id} value={province.ttp_id} >{province.ten}</Option>
          ));
      }
      return (
          <Select style={{width: '100%'}} defaultValue={state.codeprovince}
              showSearch={true}
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              placeholder="Chọn tỉnh / thành phố"
              onChange={(id) => setState({ ...state, codeprovince: id })}
          >
              {options}
          </Select>
      );
  }

    const renderStatus = () => {
        return (
          <Select
            value={state.form.trang_thai}
            onChange={(trang_thai) => setState({ ...state, trang_thai, isChanged: true })}
            placeholder="Chọn trạng thái"
          >
            <Option value={1} >Hoạt động</Option>
            <Option value={0} >Tạm dừng</Option>
            <Option value={2} >Chờ kích hoạt</Option>
          </Select>
        );
    };

    const renderRole = () => {
        return (
          <Select
            defaultValue={state.form.vai_tro}
            onChange={(vai_tro) => setState({ ...state, vai_tro: vai_tro })}
            placeholder="Chọn vai trò"
          >
            <Option value={'Học viên'} >Học viên</Option>
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
      if (student.status === 'success'){
        form.setFieldsValue({ ...student.data, 
          'vai_tro': 'học viên', 
          'ngay_sinh': student.data.ngay_sinh !== null ? moment(student.data.ngay_sinh, "YYYY/MM/DD") : null,
          'gioi_tinh': student.data.gioi_tinh !== null ? student.data.gioi_tinh : 'Nam',
          'ttp_id': student.data.tinh !== null ? student.data.tinh : 1
        });
      }
    }, [student]);  // eslint-disable-line react-hooks/exhaustive-deps
    
    const DeleteUser = (id, vai_tro) => {
      confirm({
          icon: <ExclamationCircleOutlined />,
          content: vai_tro.trang_thai === 1 ? 'Bạn có chắc chắn muốn hủy kích hoạt thành viên này?' : 'Bạn có chắc chắn muốn kích hoạt thành viên này?',
          okText: 'Đồng ý',
          cancelText: 'Hủy',
          onOk() {
            const callback = (res) => {
              if (res.status === 'success') {
                dispatch(userAction.getStudents({ status: filter.trang_thai, search: filter.search,
                  startDay: filter.start, endDay: filter.end, pageIndex: pageIndex, 
                  pageSize: pageSize, province: filter.tinh }, (res) => {
                    if (res.status === 'success') {
                      res.data = (res.data.map((student) => {
                        return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
                      }));
                      setData([...res.data]);
                    }
                  }));
                notification.success({
                    message: 'Thành công',
                    description: 'Kích hoạt / Tạm dừng học viên thành công',
                })
              } else {
                notification.error({
                  message: 'Thông báo',
                  description: 'Kích hoạt / Tạm dừng học viên thất bại',
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

    const DeleteStudent = (id) => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chắn muốn xóa học viên này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.status === 'success') {
              dispatch(userAction.getStudents({ status: filter.trang_thai, search: filter.search,
                startDay: filter.start, endDay: filter.end, pageIndex: pageIndex, 
                pageSize: pageSize, province: filter.tinh }, (res) => {
                  if (res.status === 'success') {
                    res.data = (res.data.map((student) => {
                      return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
                    }));
                    setData([...res.data]);
                  }
                }));
              notification.success({
                  message: 'Thành công',
                  description: 'Xóa học viên thành công',
              })
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Xóa học viên thất bại',
              })
            };
          }
          dispatch(userAction.deleteStudent2({ id: id }, callback))
        },
      });
    }

    const createUser = (values) => {
        const formData = new FormData();
        formData.append('ho_ten', values.ho_ten);
        formData.append('gioi_tinh', (values.gioi_tinh === null || values.gioi_tinh === undefined) ? 'Nam' : values.gioi_tinh );
        formData.append('dia_chi', (values.dia_chi === null || values.dia_chi === undefined) ? '' : values.dia_chi);
        formData.append('truong_hoc', (values.truong_hoc === null || values.truong_hoc === undefined) ? '' : values.truong_hoc);
        formData.append('ttp_id', state.codeprovince);
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
                setState({ ...state, isEdit: false, idStudent: '' });
                dispatch(userAction.getStudents({ status: filter.trang_thai, search: filter.search,
                  startDay: filter.start, endDay: filter.end, pageIndex: pageIndex, 
                  pageSize: pageSize, province: filter.tinh }, (res) => {
                    if (res.status === 'success') {
                      res.data = (res.data.map((student) => {
                        return {...student, 'vai_tro': 'học viên', 'key': student.hoc_vien_id, 'id': student.hoc_vien_id };
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
          switch(values.vai_tro) {
            case 'nhân viên':
              dispatch(userAction.editStaff( {formData: formData, nhan_vien_id: state.idStaff}, callback));
              break;
            case 'giáo viên':
              dispatch(userAction.editTeacher({formData: formData, giao_vien_id: state.idTeacher}, callback));
              break;
            default:
              dispatch(userAction.editStudent({formData: formData, hoc_vien_id: state.idStudent}, callback));
              break;
          }
        } else {
          switch(values.vai_tro) {
            case 'nhân viên':
              formData.append('phan_quyen_id', 3);
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
    
    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const handleOk = () => {
      setVisible(false);
    };
  
    const handleCancel = () => {
        setVisible(false);
    };
  
    const showModal = () => {
        setVisible(true);
    };

    const modalCourse = () => {
      return (
        <Form form={form2} className="login-form app-form" name="login-form" onFinish={onSubmitAddStudentToCourse}>
          <h2 className="form-title">Thêm học viên vào khóa học</h2>
            <Form.Item name="khoa_hoc" label="Khóa học" rules={[{ required: true, message: 'Bạn chưa chọn khóa học'}]}>
              {renderCourses()}
            </Form.Item>
            <Form.Item className="center-buttons">
                <Button type="primary" shape="round" htmlType="submit" className="btn-login">
                    Thêm
                </Button>
            </Form.Item>
        </Form>
      )
    };

    const onSubmitAddStudentToCourse = (values) => {

      const callback = (res) => {
        // lấy tên khoá học bằng với idCourse

        if (res.status === 200 && res.statusText === 'OK' && res.data.status === 'success') {
          notification.success({
            message: 'Thành công',
            description: `Thêm học viên vào khóa học thành công`, 
          });
          setVisible(false);
          setSelectedRowKeys([]);
        } else {
          notification.error({
            message: 'Thông báo',
            description: `Thêm học viên vào khóa học thất bại`, 
          });
        }
      };

      if (selectedRowKeys.length === 0) {
        notification.warning({
          message: 'Thông báo',
          description: 'Bạn chưa chọn học viên nào', 
        });
        return;
      }
      const listStudent = {
        hoc_vien_id: selectedRowKeys.join(',')
      };
      values.khoa_hoc.map((khoa_hoc_id) => {
        dispatch(courseActions.addStudentToCourse({ data: listStudent, idCourse: khoa_hoc_id }, callback));
        return null;
      });
    };

    const exportFile = () => {
      dispatch(userAction.getStudents({ search: filter.search, startDay: filter.start, endDay: filter.end, status: filter.trang_thai, 
        pageIndex: 0, pageSize: 100000, province: filter.tinh }, (res) => {
          if (res.status === 'success') {
            setAllData(res.data);
            setTimeout(() => document.getElementsByClassName('download')[0].click(), 1000 * 5);
          }
        }));
    }

    const addNew = () => {
      setState({ ...state, isEdit: false });
      form.resetFields();
      document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
    }

    const modalFastlyCreateAccount = () => {
      return (
        <Form form={formFastlyCreateModal} className="login-form app-form" name="login-form" onFinish={onSubmitFastlyCreateAccount}>
          <h3 className="form-title">Tạo nhanh học viên</h3>
            <Form.Item name="tien_to" label="Tiền tố" rules={[{ required: true, message: 'Bạn chưa nhập tiền tố'}]}>
              <Input size="normal" placeholder="Tiền tố" />
            </Form.Item>
            <Form.Item name="so_luong" label="Số lượng" rules={[{ required: true, message: 'Bạn chưa nhập số lượng'}]}>
              <InputNumber size="normal" placeholder="Số lượng" />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="mat_khau" rules={[
                { required: true, message: 'Mật khẩu là trường bắt buộc' }, 
                { pattern: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), 
                        message: 'Mật khẩu chưa đúng dạng gồm: Chữ hoa, chữ thường, ký tự đặc biệt, số, ít nhất 8 kí tự' 
                }
                ]}
            >
                <Input.Password size="normal" placeholder='Mật khẩu' iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </Form.Item>
            <Form.Item className="center-buttons">
                <Button type="primary" shape="round" htmlType="submit" className="btn-login">
                    Thêm
                </Button>
            </Form.Item>
        </Form>
      )
    };

    // Hàm call api tạo nhanh tài khoản
    const onSubmitFastlyCreateAccount = () => {
      axios.post(config.API_URL + '/student/create-by-prefix', 
        formFastlyCreateModal.getFieldsValue(), {headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }})
        .then(
            res => {
                if (res.status === 200 && res.statusText === 'OK') {
                  setVisibleFastlyCreateAccount(false);
                  notification.success({
                    message: 'Thành công',
                    description: 'Tạo tài khoản thành công',
                  });
                  window.location.reload();
                } else {
                  notification.error({
                      message: 'Lỗi',
                      description: 'Tạo tài khoản chưa thành công',
                  })
                }
            }
        )
        .catch(error => notification.error({ message: error.message }));
    }

    return (
      <div className='content'>
        <Col xl={24} className="body-content">
          <Row className="app-main">
              <Col xl={24} sm={24} xs={24}>
                  <AppFilter
                    title="Quản lý học viên"
                    isShowStatus={true}
                    isShowSearchBox={true}
                    isShowDatePicker={true}
                    isRangeDatePicker={true}
                    isSearchProvinces={true}
                    // dataExportStudent={data.length > 0 ? data : []}
                    provinces={province.length > 0 ? province: []}
                    onFilterChange={(field, value) => onFilterChange(field, value)}
                  />
              </Col>
          </Row>
        </Col>
          <Button style={{marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => showModal()} >Thêm vào khóa học</Button>
          <Button type='primary' onClick={() => exportFile()} style={{marginRight: '10px'}}>Trích xuất file</Button>
          <Button type='primary' onClick={() => setVisibleFastlyCreateAccount(true)} style={{marginRight: '10px'}}>Tạo nhanh học viên</Button>
          <Button type='primary' onClick={() => addNew()} style={{marginRight: '10px'}}>Thêm học viên mới</Button>
          <span>Số học viên đã chọn: {selectedRowKeys.length}/{students.totalCount}</span>
          <ExcelFile filename={'Quản lý học viên'} element={<Button className='download' style={{display: 'none'}}></Button>}>
              <ExcelSheet data={allData.length > 0 && allData} name={"Quản lý học viên"}>
                  <ExcelColumn label="Họ tên" value="ho_ten"/>
                  <ExcelColumn label="Giới tính" value="gioi_tinh"/>
                  <ExcelColumn label="Trường học" value="truong_hoc"/>
                  <ExcelColumn label="Tỉnh/Thành phố" value="tinh"/>
                  <ExcelColumn label="Ngày sinh" value={(col) => col.ngay_sinh !== null ? moment(col.ngay_sinh).format(config.DATE_FORMAT) : ''}/>
                  <ExcelColumn label="Email" value="ten_khoa_hoc"/>    
                  <ExcelColumn label="Số điện thoại" value="sdt"/>
              </ExcelSheet>
          </ExcelFile>
        <br/>
          <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false} rowSelection={rowSelection}/>
          <br/>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Pagination current={pageIndex} onChange={onChange} total={students.totalCount} onShowSizeChange={onShowSizeChange} showSizeChanger defaultPageSize={pageSize}/>
            <span style={{marginLeft: '10px'}}>Tổng số học viên: <b>{students.totalCount}</b></span>
          </div>
          {(errorusers) && notification.error({
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
                      >
                          {renderGender()}
                      </Form.Item>    

                      <Form.Item
                          className="input-col"
                          label="Ngày sinh"
                          name="ngay_sinh"
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
                      <Form.Item name="sdt" label="Số điện thoại" 
                          rules={[
                            { pattern: new RegExp(/^([0-9])([^\s-]).{8,}$/), 
                              message: 'Số điện thoại chưa đúng dạng gồm: số, ít nhất 9 kí tự' 
                            },
                          ]}
                      >
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
                          name="password"
                          label="Mật khẩu"
                          rules={[
                              { required: true, message: 'Mật khẩu là trường bắt buộc.' },
                          ]}
                          initialValue={'Enno@123'}
                      >
                          <Input size="normal" placeholder='Mật khẩu' defaultValue={'Enno@123'} disabled={true}/>
                      </Form.Item>
                      <Form.Item
                          name="truong_hoc"
                          label="Trường học"
                          rules={[]}
                      >
                          <Input size="normal" placeholder='Trường học' />
                      </Form.Item>
                      <Form.Item
                          name="ttp_id"
                          label="Tỉnh/Thành phố"
                          rules={[]}
                      >
                          {renderProvince()}
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
                  </Form>
              </Col>
          </Row>
          <Modal
            className="cra-auth-modal"
            wrapClassName="cra-auth-modal-container"
            maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
            maskClosable={false}
            footer={null}
            mask={true}
            centered={true}
            visible={visiable}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
          >
            {modalCourse()}
          </Modal>

          <Modal
            className="cra-auth-modal"
            wrapClassName="cra-auth-modal-container"
            maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
            maskClosable={false}
            footer={null}
            mask={true}
            centered={true}
            visible={visiableFastlyCreateAccount}
            onOk={() => setVisibleFastlyCreateAccount(false)}
            onCancel={() => setVisibleFastlyCreateAccount(false)}
            width={500}
          >
            {modalFastlyCreateAccount()}
          </Modal>
      </div>
    )
}

export default AccountPage;