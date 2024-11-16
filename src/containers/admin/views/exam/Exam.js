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
  UnlockOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// component
import AppFilter from 'components/common/AppFilter';
// hooks
import useDebounce from 'hooks/useDebounce';

// redux
import { useSelector, useDispatch } from "react-redux";
import * as examActions from '../../../../redux/actions/exam';
import * as courseActions from '../../../../redux/actions/course';
import * as moduleActions from '../../../../redux/actions/part';
import * as thematicActions from '../../../../redux/actions/thematic';
import * as typeExamActions from '../../../../redux/actions/typeExam';
import * as programmeActions from '../../../../redux/actions/programme';

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Option } = Select;

const ExamAdminPage = () => {
    const data = [];
    const hashids = new Hashids();

    const [form] = Form.useForm();
    const [formFastExam] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalFastVisible, setIsModalFastVisible] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const dispatch = useDispatch();

    const programmes = useSelector(state => state.programme.list.result);
    const exams = useSelector(state => state.exam.list.result);
    const error = useSelector(state => state.exam.list.error);

    const typeExams = useSelector(state => state.typeExam.list.result);
    const courses = useSelector(state => state.course.list.result);
    const modules = useSelector(state => state.part.list.result);
    const thematics = useSelector(state => state.thematic.listbyId.result);

    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
        mo_dun_id: '',
        chuyen_de_id: '',
        trang_thai: '',
        search: '',
        start: '',
        end: '',
        typeId: '',
        publish: '',
    });
    const searchValue = useDebounce(filter.search, 250);

    useEffect(() => {
      dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
        idThematic: filter.chuyen_de_id, status: '', search: filter.search, 
        start: filter.start, end: filter.end, idType: filter.typeId, publish: 0, 
        offset: pageIndex, limit: pageSize 
      }));
      dispatch(typeExamActions.getTypes());
      dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' })); // lấy khoá học đang hoạt động
      dispatch(programmeActions.getProgrammes({ status: 1 })); // lấy khung chương trình đang hoạt động
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [state, setState] = useState({
        fileImg: '',
        showCourse: false,
        showModule: false,
        showThematic: false,
        onlineExam: false,
    });
    const [tabs, setTabs] = useState(0);

    if (exams.status === 'success') {
        exams.data.map((exam, index) => {
          if (exam.de_mau === null || exam.de_mau === '' || exam.de_mau === undefined) {
            data.push({...exam, key: index})
          }
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
      dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
        idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
        start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize}));
    };

    const handleFastOk = () => {
      if (!spinning) {
        dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' }));
        // Gọi lại API lấy ds đề thi theo filter khoá học
        dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
          idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
          start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize}));
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
        title: 'Tên đề thi',
        dataIndex: 'ten_de_thi',
        key: 'ten_de_thi',
        responsive: ['md'],
        sorter: (a, b) => a.ten_de_thi.localeCompare(b.ten_de_thi),
      },
      {
          title: 'Loại đề thi',
          dataIndex: 'mo_ta',
          key: 'mo_ta',
          responsive: ['md'],
      },
      {
          title: 'Khóa học',
          dataIndex: 'ten_khoa_hoc',
          key: 'ten_khoa_hoc',
          responsive: ['md'],
          width: 200,
      },
      {
        title: 'Mô đun',
        dataIndex: 'ten_mo_dun',
        key: 'ten_mo_dun',
        responsive: ['md'],
      },
      {
        title: 'Chuyên đề',
        dataIndex: 'ten_chuyen_de',
        key: 'ten_chuyen_de',
        responsive: ['md'],
      },
      {
        title: 'Thời gian',
        dataIndex: 'thoi_gian',
        key: 'thoi_gian',
        responsive: ['md'],
        render: (thoi_gian, de_thi) => (
          <>
            <span>Thời gian thi: {thoi_gian} phút</span>
            <br/>
            <span>Số câu hỏi: {de_thi.so_cau_hoi}</span>
          </>
        )
      },    
      {
        title: 'Trạng thái',
        dataIndex: 'de_thi_id',
        key: 'de_thi_id',
        responsive: ['md'],
        render: (de_thi_id, de_thi) => (
            <Tag color={!de_thi.xuat_ban ? 'orange' : (de_thi.xuat_ban && de_thi.trang_thai === 0) ? 'red' : (de_thi.xuat_ban && de_thi.trang_thai === 1) && 'green'} key={de_thi_id}>
                {!de_thi.xuat_ban ? "Chưa xuất bản" : (de_thi.xuat_ban && de_thi.trang_thai === 0) ? "Đã dừng" : (de_thi.xuat_ban && de_thi.trang_thai === 1) && 'Đang hoạt động'}
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
            <a href={ de_thi.loai_de_thi_id === 5 ? `/admin/onlineExam/detail/${de_thi.de_thi_id}?loai_de_thi=ONLUYEN`  : `/admin/exam/detail/${de_thi.de_thi_id}?loai_de_thi=ONLUYEN` } type="button" className="ant-btn ant-btn-round ant-btn-primary" 
              style={{display: de_thi.xuat_ban ? 'none' : '', marginBottom: '5px'}}
            >
              Xem
            </a>
            {de_thi.trang_thai === 0 ?
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

  // UI khung chương trình 
  const renderProgramme = () => {
      let options = [];
      if (programmes.status === 'success') {
        options = programmes.data.filter((programme) => programme.loai_kct === 2).map((programme) => (
            <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
          ))
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

  // UI khung chương trình 
  const renderProgrammesForCreatFastExam = () => {
    let options = [];
    if (programmes.status === 'success') {
      options = programmes.data.filter((programme) => programme.loai_kct !== 0 && programme.loai_kct !== 3).map((programme) => (
          <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
        ))
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

  // UI khung chương trình cho modal tạo đề thi
  const renderProgrammesForCreateExam = () => {
    let options = [];
    if (programmes.status === 'success') {
      options = programmes.data.filter((programme) => programme.loai_kct === 1).map((programme) => (
          <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
        ))
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

  const renderTypeExams = () => {
      let options = [];
      if (typeExams.status === 'success') {
        options = typeExams.data.filter((item) => item.loai_de_thi_id !== 5 && item.loai_de_thi_id !== 6).map((type) => (
          <Option key={type.loai_de_thi_id} value={type.loai_de_thi_id} >{type.mo_ta}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn loại đề thi"
          onChange={(typeId) => {
              if (typeId === 1) {setState({...state, showThematic: true, showCourse: true, showModule: true, onlineExam: false})} // Loại chuyên đề
              else if (typeId === 2) {setState({...state, showThematic: false, showCourse: true, showModule: true, onlineExam: false})} // Loại mô đun
              else if (typeId === 3) {setState({...state, showThematic: false, showCourse: true, showModule: false, onlineExam: false})} // Loại tổng hợp
              else { // Loại theo phần
                setState({...state, showThematic: false, showCourse: true, showModule: false, onlineExam: true})
              } 
          }}
        >
          {options}
        </Select>
      );
  };

  const renderCourse = () => {
      let options = [];
      if (courses.status === 'success') {
        options = courses.data.map((type) => (
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
            dispatch(examActions.filterExam({ idCourse: khoa_hoc_id, idModule: filter.mo_dun_id, 
              idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
              start: filter.start, end: filter.end, idType: filter.typeId, publish: 0, offset: '', limit: ''}));
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
        options = exams.data.map((exam) => (
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

  const renderModule = () => {
      let options = [];
      if (modules.status === 'success') {
        options = modules.data.map((type) => (
          <Option key={type.mo_dun_id} value={type.mo_dun_id} >{type.ten_mo_dun}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn mô đun"
          onChange={(mo_dun_id) => {
              dispatch(thematicActions.getThematicsByIdModule({ idModule: mo_dun_id }))
          }}
        >
          {options}
        </Select>
      );
  };

  const renderThematic = () => {
      let options = [];
      if (thematics.status === 'success') {
        options = thematics.data.thematics.map((thematic) => (
          <Option key={thematic.chuyen_de_id} value={thematic.chuyen_de_id} >{thematic.ten_chuyen_de}</Option>
        ))
      }
      return (
        <Select
          showSearch={false}
          placeholder="Chọn mô đun"
        >
          {options}
        </Select>
      );
  };

  const renderAddModal = () => {
      return (
          <>
              <h2 className="form-title">Tạo đề thi</h2>
              <Form form={form} className="login-form app-form" name="login-form" onFinish={createExam}
                  labelCol={{span: 6,}}>
                  <Form.Item label='Mã đề thi' name="de_thi_ma" rules={[{ required: true, message: 'Mã đề thi là bắt buộc'}]}>
                      <Input size="normal" placeholder="Mã đề thi" />
                  </Form.Item>
                  <Form.Item label='Tên đề thi' name="ten_de_thi" rules={[{ required: true, message: 'Tên đề thi là bắt buộc'}]}>
                      <Input size="normal" placeholder="Tên đề thi" />
                  </Form.Item>
                  <Form.Item label="Loại đề thi" name="loai_de_thi_id" rules={[{ required: true, message: 'Loại đề thi là bắt buộc'}]}>
                      {renderTypeExams()}
                  </Form.Item>
                  <Form.Item label="Khung" name="khung_ct" rules={[{ required: state.showCourse, message: 'Loại đề thi là bắt buộc'}]}
                    style={{display: state.showCourse ? '' : 'none'}}>
                      {state.onlineExam ? renderProgrammesForCreateExam() : renderProgramme()}
                  </Form.Item>
                  <Form.Item label="Khóa học" name="khoa_hoc_id" rules={[{ required: state.showCourse, message: 'Khóa học là bắt buộc' }]}
                      style={{display: state.showCourse ? '' : 'none'}}>
                      {renderCourse()}
                  </Form.Item>
                  <Form.Item label="Mô đun" name="mo_dun_id" rules={[{ required: state.showModule, message: 'Mô đun là bắt buộc' }]}
                      style={{display: state.showModule ? '' : 'none'}}>
                      {renderModule()}
                  </Form.Item>
                  <Form.Item label="Chuyên đề" name="chuyen_de_id" rules={[{ required: state.showThematic, message: 'Chuyên đề là bắt buộc' }]}
                      style={{display: state.showThematic ? '' : 'none'}}>
                      {renderThematic()}
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

  // Modal tạo nhanh đề thi 
  const renderFastAddModal = () => {
    return (
        <Spin spinning={spinning}  tip="Đang xử lý tạo đề thi. Quá trình này sẽ mất thời gian, bạn xin vui lòng chờ">
          <h2 className="form-title">Tạo nhanh đề thi</h2>
          <Form form={formFastExam} className="login-form app-form" name="login-form" onFinish={createFastExam}
            labelCol={{span: 6,}} 
          >
            <Form.Item label="Khung" name="khung_ct" rules={[{ required: true, message: 'Loại đề thi là bắt buộc'}]}>
              {renderProgrammesForCreatFastExam()}
            </Form.Item>
            <Form.Item label="Khóa học" name="khoa_hoc_id" rules={[{ required: true, message: 'Khóa học là bắt buộc' }]}>
              {renderCourse()}
            </Form.Item>
            <Form.Item label="Đề thi" name="de_thi_id" rules={[{ required: true, message: 'Khóa học là bắt buộc' }]}>
              {renderExam()}
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
        if (res.statusText === 'OK' && res.status === 200) {
          formFastExam.resetFields();
          dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
              idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
              start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, 
              offset: pageIndex, limit: pageSize
          }));
          notification.success({
              message: 'Thành công',
              description: 'Thêm đề thi mới thành công',
          });
          setIsModalFastVisible(false);
          setSpinning(false);
        } else {
            notification.error({
                message: 'Thông báo',
                description: 'Thêm đề thi mới thất bại. Xin vui lòng kiểm tra lại tiêu chí đề',
            })
        }
      }
    )
    .catch(error => {
      notification.error({ message: error.message })
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
    setPageIndex(0); // reset page index
    dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
      idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
      start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: '', limit: pageSize
    }));
  }, [filter.khoa_hoc_id, filter.mo_dun_id, filter.chuyen_de_id, filter.trang_thai, filter.start, filter.end, filter.typeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
      idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
      start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize}));
}, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPageIndex(0); // reset page index
    dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
      idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
      start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: '', limit: pageSize
    }));
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const createExam = (values) => {
      const callback = (res) => {
          if (res.statusText === 'OK' && res.status === 200) {
              form.resetFields();
              dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
                  idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
                  start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize
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
      formData.append('loai_de_thi_id', values.loai_de_thi_id);
      if (values.de_thi_ma !== undefined) {
        formData.append('de_thi_ma', values.de_thi_ma !== undefined ? values.de_thi_ma : '');
      }

      if (state.showModule && state.showCourse && state.showThematic) {
        formData.append('khoa_hoc_id', values.khoa_hoc_id);
        formData.append('mo_dun_id', values.mo_dun_id);
        formData.append('chuyen_de_id', values.chuyen_de_id);
      }
      else if (state.showModule && state.showCourse) {
        formData.append('khoa_hoc_id', values.khoa_hoc_id);
        formData.append('mo_dun_id', values.mo_dun_id);
      }
      else if (state.showCourse) formData.append('khoa_hoc_id', values.khoa_hoc_id);
      
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
              dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
                idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
                start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize }));
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
              dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
                idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
                start: filter.start, end: filter.end, idType: filter.typeId, publish: tabs, offset: pageIndex, limit: pageSize
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
        dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
          idThematic: filter.chuyen_de_id, status: filter.trang_thai, search: filter.search, 
          start: filter.start, end: filter.end, idType: filter.typeId, publish: filter.publish,
          offset: pageIndex, limit: pageSize
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
    setPageIndex(0); // reset page index
    setTabs(value);
    dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
      idThematic: filter.chuyen_de_id, status: '', search: filter.search, 
      start: filter.start, end: filter.end, idType: filter.typeId, publish: value,
      offset: 0, limit: 10,
    }));
  }

  // event đổi pageSize
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize)
  };

  // event đổi pageIndex
  const onChange = page => {
    setPageIndex(page - 1);
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
                            title="Quản lý đề thi"
                            isShowCourse={true}
                            isTypeExam={true}
                            isShowStatus={true}
                            isShowSearchBox={true}
                            isShowDatePicker={true}
                            isRangeDatePicker={true}
                            courses={courses.data}
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
                          footer={null}>
                          {renderAddModal()}
                      </Modal>
                      {/* Modal tạo nhanh đề thi */}
                      <Modal visible={isModalFastVisible}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"                                   
                          onOk={handleFastOk} 
                          onCancel={handleFastOk}
                          maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                          maskClosable={false}
                          footer={null}>
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
                defaultCurrent={pageIndex + 1}
                total={exams?.total}
              />
            </TabPane>
            <TabPane tab="Đề đã xuất bản" key="1">
              <Table className="table-striped-rows" columns={column1} dataSource={data} pagination={false}/>
              <Pagination style={{marginTop: 12}}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                pageSize={pageSize}
                onChange={onChange}
                defaultCurrent={pageIndex + 1}
                total={exams?.total}
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

export default ExamAdminPage;