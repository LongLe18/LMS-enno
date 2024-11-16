import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// helper
import moment from "moment";
import config from '../../../../configs/index';

// hooks
import useFetch from 'hooks/useFetch';
import useDebounce from 'hooks/useDebounce';

// component
import { Row, Col, Table, Button, Tag, Select, notification, Pagination, Tabs, Spin } from 'antd';
import AppFilter from "components/common/AppFilter";
import ReactExport from "react-export-excel";

// redux
import { useSelector, useDispatch } from "react-redux";
import * as examActions from '../../../../redux/actions/exam';
import * as courseActions from '../../../../redux/actions/course';

const { Option } = Select;
const { TabPane } = Tabs;
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const StatisticExam = (props) => {
    const dispatch = useDispatch();

    const exams = useSelector(state => state.exam.list.result);
    const courses = useSelector(state => state.course.list.result);
    
    const [state, setState] = useState({
        examId: null,
        activeTab: '2',
        idCourse: '',
    });

    const [filter, setFilter] = useState({
        search: '',
        start: '',
        end: '',
        tinh: '',
    });
    const searchValue = useDebounce(filter.search, 250);
    const [loadingExportFile, setLoadingExportFile] = useState(false);
    const [province] = useFetch('/province');
    const [data, setData] = useState([]);
    const [dataDGNL, setDataDGNL] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchStatiscal = (idExam) => {
        if (idExam !== null && idExam !== undefined) {
            const token = localStorage.getItem('userToken');
            axios.get(config.API_URL + `/exam/student/${idExam}?index=${pageIndex}&limit=${pageSize}&search=${searchValue}&ngay_bat_dau=${filter.start}&ngay_ket_thuc=${filter.end}&tinh=${filter.tinh}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data.data.length > 0) {
                            setTotal(res.data.total);
                            res.data.data.map((item, index) => {
                                if (item.diem_cac_phan !== null && item.diem_cac_phan !== "") {
                                    const scores = item.diem_cac_phan.split(',');
                                    scores.map((_, i) => {
                                        item[`diem_phan_${i + 1}`] = _
                                        return null;
                                    })
                                }
                                return null;
                            })
                            setData(res.data.data.map((item, index) => ({...item, key: index})));
                        }
                        else 
                            setData(res.data.data);
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => 
            {   
                notification.error({ message: error.response.data })
            });
        }
    }

    const fetchStatiscalDGNL = (idCourse) => {
        if (idCourse !== null && idCourse !== undefined) {
            const token = localStorage.getItem('userToken');
            axios.get(config.API_URL + `/student_exam/dgnl?search=${searchValue}&pageIndex=${pageIndex}&pageSize=${pageSize}&khoa_hoc_id=${idCourse}&ngay_bat_dau=${filter.start}&ngay_ket_thuc=${filter.end}&ttp_id=${filter.tinh}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data.data.length > 0) {
                            setTotal(res.data.totalCount);
                            res.data.data.map((item, index) => {
                                if (item.diem_cac_phan !== null && item.diem_cac_phan !== "") {
                                    const scores = item.diem_cac_phan.split(',');
                                    scores.map((_, i) => {
                                        item[`diem_phan_${i + 1}`] = _ 
                                        return null;
                                    })
                                }
                                return null;
                            })
                            setDataDGNL(res.data.data.filter((item) => item.thoi_diem_ket_thuc !== null)
                                .map((item, index) => ({...item, key: index, ten_khoa_hoc: courses.data.filter((course) => course.khoa_hoc_id === idCourse)[0]?.ten_khoa_hoc}))
                            );
                        }
                        else 
                            setDataDGNL(res.data.data);
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => 
            {   
                notification.error({ message: error.response.data })
            });
        }
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
        // const callback = (res) => {
        //     if (res.status === 'success') {
        //         setState({ ...state, examId: res.data[0].de_thi_id });
        //         fetchStatiscal(res.data[0].de_thi_id);
        //     }
        // }
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
        // dispatch(examActions.filterExam({ idCourse: '', idModule: '', idThematic: '', status: '', search: '', 
        //     start: '', end: '', idType: '', publish: 1, offset: '', limit: 1000000 }, callback));
        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Lấy ra danh sách khóa học cho tab "Ôn luyện"
    const renderCourseForPractice = () => {
        let options = [];
        if (courses.status === 'success') {
            options = courses.data.filter((course) => course.loai_kct === 2).map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id}>{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select style={{marginRight: 10, width: 300}}
                showSearch={true}
                placeholder="Chọn khóa học"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                onChange={(khoa_hoc_id) => {
                    dispatch(examActions.filterExam({ offset: 0, limit: 1000000, idCourse: khoa_hoc_id, idModule: '', idThematic: '', status: '', search: '', 
                        start: '', end: '', idType: '', publish: '1' }));
                }}
            >
                {options}
            </Select>
        );
    };

    // Lấy ra danh sách khóa học cho tab "Thi thử"
    const renderCourseForTryExam = () => {
        let options = [];
        if (courses.status === 'success') {
            options = courses.data.filter((course) => course.loai_kct === 1).map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id}>{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select style={{marginRight: 10, width: 300}}
                showSearch={true}
                placeholder="Chọn khóa học"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                onChange={(khoa_hoc_id) => {
                    dispatch(examActions.filterExam({ offset: 0, limit: 1000000, idCourse: khoa_hoc_id, idModule: '', idThematic: '', status: '', search: '', 
                        start: '', end: '', idType: '', publish: '1' }));
                }}
            >
                {options}
            </Select>
        );
    };

    // Lấy ra danh sách khóa học cho tab "Thi thử"
    const renderCourseForDGNL = () => {
        let options = [];
        if (courses.status === 'success') {
            options = courses.data.filter((course) => course.loai_kct === 0).map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id}>{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select style={{marginRight: 10, width: 300}}
                showSearch={true}
                placeholder="Chọn khóa học"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                onChange={(khoa_hoc_id) => {
                    setState({...state, idCourse: khoa_hoc_id});
                    fetchStatiscalDGNL(khoa_hoc_id); // request API thống kê ĐGNL
                }}
            >
                {options}
            </Select>
        );
    };

    const renderExams = () => {
        let options = [];
        if (exams.status === 'success') {
            options = exams.data.map((exam) => (
                <Option key={exam.de_thi_id} value={exam.de_thi_id} >{exam.ten_de_thi}</Option>
            ))
        }
        return (
          <Select style={{marginRight: 10}}
            showSearch={true} value={state.examId}
            placeholder="Chọn đề thi"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            onChange={(exam) => {
                setState({ ...state, examId: exam })
            }}
          >
            {options}
          </Select>
        );
    };
    
    useEffect(() => {
        if (state.activeTab === '0') {
            fetchStatiscalDGNL(state.idCourse);
        } else {
            fetchStatiscal(state.examId)
        }
    }, [filter.start, filter.end, filter.tinh, state.examId, pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    useMemo(() => {
        if (state.activeTab === '0') {
            fetchStatiscalDGNL(state.idCourse);
        } else {
            fetchStatiscal(state.examId);
        }
    }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ tên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            responsive: ['md'],
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'tinh',
            key: 'tinh',
            responsive: ['md'],
        },
        {
            title: 'Số câu đúng',
            dataIndex: 'so_cau_tra_loi_dung',
            key: 'so_cau_tra_loi_dung',
            responsive: ['md'],
        },
        {
            title: 'Điểm số',
            dataIndex: 'diem_so',
            key: 'diem_so',
            responsive: ['md'],
            render: (diem_so) => (
                diem_so.toFixed(2)
            )
        },
        {
            title: 'Ngày thi',
            dataIndex: 'ngay_thi',
            key: 'ngay_thi',
            responsive: ['md'],
            render: (ngay_thi) => (
                moment(new Date(ngay_thi)).utc(7).format(config.DATE_FORMAT)
            )
        },
        {
            title: 'Xếp hạng',
            dataIndex: 'diem_so',
            key: 'diem_so',
            responsive: ['md'],
            render: (diem_so) => (
                <Tag color={(diem_so >= 9.5 && diem_so <= 10) ? 'green' 
                    : (diem_so >= 8.0 && diem_so < 9.5) ? 'blue' 
                    : (diem_so >= 7.0 && diem_so < 8.0) ? 'geekblue' 
                    : (diem_so >= 5.0 && diem_so < 7.0) ? 'purple' : 'red'} 
                    key={diem_so}>
                        {(diem_so >= 9.5 && diem_so <= 10) ? "Xuất sắc" 
                    : (diem_so >= 8.0 && diem_so < 9.5) ? 'Giỏi' 
                    : (diem_so >= 7.0 && diem_so < 8.0) ? 'Khá' 
                    : (diem_so >= 5.0 && diem_so < 7.0) ? 'Trung binh' : 'Dưới trung bình'}
                </Tag>
            ),
        },
        {
            title: 'Tùy chọn',
            dataIndex: 'dthv_id',
            key: 'dthv_id',
            responsive: ['md'],
            render: (dthv_id, record) => (
                <> {state.activeTab === '1' && 
                    <Button type='primary' style={{borderRadius: 6, marginRight: 6}}
                        onClick={async () => {
                            try {
                                setLoadingExportFile(true)
                                const response = await axios({
                                    url: `${config.API_URL}/evaluate/${dthv_id}/export-report`, 
                                    method: 'GET',
                                    responseType: 'blob', 
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                                    }
                                });
                    
                                // Create a URL for the file
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `${moment(record.ngay_thi).utc(7).format('ddmmYY')}_${record.ho_ten}.pdf`); // Replace with your file name and extension
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode.removeChild(link);
                                setLoadingExportFile(false);
                            } catch (error) {
                                notification.warn({
                                    message: 'Cảnh báo',
                                    description: 'Chưa có dữ liệu đánh giá của khóa học',
                                })
                                console.error('Download error:', error);
                                setLoadingExportFile(false);
                            }
                        }}
                    >
                        Tải báo cáo
                    </Button>
                    }
                    {/* Xem laị bài thi */}
                    <Button type='primary' style={{borderRadius: 6}}
                        onClick={() => {
                            // open new  tab
                            window.open(`/luyen-tap/lich-su-admin/${state.examId}/${dthv_id}`, '_blank');
                        }}
                    >
                        Xem lại
                    </Button>
                </>
            )
        }
    ];

    const columnsDGNL = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ tên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
            render: (ho_ten, ket_qua) => (ket_qua?.hoc_vien?.ho_ten)
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            responsive: ['md'],
            render: (ho_ten, ket_qua) => (ket_qua?.hoc_vien?.sdt)
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'tinh',
            key: 'tinh',
            responsive: ['md'],
            render: (ho_ten, ket_qua) => (ket_qua?.hoc_vien?.tinh_thanhpho?.ten)
        },
        {
            title: 'Đề thi',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Điểm phần 1',
            dataIndex: 'diem_cac_phan',
            key: 'diem_cac_phan',
            responsive: ['md'],
            render: (diem_cac_phan) => ((diem_cac_phan !== null && diem_cac_phan.split(','.length >= 1)) && diem_cac_phan.split(',')[0])
        },
        {
            title: 'Điểm phần 2',
            dataIndex: 'diem_cac_phan',
            key: 'diem_cac_phan',
            responsive: ['md'],
            render: (diem_cac_phan) => ((diem_cac_phan !== null && diem_cac_phan.split(','.length >= 2)) && diem_cac_phan.split(',')[1])
        },
        {
            title: 'Điểm phần 3',
            dataIndex: 'diem_cac_phan',
            key: 'diem_cac_phan',
            responsive: ['md'],
            render: (diem_cac_phan) => ((diem_cac_phan !== null && diem_cac_phan.split(','.length >= 3)) && diem_cac_phan.split(',')[2])
        },
        {
            title: 'Tổng điểm',
            dataIndex: 'ket_qua_diem',
            key: 'ket_qua_diem',
            responsive: ['md'],
            render: (ket_qua_diem) => (
                ket_qua_diem?.toFixed(2)
            )
        },
        {
            title: 'Ngày thi',
            dataIndex: 'ngay_tao',
            key: 'ngay_tao',
            responsive: ['md'],
            render: (ngay_thi) => (
                moment(new Date(ngay_thi)).utc(7).format(config.DATE_FORMAT)
            )
        },
        {
            title: 'Tùy chọn',
            dataIndex: 'dthv_id',
            key: 'dthv_id',
            responsive: ['md'],
            width: 150,
            render: (dthv_id, record) => (
                <> 
                    <Button type='primary' style={{borderRadius: 6, marginRight: 6, marginBottom: 6}}
                        onClick={async () => {
                            try {
                                setLoadingExportFile(true)
                                const response = await axios({
                                    url: `${config.API_URL}/evaluate-dgnl/${dthv_id}/export-report`, 
                                    method: 'GET',
                                    responseType: 'blob', 
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                                    }
                                });
                    
                                // Create a URL for the file
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `${moment(record.ngay_thi).utc(7).format('ddmmYY')}_${record.ho_ten}.pdf`); // Replace with your file name and extension
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode.removeChild(link);
                                setLoadingExportFile(false);
                            } catch (error) {
                                notification.warn({
                                    message: 'Cảnh báo',
                                    description: 'Chưa có dữ liệu đánh giá của khóa học',
                                })
                                console.error('Download error:', error);
                            }
                        }}
                    >
                        Tải báo cáo
                    </Button>
                    {/* Xem laị bài thi */}
                    <Button type='primary' style={{borderRadius: 6}}
                        onClick={() => {
                            // open new  tab
                            window.open(`/luyen-tap/lich-su-admin/${record.de_thi_id}/${dthv_id}`, '_blank');
                        }}
                    >
                        Xem lại
                    </Button>
                </>
            )
        }
    ];

    const onChange = (page) => {
        setPageIndex(page);
    };
      
    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize);
    };

    const exportReportSummanry = async () => {
        const token = localStorage.getItem('userToken');
        try {
            const response = await axios.get(config.API_URL + `/student_exam/export-report?ngay_bat_dau=${filter.start}&ngay_ket_thuc=${filter.end}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'baocaoTonghop.xlsx'); // or any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải báo cáo',
            })
        }
    };

    // event đổi tab
    const onChangeTab = (value) => {
        setPageIndex(1);
        setData([]);
        setState({...state, activeTab: value, examId: null});
    };

    return (
        <div className='content'>
            <Spin spinning={loadingExportFile}>  
                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Kết quả thi Ôn luyện" key="2">
                        <Col xl={24} className="body-content">
                            <Row className="app-main">
                                <Col xl={24} sm={24} xs={24}>
                                    <AppFilter
                                        title="Thống kê kết quả thi của phần Ôn luyện"
                                        isShowSearchBox={true}
                                        isSearchProvinces={true}
                                        isShowDatePicker={true}
                                        isRangeDatePicker={true}
                                        provinces={province.length > 0 ? province: []}
                                        onFilterChange={(field, value) => onFilterChange(field, value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='app-main' style={{paddingTop: 0}}>
                                <Col xl={24} sm={24} xs={24}>
                                    {renderCourseForPractice()}
                                    {renderExams()}
                                    <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={'baocao'}>
                                        <ExcelSheet data={data} name={'Thống kê điểm'}>
                                            <ExcelColumn label="Họ tên" value="ho_ten"/>
                                            <ExcelColumn label="Số điện thoại" value="sdt"/>
                                            <ExcelColumn label="Quê quán" value="tinh"/>
                                            <ExcelColumn label="Trường học" value="truong_hoc"/>
                                            <ExcelColumn label="Số câu đúng" value={"so_cau_tra_loi_dung"}/>
                                            <ExcelColumn label="Số câu sai" value={"so_cau_tra_loi_sai"}/>
                                            <ExcelColumn label="Điểm phần 1" value={"diem_phan_1"}/>
                                            <ExcelColumn label="Điểm phần 2" value={"diem_phan_2"}/>
                                            <ExcelColumn label="Điểm phần 3" value={"diem_phan_3"}/>
                                            <ExcelColumn label="Điểm phần 4" value={"diem_phan_4"}/>
                                            <ExcelColumn label="Điểm" value="diem_so"/>
                                            <ExcelColumn label="Xếp hạng" value={(col) => (col.diem_so >= 9.5 && col.diem_so <= 10) ? "Xuất sắc" 
                                                    : (col.diem_so >= 8.0 && col.diem_so < 9.5) ? 'Giỏi' 
                                                    : (col.diem_so >= 7.0 && col.diem_so < 8.0) ? 'Khá' 
                                                    : (col.diem_so >= 5.0 && col.diem_so < 7.0) ? 'Trung binh' : 'Dưới trung bình'}/>
                                            <ExcelColumn label="Ngày thi" value={(col) => moment(col.ngay_thi).utc(7).format(config.DATE_FORMAT)}/>
                                        </ExcelSheet>
                                    </ExcelFile>
                                </Col>
                            </Row>
                        </Col>
                        <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}/>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChange} total={total} onShowSizeChange={onShowSizeChange} showSizeChanger defaultPageSize={pageSize}/>
                    </TabPane>
                    <TabPane tab="Kết quả thi thử" key="1">
                        <Col xl={24} className="body-content">
                            <Row className="app-main">
                                <Col xl={24} sm={24} xs={24}>
                                    <AppFilter
                                        title="Thống kê kết quả thi của phần Thi thử"
                                        isShowSearchBox={true}
                                        isSearchProvinces={true}
                                        isShowDatePicker={true}
                                        isRangeDatePicker={true}
                                        provinces={province.length > 0 ? province: []}
                                        onFilterChange={(field, value) => onFilterChange(field, value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='app-main' style={{paddingTop: 0}}>
                                <Col xl={24} sm={24} xs={24}>
                                    {renderCourseForTryExam()}
                                    {renderExams()}
                                    <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={'baocao'}>
                                        <ExcelSheet data={data} name={'Thống kê điểm'}>
                                            <ExcelColumn label="Họ tên" value="ho_ten"/>
                                            <ExcelColumn label="Số điện thoại" value="sdt"/>
                                            <ExcelColumn label="Quê quán" value="tinh"/>
                                            <ExcelColumn label="Trường học" value="truong_hoc"/>
                                            <ExcelColumn label="Số câu đúng" value={"so_cau_tra_loi_dung"}/>
                                            <ExcelColumn label="Số câu sai" value={"so_cau_tra_loi_sai"}/>
                                            <ExcelColumn label="Điểm phần 1" value={"diem_phan_1"}/>
                                            <ExcelColumn label="Điểm phần 2" value={"diem_phan_2"}/>
                                            <ExcelColumn label="Điểm phần 3" value={"diem_phan_3"}/>
                                            <ExcelColumn label="Điểm phần 4" value={"diem_phan_4"}/>
                                            <ExcelColumn label="Điểm" value="diem_so"/>
                                            <ExcelColumn label="Xếp hạng" value={(col) => (col.diem_so >= 9.5 && col.diem_so <= 10) ? "Xuất sắc" 
                                                    : (col.diem_so >= 8.0 && col.diem_so < 9.5) ? 'Giỏi' 
                                                    : (col.diem_so >= 7.0 && col.diem_so < 8.0) ? 'Khá' 
                                                    : (col.diem_so >= 5.0 && col.diem_so < 7.0) ? 'Trung binh' : 'Dưới trung bình'}/>
                                            <ExcelColumn label="Ngày thi" value={(col) => moment(col.ngay_thi).utc(7).format(config.DATE_FORMAT)}/>
                                        </ExcelSheet>
                                    </ExcelFile>
                                    <Button type='primary' style={{marginLeft: 8}} onClick={exportReportSummanry}>Tải kết quả</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}/>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChange} total={total} onShowSizeChange={onShowSizeChange} showSizeChanger defaultPageSize={pageSize}/>
                    </TabPane>
                    <TabPane tab="Kết quả thi ĐGNL" key="0">
                        <Col xl={24} className="body-content">
                            <Row className="app-main">
                                <Col xl={24} sm={24} xs={24}>
                                    <AppFilter
                                        title="Thống kê kết quả thi của phần Đánh giá năng lực"
                                        isShowSearchBox={true}
                                        isSearchProvinces={true}
                                        isShowDatePicker={true}
                                        isRangeDatePicker={true}
                                        provinces={province.length > 0 ? province: []}
                                        onFilterChange={(field, value) => onFilterChange(field, value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='app-main' style={{paddingTop: 0}}>
                                <Col xl={24} sm={24} xs={24}>
                                    {renderCourseForDGNL()}
                                    {/* <Button type='primary' style={{marginLeft: 8}} onClick={exportReportSummanry}>Tải kết quả</Button> */}
                                    <ExcelFile element={<Button type='primary'>Tải kết quả</Button>} filename={'baocao'}>
                                        <ExcelSheet data={dataDGNL} name={'Thống kê điểm'}>
                                            <ExcelColumn label="Họ tên" value={(col) => col?.hoc_vien?.ho_ten}/>
                                            <ExcelColumn label="Số điện thoại" value={(col) => col?.hoc_vien?.sdt}/>
                                            <ExcelColumn label="Quê quán" value={(col) => col.hoc_vien?.tinh_thanhpho?.ten}/>
                                            <ExcelColumn label="Đề thi" value={"ten_khoa_hoc"}/>
                                            <ExcelColumn label="Điểm phần 1" value={"diem_phan_1"}/>
                                            <ExcelColumn label="Điểm phần 2" value={"diem_phan_2"}/>
                                            <ExcelColumn label="Điểm phần 3" value={"diem_phan_3"}/>
                                            <ExcelColumn label="Điểm" value="ket_qua_diem"/>
                                            <ExcelColumn label="Ngày thi" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT)}/>
                                        </ExcelSheet>
                                    </ExcelFile>
                                </Col>
                            </Row>
                        </Col>
                        <Table className="table-striped-rows" columns={columnsDGNL} dataSource={dataDGNL} pagination={false} />
                        <br/>
                        <Pagination current={pageIndex} onChange={onChange} total={total} onShowSizeChange={onShowSizeChange} showSizeChanger defaultPageSize={pageSize}/>
                    </TabPane>
                </Tabs>
            </Spin>
        </div>
    )
};

export default StatisticExam;