import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { NavLink, Link } from 'react-router-dom';
import './css/profile.css';

// helper
import moment from "moment";
import jwt_decode from 'jwt-decode';
import config from '../../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import Hashids from 'hashids';
import axios from 'axios';
import { getDaysArray } from 'helpers/common.helper';

// hooks
import useFetch from 'hooks/useFetch';

// antd
import { Row, Col, Card, Avatar, Tabs, Tag, Form, Input, Divider, Table,
    Upload, message, Select, notification, DatePicker, Button, Layout } from 'antd';
import { UploadOutlined, QuestionCircleOutlined, FileDoneOutlined } from '@ant-design/icons';

// component
import { Container } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, } from 'chart.js';

// redux
import { useDispatch } from "react-redux";
import * as userActions from '../../../../../redux/actions/user';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, PointElement, LineElement, Title);

// line chart
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
    maintainAspectRatio: false,	// Don't maintain w/h ratio
};

const ProfilePage = () => {
    let dataPieChart = [];
    let dataLine = [];
    let info = JSON.parse(localStorage.getItem('userInfo'));
    const json_token = jwt_decode(localStorage.getItem('userToken'));
    const hashids = new Hashids();

    // const courses = useSelector(state => state.course.list.result);

    const [courseOfUser, setCourseOfUser] = useState([]);

    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const dispatch = useDispatch();

    const defaultForm = {
        gioi_tinh: "Nam",
        trang_thai: true,
        vai_tro: 'học viên',
    };

    // eslint-disable-next-line no-unused-vars
    const [time, setTime] = useState(1);
    const [state, setState] = useState({
        ngay_sinh: '',
        form: defaultForm,
        fileImg: '',
        activeTab: '1',
        course: null,
        codeprovince: 'Hà Nội',
        longTime: 0
    });
    const [province, setProvinces] = useState([]);
    const [historyPractice] = useFetch(`/course/thematic_user?khoa_hoc_id=${state.course}`);
    const [DetailHistoryPractice] = useFetch(`/course/thematic_user/v2?loai=${time}`);
    const [DetailHistory] = useFetch(`/student_exam/user?so_ngay=${state.longTime}`);

    const getCourseOfUser = () => {
        axios.get(config.API_URL + `/student/list/course`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
        })
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data.data.length > 0) {
                            setState({ ...state, course: res.data.data[0].khoa_hoc_id });
                            setCourseOfUser(res.data.data);
                        }
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
        // dispatch(courseAction.filterCourses({ status: '', search: '', start: '', end: '' }));
        getCourseOfUser();
        getProvince();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    if (historyPractice.chuyen_de !== undefined && historyPractice.chuyen_de.length > 0) {
        // Pie chart
        dataPieChart = {
            labels: ['Chuyên đề chưa học', 'Chuyên đề đã học'],
            datasets: [
            {
                label: '# of Votes',
                data: [historyPractice.chuyen_de[0].tong_chuyen_de - historyPractice.chuyen_de[0].chuyen_de_da_hoc, historyPractice.chuyen_de[0].chuyen_de_da_hoc],
                backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
            ],
        };
    };

    if (DetailHistoryPractice.length > 0) {
        let labels = [];
        let datasets = [];
        if (time === 1) { // theo ngày
            let currentDate = new Date();
            let followingDate = new Date(new Date().setDate(currentDate.getDate()));
            let priorDate = new Date(new Date().setDate(currentDate.getDate() - 29));
            var daylist = getDaysArray(priorDate, followingDate);

            labels = daylist.map((v) => moment(new Date(v).toISOString()).format(config.DATE_FORMAT_SHORT));
        } else {
            for (var i = 1; i <= 15; i++) labels.push(i);
        }
        

        DetailHistoryPractice.map((item, index) => {
            let temp = item.chuyen_de_da_hocs.map((sample) => sample.chuyen_de_da_hoc);
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            datasets.push({
                label: item.ten_khoa_hoc,
                data: temp,
                borderColor: '#' + randomColor,
                backgroundColor: '#' + randomColor
            })
            return null;
        });

        // eslint-disable-next-line no-unused-vars
        dataLine = {
            labels,
            datasets: datasets,
        };
    };

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'anh_dai_dien',
            key: 'anh_dai_dien',
            responsive: ['md'],
            render: (src) => (
                <Avatar src={src !== null ? config.API_URL + src : defaultImage} size={50} shape='circle' />
            )
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            render: (ten_khoa_hoc, khoa_hoc) => (
                khoa_hoc.loai_kct === 1 ? (
                    <NavLink to={config.BASE_URL + `/luyen-tap/kiem-tra/${hashids.encode(khoa_hoc.khoa_hoc_id)}`}>{ten_khoa_hoc}</NavLink>
                ) : khoa_hoc.loai_kct === 0 ? (
                    <NavLink to={config.BASE_URL + `/luyen-tap/danh-gia-nang-luc/${hashids.encode(khoa_hoc.khoa_hoc_id)}`}>{ten_khoa_hoc}</NavLink>
                ) : (
                    <NavLink to={config.BASE_URL + `/luyen-tap/luyen-tap/${hashids.encode(khoa_hoc.khoa_hoc_id)}`}>{ten_khoa_hoc}</NavLink>
                )
            )
        },
    ];

    const columns2 = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'anh_dai_dien',
            key: 'anh_dai_dien',
            render: (anh_dai_dien) => (
                <Avatar src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage} size={30} shape='circle' />
            )
        },
        {
            title: 'Tên đề thi',
            dataIndex: 'ten_de_thi',
            key: 'ten_de_thi',
            render: (ten_de_thi, item) => (
                <Link to={`/luyen-tap/lich-su/${item.de_thi_id}/${item.dthv_id}`}>{ten_de_thi}</Link>
            )
        },
        {
            title: 'Ngày',
            dataIndex: 'thoi_diem_bat_dau',
            key: 'thoi_diem_bat_dau',
            responsive: ['md'],
            render: (thoi_diem_bat_dau) => (
                <span>{thoi_diem_bat_dau !== null ? moment(thoi_diem_bat_dau).format(config.DATE_FORMAT) : ''}</span>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: 'thoi_gian_lam_bai',
            key: 'thoi_gian_lam_bai',
            responsive: ['md'],
            render: (thoi_gian_lam_bai) => (
                <span>{thoi_gian_lam_bai}</span>
            )
        },
        {
            title: 'Kết quả',
            dataIndex: 'ket_qua_diem',
            key: 'ket_qua_diem',
            responsive: ['md'],
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
          console.log(e);
          setState({ ...state, fileImg: '' });
        },
    };

    const onChangeTab = (value) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setState({...state, activeTab: value});
    };

    const renderGender = () => {
        return (
          <Select
            // value={state.form.gioi_tinh}
            // onChange={(gioi_tinh) => setState({ ...state, gioi_tinh: gioi_tinh })}
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
            >
                {options}
            </Select>
        );
    }

    const renderCourse = () => {
        let options = [];
        if (courseOfUser.length > 0) {
            options = courseOfUser.map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select style={{width: '100%'}} defaultValue={state.course}
                showSearch={false}
                placeholder="Chọn khóa học"
                onChange={(khoa_hoc_id) => setState({...state, course: khoa_hoc_id})}
            >
                {options}
            </Select>
        );
    };

    const onChange = (date, dateString) => {
        setState({ ...state, ngay_sinh: dateString });       
    };

    useEffect(() => {
        if (state.ngay_sinh !== '') {
            let info2 = {
                ...info, ngay_sinh: state.ngay_sinh !== null ? moment(state.ngay_sinh, "YYYY/MM/DD") : moment()
            }
            form.setFieldsValue(info2);
        } else {
            let info2 = {
                ...info, ngay_sinh: info.ngay_sinh !== null ? moment(info.ngay_sinh, "YYYY/MM/DD") : moment()
            }
            form.setFieldsValue(info2);
        }
    }, [info]) // eslint-disable-line react-hooks/exhaustive-deps

    const EditUser = (values) => {
        const callback = (res) => {
            if (res.status === 'success') {
                /// cập nhật lại
                if (json_token.role === 2) {
                    dispatch(userActions.getUserStaff({ nhan_vien_id: info.nhan_vien_id, isUpdateStorage: true }));
                } else if (json_token.role === 1) {
                    dispatch(userActions.getUserTeacher({ giao_vien_id: info.giao_vien_id, isUpdateStorage: true }));
                } else {
                    dispatch(userActions.getUserStudent({ hoc_vien_id: info.hoc_vien_id, isUpdateStorage: true }));
                }
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thông tin thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Cập nhật thông tin thất bại',
                })
            }
        };

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('gioi_thieu', values.gioi_thieu === null ? '' : values.gioi_thieu);
        formData.append('gioi_tinh', values.gioi_tinh === null ? '' : values.gioi_tinh);
        formData.append('ho_ten', values.ho_ten === null ? '' : values.ho_ten);
        formData.append('sdt', values.sdt === null ? '' : values.sdt);
        formData.append('dia_chi', values.dia_chi === null ? '' : values.dia_chi);
        formData.append('ten_dang_nhap', info.ten_dang_nhap === null ? '' : info.ten_dang_nhap);
        // formData.append('mat_khau', values.mat_khau_2);
        formData.append('trang_thai', 1);
        formData.append('ngay_sinh', values.ngay_sinh);
        formData.append('truong_hoc', values.truong_hoc === null ? '' : values.truong_hoc);
        formData.append('ttp_id', values.ttp_id === null ? '' : values.ttp_id);
        // if (state.ngay_sinh !== '')
        //     formData.append('ngay_sinh', state.ngay_sinh);
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        
        if (json_token.role === 2) {
            dispatch(userActions.editStaff({ nhan_vien_id: info.nhan_vien_id, formData: formData }, callback))
        } else if (json_token.role === 1) {
            dispatch(userActions.editTeacher({ giao_vien_id: info.giao_vien_id, formData: formData }, callback))
        } else {
            dispatch(userActions.editStudent({ hoc_vien_id: info.hoc_vien_id, formData }, callback));
        }
    }

    const changePassword = (values) => {
        const callback = (res) => {
            if (res.status === 'success') {
                /// cập nhật lại
                if (json_token.role === 2) {
                    dispatch(userActions.getUserStaff({ nhan_vien_id: info.nhan_vien_id, isUpdateStorage: true }));
                } else if (json_token.role === 1) {
                    dispatch(userActions.getUserTeacher({ giao_vien_id: info.giao_vien_id, isUpdateStorage: true }));
                } else {
                    dispatch(userActions.getUserStudent({ hoc_vien_id: info.hoc_vien_id, isUpdateStorage: true }));
                }
                notification.success({
                    message: 'Thành công',
                    description: 'Đổi mật khẩu thành công',
                });
                form2.resetFields();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Đổi mật khẩu thất bại: Mật khẩu cũ không đúng',
                })
            }
        };

        const formData = {
            "mat_khau_cu": values.mat_khau_cu,
            "mat_khau_moi": values.mat_khau_moi
        }
        
        dispatch(userActions.changePassword(formData, callback))
    }

    const renderCoursePaid = () => {
        return (
            <div className="list-course-cate">
                <div className="wraper wraper-list-course-cate-index">
                    <h2 className="section-title section-title-center">
                        <b></b>
                            <span className="section-title-main">KHÓA HỌC ĐÃ MUA</span>
                        <b></b>
                    </h2>
                    {/* {(courseOfUser.length > 0) ? */}
                        <Table className="table-striped-rows" 
                            columns={columns} dataSource={courseOfUser} 
                        />
                    {/* : <NoRecord title={'Không có dữ liệu'} subTitle={''}/>} */}
                </div>
        </div>
        )
    };

    return (
        <>
            <Layout className="main-app">
                <Helmet>
                    <title>Thông tin tài khoản</title>
                </Helmet>   
                <Content className="app-content">
                    <div className="header-exam">
                        <h1>Tài khoản cá nhân</h1>
                    </div>
                    <Container>
                        <Row>
                            <Col xl={8} sm={24} xs={24} className="cate-form-block">
                                <Card bordered={false} style={{ textAlign: "center" }}>
                                    <Avatar src={info.anh_dai_dien !== null ? config.API_URL + info.anh_dai_dien : defaultImage} size={150} shape='circle' />
                                    <br/>
                                    <h3 className='mt-4'>{info.ho_ten}</h3>
                                    {/* {state.activeTab === '1' && */}
                                        <>
                                            <Card>
                                                <Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Họ và tên: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word', fontSize: 18}}>{info.ho_ten}</h5>
                                                    </Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Email: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.email}</h5>
                                                    </Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Giới tính: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.gioi_tinh}</h5>
                                                    </Row>                 
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Ngày sinh: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{ info.ngay_sinh !== null ? moment(info.ngay_sinh).utc(7).format(config.DATE_FORMAT_SHORT) : ''}</h5>
                                                    </Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Số điện thoại: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.sdt}</h5>
                                                    </Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>   
                                                        {/* <h5 className='bold full-width' >Trường học: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.truong_hoc}</h5>
                                                    </Row>   
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>   
                                                        {/* <h5 className='bold full-width' >Tỉnh/Thành phố: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.tinh}</h5>
                                                    </Row>   
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Vai trò:</h5> */}
                                                        <Tag color={json_token.role === 0 ? 'green' : 'red'} key={json_token.role} style={{fontSize: '16px', padding:'8px', margin: '4px'}}>
                                                            {json_token.role === 0 ? 'Học viên' : 'Giáo viên'}
                                                        </Tag>
                                                    </Row>
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Địa chỉ: </h5> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.dia_chi}</h5>
                                                    </Row>       
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>   
                                                        {/* <h5 className='bold full-width'>Giới thiệu: </h5> */}
                                                        {/* <br/> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{info.gioi_thieu}</h5>
                                                    </Row>  
                                                    <Row style={{width: '100%', justifyContent: 'center'}}>
                                                        {/* <h5 className='bold full-width'>Ngày tạo: </h5> */}
                                                        {/* <span>Lần cuối đăng nhập: </span> */}
                                                        <h5 style={{wordBreak: 'break-word'}}>{moment(info.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}</h5>
                                                    </Row> 
                                                </Row>
                                            </Card>
                                            <Card>
                                                {renderCoursePaid()}
                                            </Card>
                                        </>
                                    {/* } */}
                                </Card>
                            </Col>
                            <Col xl={16} sm={24} xs={24} className="cate-form-block">
                                <Card bordered={false} >
                                    <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                                        <TabPane tab="Thông tin" key="1">
                                            {(historyPractice.chuyen_de !== undefined) && 
                                                <Card >
                                                    <Row>
                                                        <Col xl={12} sm={24} xs={24}>
                                                            <h5 style={{color: 'green', fontWeight: 700}}>Lịch sử ôn luyện</h5>
                                                        </Col>
                                                        <Col xl={12} sm={24} xs={24}>
                                                            {renderCourse()}
                                                        </Col>
                                                    </Row>
                                                    <Row className='chart-history-practice'>
                                                        <Col xl={6} sm={24} xs={24} className="chart-history-practice-left-info">
                                                            <div>
                                                                <p style={{color: 'green'}}>Tổng điểm</p>
                                                                <p><QuestionCircleOutlined/> {historyPractice.diem}</p>
                                                                <p style={{color: 'green'}}>điểm</p>
                                                            </div>
                                                            <div>
                                                                <p style={{color: 'green'}}>Đã làm</p>
                                                                <p><FileDoneOutlined/> {historyPractice.so_bai_lam}</p>
                                                                <p style={{color: 'green'}}>bài kiểm tra</p>
                                                            </div>
                                                        </Col>
                                                        <Divider type="vertical" style={{height: 'auto'}} />
                                                        <Col xl={17} sm={24} xs={24}>
                                                            <div className='pie-chart'>
                                                                <Doughnut data={dataPieChart} options={options}/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            }
                                            <br/>
                                            {/* {DetailHistoryPractice.length > 0 &&
                                                <Card>
                                                    <Row>
                                                        <Col xl={12} sm={24} xs={24}>
                                                            <h5 style={{color: 'green', fontWeight: 700}}>Chi tiết ôn luyện</h5>
                                                        </Col>
                                                        <Col xl={12} sm={24} xs={24}>
                                                            <Select style={{width: '100%'}} defaultValue={time}
                                                                showSearch={false}
                                                                placeholder="Chọn thời gian"
                                                                onChange={(time) => setTime(time)}
                                                            >
                                                                <Option value={1}>Theo ngày</Option>
                                                                <Option value={2}>Theo tuần</Option>
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                    <Row className='chart-history-practice-2'>
                                                        <Line options={options} data={dataLine} />
                                                    </Row>
                                                </Card>
                                            } */}
                                            {/* <br/> */}
                                            <Card>
                                                <Row>
                                                    <Col xl={12} sm={24} xs={24}>
                                                        <h5 style={{color: 'green', fontWeight: 700}}>Chi tiết bài làm</h5>
                                                    </Col>
                                                    <Col xl={12} sm={24} xs={24}>
                                                        <Select style={{width: '100%'}} defaultValue={state.longTime}
                                                            showSearch={false}
                                                            placeholder="Chọn thời gian"
                                                            onChange={(time) => setState({...state, longTime: time})}
                                                        >
                                                            <Option value={0}>Hôm nay</Option>
                                                            <Option value={1}>Hôm qua</Option>
                                                            <Option value={7}>7 ngày gần đây</Option>
                                                            <Option value={15}>15 ngày gần đây</Option>
                                                            <Option value={30}>30 ngày gần đây</Option>
                                                        </Select>
                                                    </Col>
                                                    
                                                    <Table className="table-striped-rows" style={{width: '100%'}}
                                                        columns={columns2} dataSource={DetailHistory} 
                                                    />
                                                    
                                                </Row>
                                            </Card>
                                        </TabPane>
                                        <TabPane tab="Chỉnh sửa" key="2">
                                            <Row>
                                                <Col xl={24} sm={24} xs={24} className="cate-form-block edit-form">
                                                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={EditUser}>
                                                        <Row gutter={25}>
                                                            <Col xl={12} sm={24} xs={24} className="cate-form-block">
                                                                <Form.Item
                                                                    className="input-col"
                                                                    label="Họ và tên"
                                                                    name="ho_ten"
                                                                    >
                                                                        <Input placeholder=""/>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    className="input-col"
                                                                    label="Giới tính"
                                                                    name="gioi_tinh"
                                                                >
                                                                    {renderGender()}
                                                                </Form.Item>
                                                                <Form.Item
                                                                    name="email"
                                                                    label="Email"
                                                                    rules={[
                                                                        { type: 'email', message: 'Không đúng định dạng E-mail.' },
                                                                        { required: true, message: 'Email là trường bắt buộc.' },
                                                                    ]}
                                                                >
                                                                    <Input size="normal" placeholder='Email' />
                                                                </Form.Item>
                                                                <Form.Item className="input-col" name="dia_chi" label='Địa chỉ'>
                                                                    <Input size="normal" placeholder='Địa chỉ' />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xl={12} sm={24} xs={24} className="cate-form-block">
                                                                <Form.Item name="sdt" label="Số điện thoại">
                                                                    <Input size="normal" type={"tel"} placeholder='Số điện thoại' />
                                                                </Form.Item>
                                                                <Form.Item name="ngay_sinh" label="Ngày sinh">
                                                                    <DatePicker onChange={onChange} placeholder='Ngày sinh'/>
                                                                </Form.Item>
                                                                <Form.Item name="truong_hoc" label="Trường học">
                                                                    <Input size="normal" placeholder='Trường học' />
                                                                </Form.Item>
                                                                <Form.Item name="ttp_id" label="Tỉnh/Thành phố" 
                                                                    rules={[{ required: true, message: 'Tỉnh/Thành phố là trường bắt buộc.' }]}
                                                                >
                                                                    {renderProvince()}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xl={24} sm={24} xs={24} className="cate-form-block">
                                                                <Form.Item className="input-col" name="gioi_thieu" label='Giới thiệu'>
                                                                    <TextArea rows={2} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
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
                                                            <Button shape="round" type="primary" htmlType="submit" >
                                                                Cập nhật
                                                            </Button>   
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="Đổi mật khẩu" key="3">
                                            <Form layout="vertical" className="category-form" form={form2} autoComplete="off" onFinish={changePassword}>
                                                <Form.Item
                                                    className="input-col"
                                                    label="Mật khẩu cũ"
                                                    name="mat_khau_cu"
                                                    rules={[
                                                        { required: true, message: 'Mật khẩu cũ là trường bắt buộc.'},
                                                    ]}
                                                >
                                                        <Input.Password placeholder="Mật khẩu cũ" />
                                                </Form.Item>
                                                <Form.Item
                                                    className="input-col"
                                                    label="Mật khẩu mới"
                                                    name="mat_khau_moi"
                                                    rules={[
                                                        { required: true, message: 'Mật khẩu là trường bắt buộc.'},
                                                        { pattern: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), 
                                                            message: 'Mật khẩu chưa đúng dạng gồm: Chữ hoa, chữ thường, ký tự đặc biệt, số, ít nhất 8 kí tự' 
                                                        },
                                                    ]}
                                                >
                                                        <Input.Password placeholder="Mật khẩu mới" />
                                                </Form.Item>
                                                <Form.Item className="button-col" style={{marginBottom: 0}}>
                                                    <Button shape="round" type="primary" htmlType="submit" >
                                                        Cập nhật
                                                    </Button>   
                                                </Form.Item>
                                            </Form>
                                        </TabPane> 
                                    </Tabs>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Content>
            </Layout>
        </>
    )
}

export default ProfilePage;