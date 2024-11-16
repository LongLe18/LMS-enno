import React, { useState } from "react";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// hooks
import useFetch from "hooks/useFetch";

// component
import { Tabs, Table, Button, Tag, Col } from 'antd';
import ReactExport from "react-export-excel";

const { TabPane } = Tabs;
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const TeachingPage = (props) => {
    
    const [state, setState] = useState({
        isEdit: false,
        idModule: '',
        activeTab: "1",
        idCourse: '',
    });

    const [data] = useFetch(`/modun/teaching`);
    const [detail] = useFetch(`/student/detail_modun?khoa_hoc_id=${state.idCourse}&mo_dun_id=${state.idModule}`);

    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên mô-đun',
            dataIndex: 'ten_mo_dun',
            key: 'ten_mo_dun',
            responsive: ['md'],
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
                </Tag>
            ),
        },
        {
            title: 'Số lượng học viên',
            dataIndex: 'so_luong',
            key: 'so_luong',
            responsive: ['md'],
        },
        // {
        //     title: 'Tùy chọn',
        //     key: 'mo_dun_id',
        //     dataIndex: 'mo_dun_id',
        //     // Redirect view for edit
        //     render: (mo_dun_id, mo_dun) => (
        //         <Space size="middle">
        //             <Button type="button" onClick={() => detailTeaching(mo_dun_id, mo_dun)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
        //         </Space>
        //     ),
        // },
    ];

    // const columns2 = [
    //     {
    //         title: 'STT',
    //         key: 'index',
    //         render: (text, record, index) => index + 1,
    //     },
    //     {
    //         title: 'Tên học viên',
    //         dataIndex: 'ho_ten',
    //         key: 'ho_ten',
    //         responsive: ['md'],
    //     },
    //     {
    //         title: 'Ngày sinh',
    //         dataIndex: 'ngay_sinh',
    //         key: 'ngay_sinh',
    //         responsive: ['md'],
    //         render: (ngay_sinh) => (
    //             moment(ngay_sinh).utc(7).format(config.DATE_FORMAT_SHORT)
    //         )
    //     },
    //     {
    //         title: 'Số chuyên đề chưa học',
    //         dataIndex: 'so_chuyen_de_chua_hoc',
    //         key: 'so_chuyen_de_chua_hoc',
    //         responsive: ['md'],
    //     },
    //     {
    //         title: 'Số chuyên đề đã học',
    //         dataIndex: 'so_chuyen_de_da_hoc',
    //         key: 'so_chuyen_de_da_hoc',
    //         responsive: ['md'],
    //     },
    //     {
    //         title: 'Tiến độ',
    //         dataIndex: 'tien_do',
    //         key: 'tien_do',
    //         responsive: ['md'],
    //         render: (tien_do) => (<span>{tien_do !== null ? tien_do.toFixed(2) : 0}</span>)
    //     },
    // ];

    // const detailTeaching = (mo_dun_id, mo_dun) => {
    //     setState({...state, activeTab: "2", idCourse: mo_dun.khoa_hoc_id, idModule: mo_dun_id });
    // };

    return (
        <>
            <div className="content">
                <br/>
                <h5>Giảng dạy của giáo viên</h5>
                <Col xl={3} md={6} xs={2}>  
                    {state.activeTab === "2" &&
                        <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={'Giảng dạy'}>
                            <ExcelSheet data={detail} name={'Giảng dạy'}>
                                <ExcelColumn label="Họ tên" value="ho_ten"/>
                                <ExcelColumn label="Ngày sinh" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                                <ExcelColumn label="Số chuyên đề chưa học" value="so_chuyen_de_chua_hoc"/>
                                <ExcelColumn label="Số chuyên đề đã học" value="so_chuyen_de_da_hoc"/>
                                <ExcelColumn label="Tiến độ" value="tien_do"/>
                            </ExcelSheet>
                        </ExcelFile>
                    }
                </Col>
                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Giảng dạy" key="1">
                        {data.length > 0 && 
                            <Table className="table-striped-rows" columns={columns} dataSource={data} />
                        }
                    </TabPane>
                    {/* <TabPane tab="Chi tiết giảng dạy" disabled key="2">
                        {detail.length > 0 && 
                            <Table className="table-striped-rows" columns={columns2} dataSource={detail} />
                        }
                    </TabPane> */}
                </Tabs>    
            </div>
        </>
    )
};

export default TeachingPage;