import React, { useEffect, useState } from "react";
import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import { Helmet } from 'react-helmet';
import { Link, useParams } from "react-router-dom";

// helper
import Hashids from 'hashids';
import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';
// component
import { Layout, Row, Col, Button, Input, Select, Form, Menu } from 'antd';
import CarouselCustom from 'components/parts/Carousel/Carousel';
// import CardSlider from 'components/parts/CardSlider/CardSlier';
import { BookOutlined, BarsOutlined, } from '@ant-design/icons';

// hooks
import useFetch from "hooks/useFetch";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import * as receiptAction from '../../../../redux/actions/receipt';
import Statisic from "components/parts/statisic/Statisic";

const { Content } = Layout;
const { Option } = Select;

const CourseCard = ({ course, programType }) => {
    const hashids = new Hashids();

    const getLinkPath = () => {
        const encodedId = hashids.encode(course.khoa_hoc_id);
        switch (programType.id) {
            case 0: return `/luyen-tap/danh-gia-nang-luc/${encodedId}`;
            case 1: return `/luyen-tap/kiem-tra/${encodedId}`;
            default: return `/luyen-tap/luyen-tap/${encodedId}`;
        }
    };
  
    return (
        <Col xl={5} sm={12} xs={12} className="course-cate-row">
            <div className="course-cate-box">
                <div className="image-box">
                    <Link to={getLinkPath()}>
                        <img 
                            src={course.anh_dai_dien ? `${config.API_URL}${course.anh_dai_dien}` : defaultImage} 
                            alt={course.ten_khoa_hoc} 
                        />
                    </Link>
                </div>
                <div className="box-text pb-1">
                    <h3 className="course-cate-title">
                        <Link to={getLinkPath()}>{course.ten_khoa_hoc}</Link>
                    </h3>
                    <p className="course-cate-description">
                        <Link to={getLinkPath()}>
                            <Button 
                                type="primary" 
                                style={{margin: '12px 0 12px 0', fontSize: 12, borderRadius: 4}}
                            >
                                Chi tiết
                            </Button>
                        </Link>
                    </p>
                </div>
            </div>
        </Col>
    );
};

const ProgramSection = ({ programType, courses }) => (
    <Col xl={24} md={24} xs={24}>
        <h3 className="section-title section-title-center" style={{marginTop: 24}}>
            <b></b>
            <span 
                style={{
                    justifyContent: 'center', 
                    textTransform: 'uppercase', 
                    color: 'rgb(21, 87, 21)', 
                    fontWeight: 700, 
                    margin: '0 15px'
                }}
            >
                {programType.name}
            </span>
            <b></b>
        </h3>
        <Row gutter={[16, 16]} className="list-cate-items">
            {courses.map((course) => (
                <CourseCard key={course.khoa_hoc_id} course={course} programType={programType} />
            ))}
        </Row>
    </Col>
);

const CourseCatalog = ({ idTypeKCT, typeProgramme, courseOfUser }) => {
    const selectedProgramType = typeProgramme.find(type => type.id === Number(idTypeKCT));
  
    if (!selectedProgramType) {
      return null;
    }
  
    const filteredCourses = Number(idTypeKCT) === 0
        ? courseOfUser.filter(course => course.loai_kct === 0 || course.loai_kct === 3)
        : courseOfUser.filter(course => course.loai_kct === selectedProgramType.id);
  
    return (
        <ProgramSection programType={selectedProgramType} courses={filteredCourses} />
    );
  }

