import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import config from '../../../../configs/index';
import Hashids from 'hashids';
import defaultImage from 'assets/img/default.jpg';
import moment from 'moment';
import axios from 'axios';
import './css/addmodal.scss';
// antd
import { Row, Col, Button, Tabs, Table, Avatar, Modal, Form, Input, Select, Upload, 
  message, notification, Tooltip, Spin, Pagination, Tag } from 'antd';
import { PlusOutlined, UploadOutlined, EyeOutlined, LockOutlined, 
  ExclamationCircleOutlined, UnlockOutlined, RedoOutlined } from '@ant-design/icons';

// component
import AppFilter from 'components/common/AppFilter';
// hooks
import useDebounce from 'hooks/useDebounce';

// redux
import { useSelector, useDispatch } from "react-redux";
import * as examActions from '../../../../redux/actions/exam';
import * as courseActions from '../../../../redux/actions/course';
import * as moduleActions from '../../../../redux/actions/part';
import * as typeExamActions from '../../../../redux/actions/typeExam';
import * as programmeActions from '../../../../redux/actions/programme';
import * as majorActions from '../../../../redux/actions/major';

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Option } = Select;

const ExamDGNLAdminPage = () => {
    const data = [];
    const hashids = new Hashids();

    const [form] = Form.useForm();
    const [formFastExam] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalFastVisible, setIsModalFastVisible] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [programmes, setProgrammes] = useState(null);

    const dispatch = useDispatch();

    const exams = useSelector(state => state.exam.list.result);
    const error = useSelector(state => state.exam.list.error);

    const typeExams = useSelector(state => state.typeExam.list.result);
    const courses = useSelector(state => state.course.list.result);
    const majors = useSelector(state => state.major.list.result);

    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
        kct_id: '',
        trang_thai: '',
        publish: '',
    });
    const searchValue = useDebounce(filter.search, 250);
    const [tabs, setTabs] = useState(0);

    useEffect(() => {
      dispatch(typeExamActions.getTypes());
      dispatch(majorActions.getMajors());
      dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' })); // lấy khoá học đang hoạt động
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [state, setState] = useState({
        fileImg: '',
        showCourse: false,
        showModule: false,
        showThematic: false,
        onlineExam: false,
    });

    if (exams.status === 'success') {
        exams.data.map((exam, index) => {
          data.push({...exam, key: index})
          return null
        }) 
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
      dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' }));
      // Gọi lại API lấy ds đề thi theo filter khoá học
      dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
        status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
      }));
    };

    const handleFastOk = () => {
      if (!spinning) {
        dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' }));
        // Gọi lại API lấy ds đề thi theo filter khoá học
        dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
          status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
        }));
        setIsModalFastVisible(false);
      }
    };
    
    const showFastModal = () => {
      setIsModalFastVisible(true);
    };

  const column1 = [
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
      title: 'Mã đề thi',
      dataIndex: 'de_thi_ma',
      key: 'de_thi_ma',
      responsive: ['md'],
      sorter: (a, b) => a.de_thi_ma.localeCompare(b.de_thi_ma),
    },
    {
      title: 'Tên đề thi',
      dataIndex: 'ten_de_thi',
      key: 'ten_de_thi',
      responsive: ['md'],
      sorter: (a, b) => a.ten_de_thi.localeCompare(b.ten_de_thi),
    },
    {
      title: 'Loại đề thi',
      dataIndex: 'loai_de_thi_id',
      key: 'loai_de_thi_id',
      responsive: ['md'],
      render: (loai_de_thi_id) => (
        <span>{loai_de_thi_id === 5 ? 'Đề thi mẫu ĐGNL': 'Đề thi mẫu ĐGNL BK'}</span>
      )
    },
    {
      title: 'Khóa học',
      dataIndex: 'khoa_hoc',
      key: 'khoa_hoc',
      responsive: ['md'],
      render: (khoa_hoc) => (
        khoa_hoc?.ten_khoa_hoc
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'de_thi_id',
      key: 'de_thi_id',
      responsive: ['md'],
      render: (de_thi_id, de_thi) => (
          <Tag color={!de_thi.xuat_ban ? 'orange' : (de_thi.xuat_ban && !de_thi.trang_thai) ? 'red' : (de_thi.xuat_ban && de_thi.trang_thai) && 'green'} key={de_thi_id}>
              {!de_thi.xuat_ban ? "Chưa xuất bản" : (de_thi.xuat_ban && !de_thi.trang_thai) ? "Đã dừng" : (de_thi.xuat_ban && de_thi.trang_thai) && 'Đang hoạt động'}
          </Tag>
      ),
    }, 
    {
      title: 'Ngày tạo',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      responsive: ['md'],
      render: (date) => (
        moment(date).utc(7).format(config.DATE_FORMAT)
      ),
      sorter: (a, b) => moment(a.ngay_tao).unix() - moment(b.ngay_tao).unix()
    },
    {
      title: 'Tùy chọn',
      key: 'de_thi_id',
      dataIndex: 'de_thi_id',
      width: 50,
      // Redirect view for edit
      render: (de_thi_id, de_thi) => (
        <Col>
          <a href={ de_thi.loai_de_thi_id === 5 ? `/admin/onlineExam/detail/${de_thi.de_thi_id}?loai_de_thi=DGNL`  : `/admin/exam/detail/${de_thi.de_thi_id}?loai_de_thi=DGNL` } type="button" className="ant-btn ant-btn-round ant-btn-primary" 
            style={{display: de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}}
          >
            Xem
          </a>
          {de_thi.trang_thai === false ?
              <Tooltip title={`Mở khóa đề thi`} color="#2db7f5" placement="bottom">
                  <Button shape="round" type="primary" 
                  onClick={() => changeStatus(de_thi_id, de_thi.trang_thai)} style={{display: !de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}} icon={<UnlockOutlined />}>
                </Button> 
              </Tooltip> 
          : 
            <Tooltip title={`Khóa đề thi`} color="#2db7f5" placement="bottom">
              <Button shape="round" type="danger" 
                onClick={() => changeStatus(de_thi_id, de_thi.trang_thai)} style={{display: !de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}} icon={<LockOutlined />}>
              </Button> 
            </Tooltip> 
          }
          <Tooltip title={`Xem lại đề`} color="#2db7f5" placement="bottom">
            <Button shape="round" type="primary" 
              onClick={() => window.open(`/luyen-tap/xem-lai/${hashids.encode(de_thi_id)}`, "_blank")} style={{display: !de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}} icon={<EyeOutlined />}>
            </Button> 
          </Tooltip>
          <Tooltip title={`Sử dụng lại đề`} color="#2db7f5" placement="bottom">
            <Button shape='round' type='primary' onClick={() => reuseExam(de_thi_id)} style={{backgroundColor: 'green', borderColor: 'green', display: !de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}} icon={<RedoOutlined />}></Button>
          </Tooltip>
          <Button shape="round" type="danger" onClick={() => deleteExam(de_thi_id)} style={{marginBottom: '5px'}}>Xóa</Button> 
        </Col>
      ),
    },
  ];

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

  const propsFile = {
      name: 'file',
      action: '#',

      beforeUpload: file => {
        // check loại file => chỉ cho upload file word
        const isDocx = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!isDocx) {
          message.error(`${file.name} có định dạng không phải là file docx`);
          return false;
        }
        // check dung lượng file trên 5mb => không cho upload
        if (file.size > 5242880) {
          message.error(`${file.name} dung lượng file quá lớn`);
          return false;
        }
        return isDocx || Upload.LIST_IGNORE;
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


  const renderTypeExams = () => {
      let options = [];
      if (typeExams.status === 'success') {
        options = typeExams.data.filter((type) => type.loai_de_thi_id > 4).map((type) => (
          <Option key={type.loai_de_thi_id} value={type.loai_de_thi_id} >{type.mo_ta}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn loại đề thi"
          onChange={(loai_de_thi_id) => {
            dispatch(programmeActions.getProgrammes({ status: 1 }, (res) => {
              if (res.status === 'success') {
                switch (loai_de_thi_id) {
                  case 5: // ĐGNL
                    setProgrammes(res.data.filter(item => item.loai_kct === 0));
                    break;
                  case 6: // ĐGTD
                    setProgrammes(res.data.filter(item => item.loai_kct === 3));
                    break;
                }
              }
            }));
          }}
        >
          {options}
        </Select>
      );
  };

  // UI khung chương trình 
  const renderProgramme = () => {
    let options = [];
    if (programmes && programmes.length > 0) {
      options = programmes.map((programme) => {
        if (programme.loai_kct === 0 || programme.loai_kct === 3) { // lấy ra khung chương trình ĐGNL và ĐGTD
          return (
            <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
          )
        }
        return null;
      })
    }
    return (
      <Select
          showSearch={false}
          placeholder="Chọn khung chương trình"
          onChange={(kct_id) => dispatch(courseActions.getCourses({ idkct: kct_id, status: 1, search: '' }))}
      >
        {options}
      </Select>
    );
};

  const renderCourse = () => {
      let options = [];
      if (courses.status === 'success') {
        options = courses.data.filter((course) => course.trang_thai === 1).map((type) => (
          <Option key={type.khoa_hoc_id} value={type.khoa_hoc_id} >{type.ten_khoa_hoc}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn khóa học"
          onChange={(khoa_hoc_id) => {
            dispatch(moduleActions.getModulesByIdCourse({ idCourse: khoa_hoc_id }));
            // lấy danh sách đề thi 'chưa xuất bản'
            dispatch(examActions.filterExamDGNL({ idCourse: khoa_hoc_id, kct_id: filter.kct_id, 
              status: filter.trang_thai, publish: 0, pageIndex: '', pageSize: '' 
            }));
            // set value de_thi_id => null
            formFastExam.setFieldsValue({ de_thi_id: null });
          }}
        >
          {options}
        </Select>
      );
  };

  const renderExam = () => {
    let options = [];
      if (exams.status === 'success') {
        options = exams.data.filter((exam) => exam.xuat_ban === false).map((exam) => (
          <Option key={exam.de_thi_id} value={exam.de_thi_id} >{exam.ten_de_thi}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn đề thi"
        >
          {options}
        </Select>
      );
  }

  const renderAddModal = () => {
      return (
          <>
            <h2 className="form-title">Tạo đề thi</h2>
            <Form form={form} className="login-form app-form" name="login-form" onFinish={createExam}
              labelCol={{
                  span: 6,
              }} 
            >
              <Form.Item label='Mã đề thi' name="de_thi_ma" rules={[{ required: true, message: 'Mã đề thi là bắt buộc'}]}>
                  <Input size="normal" placeholder="Tên đề thi" />
              </Form.Item>
              <Form.Item label='Tên đề thi' name="ten_de_thi" rules={[{ required: true, message: 'Tên đề thi là bắt buộc'}]}>
                  <Input size="normal" placeholder="Tên đề thi" />
              </Form.Item>
              <Form.Item label="Loại đề thi" name="loai_de_thi_id" rules={[{ required: true, message: 'Loại đề thi là bắt buộc'}]}>
                  {renderTypeExams()}
              </Form.Item>
              <Form.Item label="Khung" name="kct_id" rules={[{ required: true, message: 'Khung chương trình là bắt buộc'}]}>
                {renderProgramme()}
              </Form.Item>
              <Form.Item label="Khóa học" name="khoa_hoc_id" rules={[{ required: true, message: 'Khóa học là bắt buộc' }]}>
                {renderCourse()}
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
              <Form.Item className="button-col" style={{marginBottom: 0}}>
                  <Button shape="round" type="primary" htmlType="submit" >Tạo đề thi</Button>
              </Form.Item>
            </Form>
        </>
      )
  };

  // render UI chuyên ngành
  const renderMajor = () => {
    let options = [];
    if (majors.status === 'success') {
      options = majors.data.map((major) => (
        <Option key={major.chuyen_nganh_id} value={major.chuyen_nganh_id} >{major.ten_chuyen_nganh}</Option>
      ))
    }
    return (
      <Select
        showSearch={false}
        placeholder="Chọn Chuyên ngành"
      >
        {options}
      </Select>
    );
  };

  // Modal tạo nhanh đề thi 
  const renderFastAddModal = () => {
    return (
        <Spin spinning={spinning}  tip="Đang xử lý tạo đề thi. Quá trình này sẽ mất thời gian, bạn xin vui lòng chờ">
          <h2 className="form-title">Tạo nhanh đề thi</h2>
          <Form form={formFastExam} className="login-form app-form" name="login-form" onFinish={createFastExam}
            labelCol={{span: 6,}} 
          >
            <Form.Item label="Khung" name="khung_ct" rules={[{ required: true, message: 'Khung chương trình là bắt buộc'}]}>
              {renderProgramme()}
            </Form.Item>
            <Form.Item label="Khóa học" name="khoa_hoc_id" rules={[{ required: true, message: 'Khóa học là bắt buộc' }]}>
              {renderCourse()}
            </Form.Item>
            <Form.Item label="Đề thi" name="de_thi_id" rules={[{ required: true, message: 'Đề thi là bắt buộc' }]}>
              {renderExam()}
            </Form.Item>
            <Form.Item label="Chuyên ngành" name="chuyen_nganh_id" rules={[{ required: true, message: 'Chuyên ngành là bắt buộc' }]}>
              {renderMajor()}
            </Form.Item>
            <Form.Item className="input-col" label="file đề thi" name="anh_dai_dien" rules={[]}>
                <Dragger {...propsFile} maxCount={1}
                    listType="picture"
                    className="upload-list-inline"
                >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text bold">Click hoặc kéo file đề thi vào đây</p>
                    <p className="ant-upload-hint">
                      Định dạng file Docx
                    </p>
                </Dragger>
            </Form.Item>
            <Form.Item className="button-col" style={{marginBottom: 0}}>
              <Button shape="round" type="primary" htmlType="submit" >Tạo đề thi</Button>
            </Form.Item>
          </Form>
        </Spin>
    )
  }
    
  // Tạo nhanh đề thi
  const createFastExam = async (values) => {
    if (state.fileImg === '' || state.fileImg === undefined || state.fileImg === null) {
      notification.warning({
        message: 'Thông báo',
        description: 'Bạn chưa upload file',
      })
      return;
    }
    const formData = new FormData();
    formData.append('file', state.fileImg); 
    formData.append('chuyen_nganh_id', values.chuyen_nganh_id);
    setSpinning(true);
    await axios.post(
      config.API_LATEX + `/${values.de_thi_id}/uploadfile`,
      formData, 
      {
        timeout: 1800000,
        headers: { "content-type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem('userToken')}`, },
      }
    ).then(
      res => {
        if (res.statusText === 'OK' && res.status === 200 && res.data.status === 'success') {
          formFastExam.resetFields();
          dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
            status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
          }));
          notification.success({
              message: 'Thành công',
              description: 'Thêm đề thi mới thành công',
          });
          setIsModalFastVisible(false);
          setSpinning(false);
        } else {
          notification.error({
            message: 'Thêm đề thi mới thất bại.',
            description: `Lỗi ${res?.data?.detail}.Xin vui lòng kiểm tra đề`,
          })
          setSpinning(false);
        }
      }
    )
    .catch(error => {
      notification.error({ message: error.message });
      setSpinning(false);
    });
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
    setPageIndex(1); // reset page index
    dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
      status: filter.trang_thai, publish: tabs, pageIndex: 1, pageSize: pageSize 
    }));
  }, [filter.khoa_hoc_id, filter.trang_thai, searchValue, tabs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
      status: filter.trang_thai, publish: tabs, pageIndex: pageIndex === 0 ? 1 : pageIndex, pageSize: pageSize 
    }));
  }, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const createExam = (values) => {
      const callback = (res) => {
          if (res.statusText === 'OK' && res.status === 200) {
              form.resetFields();
              dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
                status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
              }));
              notification.success({
                  message: 'Thành công',
                  description: 'Thêm đề thi mới thành công',
              });
              setIsModalVisible(false);
          } else {
              notification.error({
                  message: 'Thông báo',
                  description: 'Thêm đề thi mới thất bại. Xin vui lòng kiểm tra lại tiêu chí đề',
              })
          }
      };
      const formData = new FormData();
      formData.append('ten_de_thi', values.ten_de_thi);
      formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
      // formData.append('loai_de_thi_id', values.loai_de_thi_id);
      formData.append('khoa_hoc_id', values.khoa_hoc_id);
      formData.append('kct_id', values.kct_id);
      formData.append('de_mau', 1); // Tạo đề mẫu cho ĐGNL
      if (values.de_thi_ma !== undefined) {
        formData.append('de_thi_ma', values.de_thi_ma !== undefined ? values.de_thi_ma : '');
      }
      
      if (state.fileImg !== '')
        formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
      
      dispatch(examActions.createExam(formData, callback));
  }

  const deleteExam = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa đề thi này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        const callback = (res) => {
          if (res.statusText === 'OK' && res.status === 200) {
            dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
              status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
            }));
            notification.success({
                message: 'Thành công',
                description: 'Xóa đề thi thành công',
            })
          } else {
              notification.error({
                  message: 'Thông báo',
                  description: 'Xóa đề thi thất bại',
              })
          };
        }
        dispatch(examActions.deleteExam({ idExam: id }, callback))
      },
    });
  };

  const changeStatus = (id, trang_thai) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn sử dụng/hủy sử dụng đề thi này không?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        const callback = (res) => {
          if (res.status === 'success') {
            dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
              status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
            }));
            notification.success({
                message: 'Thành công',
                description: trang_thai === 1 ? 'Khóa đề thi thành công' : 'Sử dụng đề thi thành công',
            })
          } else {
              notification.error({
                  message: 'Thông báo',
                  description: trang_thai === 1 ? 'Khóa đề thi thất bại' : 'Sử dụng đề thi thất bại',
              })
          };
        }
        dispatch(examActions.getUsing({ id: id }, callback))
      },
    });
  };

  const reuseExam = (id) => {
    const callback = (res) => {
      if (res.status === 200 && res.statusText === 'OK') {
        dispatch(examActions.filterExamDGNL({ idCourse: filter.khoa_hoc_id, kct_id: filter.kct_id, 
          status: filter.trang_thai, publish: tabs, pageIndex: pageIndex, pageSize: pageSize 
        }));
        notification.success({
          message: 'Thành công',
          description: 'Sử dụng đề thi thành công',
        })
      }
    };

    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn chắc chắn muốn sử dụng lại đề này ?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        dispatch(examActions.reuseExam({ idExam: id }, callback))
      },
    });
  }

  const changeTab = (value) => {
    setPageIndex(1); // reset page index
    setTabs(value);
  }

  // event đổi pageSize
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize)
  };

  // event đổi pageIndex
  const onChange = page => {
    setPageIndex(page);
  };

  return (
    <div className="content">
        <Helmet>
            <title>Quản lý đề thi</title>
        </Helmet>
        <Row className="app-main">
            <Col xl={24} className="body-content">
                <Row>
                    <Col xl={24} sm={24} xs={24}>
                        {courses.status === "success" &&
                          <AppFilter
                            title="Quản lý đề mẫu ĐGNL"
                            isShowCourse={true}
                            isShowStatus={true}
                            isShowSearchBox={false}
                            courses={courses.data.filter((course) => course.loai_kct === 0)}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                          />
                        }
                    </Col>
                </Row>

                <Row className="select-action-group" gutter={[8, 8]}>
                    <Col xl={12} sm={12} xs={24}>
                    </Col>
                    <Col xl={12} sm={12} xs={24} className="right-actions">
                      {/* {renderTypeExams2()} */}
                      <br/>
                      <Button onClick={() => showFastModal()} shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action">
                        Tạo nhanh đề thi
                      </Button>
                      <Button onClick={() => showModal()} shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action">
                        Thêm mới đề thi
                      </Button> 
                      <Modal visible={isModalVisible}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"                                   
                        onOk={handleCancel} 
                        onCancel={handleCancel}
                        maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                        maskClosable={false}
                        footer={null}
                      >
                        {renderAddModal()}
                      </Modal>
                      {/* Modal tạo nhanh đề thi */}
                      <Modal visible={isModalFastVisible}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"                                   
                        onOk={handleFastOk} 
                        width={700}
                        onCancel={handleFastOk}
                        maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                        maskClosable={false}
                        footer={null}
                      >
                        {renderFastAddModal()}
                      </Modal>
                    </Col>
                </Row>

            </Col>
        </Row>
        <Tabs defaultActiveKey="0" type="card" onChange={changeTab}>
            <TabPane tab="Đề chưa xuất bản" key="0">
              <Table className="table-striped-rows" columns={column1} dataSource={data} pagination={false}/>
              <Pagination style={{marginTop: 12}}
                showSizeChanger
                pageSize={pageSize}
                onShowSizeChange={onShowSizeChange}
                onChange={onChange}
                defaultCurrent={pageIndex}
                total={exams?.totalCount}
              />
            </TabPane>
            <TabPane tab="Đề đã xuất bản" key="1">
              <Table className="table-striped-rows" columns={column1} dataSource={data} pagination={false}/>
              <Pagination style={{marginTop: 12}}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                pageSize={pageSize}
                onChange={onChange}
                defaultCurrent={pageIndex}
                total={exams?.totalCount}
              />
            </TabPane>
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}
        </Tabs>
    </div>
  )
}

export default ExamDGNLAdminPage;