const BusinessTypeProgramePageUser = (props) => {
    const idTypeKCT = useParams().idTypeKCT;
    const hashids = new Hashids();
    // eslint-disable-next-line no-unused-vars
    // const [dataInit, setDataInit] = useState([]);
    const [dataSearch, setDataSearch] = useState([]);
    
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const [courseOfUser] = useFetch(`/student/list/course`);
    const programmes = useSelector(state => state.programme.list.result);
    const programmeCourses = useSelector(state => state.programme.courses.result);

    const typeProgramme = [
        { id: 1, name: 'Kiểm tra trình độ đầu vào', name2: 'Kiểm tra trình độ đầu vào Online', idElement: 'testEntrance', description: 'Bài kiểm tra được xây dựng bởi đội ngũ các Thầy Cô uy tín, nhiều năm kinh \n nghiệm giảng dạy nhằm đánh giá đúng trình độ đầu vào của mỗi HS' },
        { id: 0, name: 'Thi thử ĐGNL - ĐGTD', name2: 'Thi thử ĐGNL - ĐHQGHN (HSA), ĐGTD - ĐHBK (TSA) Online', idElement: 'testCapacity', description: 'Trải nghiệm làm bài thi ĐGNL ĐHQGHN (HSA) và ĐGTD (TSA) trên phần mềm thi thử \n giống như khi làm bài HSA - TSA trên thực tế ở tổ chức tại ĐHQGHN, ĐHBK ...' },
        { id: 2, name: 'Khóa luyện thi hàng đầu', name2: 'Luyện thi ĐGNL (HSA), ĐGTD (TSA)', idElement: 'study', description: 'Được xây dựng và thiết kế bởi đội ngũ giáo viên, chuyên gia uy tín hàng đầu đến từ ĐHQGHN, ĐHSP HN, ĐHBK ...' },
    ];
    
    useEffect(() => {
        dispatch(courseAction.getCourses({ idkct: '', status: 1, search: '' }, (res) => {
            if (res.status === 'success') {
                res.data.sort((objA, objB) => Number(new Date(objB.ngay_bat_dau)) - Number(new Date(objA.ngay_bat_dau)));
                // setDataInit(res.data);
                // dataInit.push(...courses.data);    
            }
        }));
        dispatch(programmeAction.getProgrammes({ status: '' }));
        dispatch(programmeAction.getProgrammeCourses());
        dispatch(receiptAction.getRECEIPTsUser({ status: 1 }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderProgramme = () => {
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
                maxTagCount="responsive"
            >
                <Option value='' >Tất cả</Option>
                {options}
            </Select>
        );
    };

    const search = (values) => {
        if (values.ten_khoa_hoc !== undefined && values.linh_vuc_id !== undefined && values.kct_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: values.kct_id, status: 1, search: values.ten_khoa_hoc, idLinhVuc: values.linh_vuc_id }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.ten_khoa_hoc !== undefined && values.linh_vuc_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: '', status: 1, search: values.ten_khoa_hoc, idLinhVuc: values.linh_vuc_id }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.linh_vuc_id !== undefined && values.kct_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: values.kct_id, status: 1, search: '', idLinhVuc: values.linh_vuc_id }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.ten_khoa_hoc !== undefined && values.kct_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: values.kct_id, status: 1, search: values.ten_khoa_hoc, idLinhVuc: '' }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.kct_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: values.kct_id, status: 1, search: '', }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.ten_khoa_hoc !== undefined) {
            dispatch(courseAction.getCourses({ idkct: '', status: 1, search: values.ten_khoa_hoc }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        } else if (values.linh_vuc_id !== undefined) {
            dispatch(courseAction.getCourses({ idkct: '', status: 1, idLinhVuc: values.linh_vuc_id, search: '' }, (res) => {
                if (res.status === 'success') {
                    setDataSearch(res.data);
                }
            }));
        }
    };

    function getItem(label, icon, key, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    
    // menu khóa học
    const items = [];
    if (programmeCourses.status === 'success') {
        programmeCourses?.data.forEach((item, index) => {
            let children = [];
            if (item.khoa_hocs && item.khoa_hocs.length > 0) {
                item.khoa_hocs.forEach((item2, index2) => {
                    
                    children.push(getItem(item2.ten_khoa_hoc, <BookOutlined />, item2.khoa_hoc_id, null, 'item'));
                });
            }
            items.push(getItem(item.ten_khung_ct, <BookOutlined />, item.kct_id, children, 'item'));
        });
    }
    
    const renderCourses = () => {
        return (
            <div className="list-course-cate">        
                <div className="wraper wraper-list-course-cate-index">
                    <Row gutter={16} style={{margin: '18px 0'}}>
                        <Col xl={5} md={24} xs={24} style={{paddingLeft: 0, marginBottom: 12}}>
                            {(programmeCourses.status === 'success' && items.length > 0) &&
                                <Menu style={{borderRadius: 6}}
                                    mode="vertical"
                                    theme="light"
                                    defaultSelectedKeys={['1']}
                                >
                                    <Menu.Item style={{background: 'rgb(40, 157, 40)', marginTop: 0, borderTopRightRadius: 6, borderTopLeftRadius: 6}}
                                        icon={<BarsOutlined style={{color: '#fff'}}/>}
                                    >
                                        <span style={{fontWeight: 600, color: "#fff"}}>Các khóa học</span>
                                    </Menu.Item>
                                    {items.map((item, index) => {
                                        return (
                                            <Menu.SubMenu title={item.label} key={Number(index)} icon={item.icon}>
                                                {item.children?.map((child, index) => {
                                                    return (
                                                        <Menu.Item key={child.key}>
                                                            <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(child.key)}`}>{child.label}</Link>
                                                        </Menu.Item>
                                                    )
                                                })}
                                            </Menu.SubMenu>
                                        )
                                    })}
                                </Menu>
                            }
                        </Col> 
                        <Col xl={19} md={24} xs={24}>
                            <CarouselCustom />
                        </Col>
                    </Row>
                    <Statisic />

                    <br/>
                    
                    <Row>
                        <Col span={24} className="filter-todo">
                            <Form layout="vertical" form={form} autoComplete="off" onFinish={search}>
                                <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                    <Col xl={6} md={6} xs={24}>
                                        <Form.Item 
                                            initialValue={''}
                                            className="input-col"
                                            name="kct_id"
                                            rules={[]} >
                                                {renderProgramme()}
                                        </Form.Item>  
                                    </Col>
                                    <Col xl={6} md={6} xs={24}>
                                        <Form.Item 
                                            className="input-col"
                                            name="ten_khoa_hoc"
                                            rules={[]} >
                                                <Input placeholder="Nhập tên khóa học"/>
                                        </Form.Item>  
                                    </Col>
                                    <Col xl={2} md={6} xs={24} style={{textAlign: 'center'}}>
                                        <Button type="primary" htmlType="submit" style={{borderRadius: 6}}>Tìm kiếm</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>

                    {dataSearch.length > 0 && (
                        <>
                            <h2 className="section-title section-title-center">
                                <b></b>
                                <span className="section-title-main">KẾT QUẢ TÌM KIẾM</span>
                                <b></b>
                            </h2>
                            <Row gutter={[16, 16]} className="list-cate-items">
                                {dataSearch.map((cate, index) => {
                                    return (
                                        <Col xl={6} sm={12} xs={12} className="course-cate-row" key={cate.khoa_hoc_id}>
                                            <div className="course-cate-box">
                                                <div className="image-box">
                                                    <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                        <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                    </Link>
                                                </div>
                                                <div className="box-text">
                                                    <h3 className="course-cate-title">
                                                        <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>{cate.ten_khoa_hoc}</Link>
                                                    </h3>
                                                    <p className="course-cate-description">
                                                        {/* Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)} */}
                                                        <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`} >
                                                            <Button type="primary" style={{margin: '12px 0 12px 0', fontSize: 12, borderRadius: 4}}>
                                                                Chi tiết
                                                            </Button>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </>
                    )}
                    
                    <Row gutter={16}>
                        <CourseCatalog idTypeKCT={idTypeKCT} typeProgramme={typeProgramme} courseOfUser={courseOfUser}/>
                    </Row>
                </div>
            </div>
        )
    };

    return (
        <Layout className="main-app">
            <Helmet>
                <title>Danh sách khóa học của bạn theo </title>
            </Helmet>
            <Content className="app-content ">
                {renderCourses()}
            </Content>
        </Layout>
    )
}

export default BusinessTypeProgramePageUser;