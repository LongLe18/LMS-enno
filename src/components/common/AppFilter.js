import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Select, Input, DatePicker, Button } from 'antd';
import queryString from 'query-string';
import moment from 'moment';
import config from '../../configs/index';
import { useSelector, useDispatch } from 'react-redux';
import ReactExport from "react-export-excel";

import * as moduleActions from '../../redux/actions/part';
import * as thematicActions from '../../redux/actions/thematic';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const COMMON_STATUS = [
    {
      title: 'Tất cả trạng thái',
      value: '',
    },
    {
      title: 'Đang hoạt động',
      value: '1',
    },
    {
      title: 'Đã dừng',
      value: '0',
    },
];

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
function AppFilter(props) {
    const dispatch = useDispatch();
    const dateFormat = 'YYYY-MM-DD';
    const history = useHistory();
    const urlQuery = queryString.parse(history.location.search);
    //   const [date, setDate] = useState(urlQuery.date ? moment(urlQuery.date, dateFormat) : moment(props.search.date, dateFormat));
    const [date, setDate] = useState(moment(urlQuery.date, dateFormat));

    const modules = useSelector(state => state.part.list.result);
    const loadingModules = useSelector(state => state.part.list.loading);

    const thematics = useSelector(state => state.thematic.listbyId.result);
    const loadingThematics = useSelector(state => state.thematic.listbyId.loading);

    const typeExams = useSelector(state => state.typeExam.list.result);

    const renderProgrammes = () => {
      const programmes = props.programmes ? props.programmes : [];
      let options = [];
      options = programmes.map((programme) => (
        <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
      ));
      return (
          <Select style={{width:"90%"}}
              maxTagCount="responsive"
              showSearch={true}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              allowClear={true}
              onChange={(value) => {
                props.onFilterChange('kct_id', value ? value : '');
              }}
              placeholder="Danh mục khung chương trình"
          >
              <Option key={''} value={''}>Tất cả khung chương trình</Option>
              {options}
          </Select>
      );
    }

    const renderStatus = () => {
      const status = props.status ? props.status : COMMON_STATUS;
      let options = [];
      options = status.map((label) => (
        <Option key={label.value} value={label.value} >{label.title}</Option>
      )); 
      return (
        <Select style={{width:"90%"}}
          allowClear={true}
          // defaultValue={''}
          onChange={(value) => props.onFilterChange('trang_thai', value ? value : '')}
          placeholder="Chọn trạng thái"
        >
          {options}
        </Select>
      )
    };
    
    const renderProvinces = () => {
      const provinces = props.provinces ? props.provinces : [];
      let options = [];
      options = provinces.map((province) => (
        <Option key={province.ttp_id} value={province.ttp_id} >{province.ten}</Option>
      ));
      return (
          <Select style={{width:"90%"}}
              maxTagCount="responsive"
              // defaultValue={''}
              optionFilterProp="children"
              showSearch={true}
              allowClear={true}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onChange={(value) => {
                props.onFilterChange('tinh', value ? value : '');
              }}
              placeholder="Chọn tỉnh/Thành phố"
          >
              {options}
          </Select>
      );
    }

    const renderCourses = () => {
      const courses = props.courses ? props.courses : [];
      let options = [];
      options = courses.map((course) => (
        <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
      ));
      return (
          <Select style={{width:"90%"}}
              maxTagCount="responsive"
              showSearch={true}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              allowClear={true}
              onChange={(value) => {
                props.onFilterChange('khoa_hoc_id', value ? value : '');
                dispatch(moduleActions.getModulesByIdCourse({ idCourse: value ? value : '' }))
              }}
              placeholder="Danh mục khóa học"
          >
              <Option key={''} value={''}>Tất cả khóa học</Option>
              {options}
          </Select>
      );
    };

    const renderModules = () => {
      let options = [];
      if (modules.status === 'success') {
        options = modules.data.map((module) => (
          <Option key={module.mo_dun_id} value={module.mo_dun_id} >{module.ten_mo_dun}</Option>
        ))
      }
      return (
        <Select style={{width:"90%"}}
          allowClear={true}
          showSearch={true}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          loading={loadingModules}
          onChange={(mo_dun_id) => {
            props.onFilterChange('mo_dun_id', mo_dun_id ? mo_dun_id : '');
            dispatch(thematicActions.getThematicsByIdModule({ idModule: mo_dun_id ? mo_dun_id : ''}))
          }}
          placeholder="Chọn mô đun"
        >
          <Option key={''} value={''}>Tất cả mô đun</Option>
          {options}
        </Select>
      );
    };

    const renderThematics = () => {
      let options = [];
      if (thematics.status === 'success') {
        options = thematics.data.thematics.map((thematic) => (
          <Option key={thematic.chuyen_de_id} value={thematic.chuyen_de_id} >{thematic.ten_chuyen_de}</Option>
        ))
      }
      return (
        <Select
          showSearch={true}
          allowClear={true}
          loading={loadingThematics}
          onChange={(chuyen_de_id) => {
            props.onFilterChange('chuyen_de_id', chuyen_de_id ? chuyen_de_id : '');
          }}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          placeholder="Chọn chuyên đề"
        >
          <Option key={''} value={''}>Tất cả chuyên đề</Option>
          {options}
        </Select>
      );
    };

    // Type Exams for filter
    const renderTypeExams = () => {
      let options = [];
      if (typeExams.status === 'success') {
        options = typeExams.data.map((type) => (
          <Option key={type.loai_de_thi_id} value={type.loai_de_thi_id} >{type.mo_ta}</Option>
        ))
      }
      return (
        <Select
          showSearch={true}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          allowClear={true}
          placeholder="Chọn loại đề thi"
          maxTagCount="responsive"
          onChange={(typeId) => {
            props.onFilterChange('typeId', typeId ? typeId : '');
          }}
        >
          <Option key={0} value={''}>Tất cả loại đề thi</Option>
          {options}
        </Select>
      );
    }

  return (
    <Row>
      <Col span={24} className="filter-todo">
        <Row>
          <Col xl={24} sm={8} xs={8}>
            <h5>{props.title || ''} </h5>
          </Col>
        </Row>
        {(props.isShowStatus || props.isShowDatePicker || props.isShowCourse || props.isShowSearchBox || props.isTypeExam || 
          props.buttonBack || props.dataExportStatisticTeacher || props.dataExportStatisticStudent || props.isShowProgramme ) &&
        <Row>
          <Col xl={24} sm={16} xs={16}>    
            <Row>
              {props.isShowStatus && (
                  <Col xl={4} md={6} xs={12}>
                    {renderStatus()}
                  </Col>
              )}
              {props.isShowDatePicker && (
                <Col xl={5} md={6} xs={24}>
                  {props.isRangeDatePicker ? (
                    <RangePicker
                      locale={{
                        lang: {
                          locale: 'en_US',
                          rangePlaceholder: ['Từ ngày', 'Đến ngày'],
                        },
                      }}
                      style={{ width: '80%' }}
                      onChange={(date, string) => props.onFilterChange('ngay', string)}
                      format={dateFormat}
                      allowEmpty={[[false, false]]}
                      ranges={{
                        'Hôm nay': [moment(), moment()],
                        'Tuần này': [moment().startOf('week'), moment().endOf('week')],
                        'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                        'Năm nay': [moment().startOf('year'), moment().endOf('year')],
                      }}
                    />
                  ) : (
                    <DatePicker
                      placeholder="Tìm ngày"
                      defaultValue={urlQuery.date ? moment(urlQuery.date, dateFormat) : ''}
                      value={date ? date : ''}
                      onChange={(value) => {
                        if (value) {
                          setDate(moment(value, dateFormat).utc(7));
                          props.onFilterChange('date', moment(value, dateFormat).utc(7).format(dateFormat));
                        } else props.onFilterChange('date', null);
                      }}
                      showToday
                      style={{
                        width: '80%',
                      }}
                      format={dateFormat}
                    />
                  )}
                </Col>
              )}
              {props.isShowProgramme && 
                <Col xl={6} md={24} xs={24}>
                  {renderProgrammes()}
                </Col>   
              }
              {props.isShowCourse && (
                <>
                  <Col xl={6} md={24} xs={24}>
                    {renderCourses()}
                  </Col>   
                  {(modules.status === 'success' && modules && props.isShowModule) && <Col xl={4} md={6} xs={12}>
                    {renderModules()}
                  </Col>}
                  {(thematics.status === 'success' && thematics && props.isShowThematic) &&<Col xl={4} md={6} xs={12}>
                    {renderThematics()}
                  </Col>}
                <br/>
                </>
              )}
              <br/>
              {props.isShowSearchBox && (
                <Col md={3} xs={24} xl={5}>
                  <Search placeholder={props.placeholder ? props.placeholder : "Tìm kiếm theo tên"} 
                    onChange={(e) => props.onFilterChange('search', e.target.value)} style={{width:"90%"}}
                    allowClear
                  />
                </Col>
              )}
              {props.isSearchProvinces && (
                  <Col md={3} xs={24} xl={4}>
                    {renderProvinces()}
                  </Col>
              )}
              {props.isTypeExam && (
                <Col md={2} xs={24} xl={5}>
                  {renderTypeExams()}
                </Col>
              )}

              {props.dataExportDealer &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportDealer} name={props.title || ''}>
                        <ExcelColumn label="ID Chiết khấu chi tiết" value="chiet_khau_chi_tiet_id"/>
                        <ExcelColumn label="ID Chiết khấu" value="chiet_khau_id"/>
                        <ExcelColumn label="Mã chiết khấu" value="chiet_khau_ma"/>
                        <ExcelColumn label="Trạng thái sử dụng" value={(col) => col.trang_thai_su_dung ? "Đã sử dụng" : "Chưa sử dụng"}/>
                        <ExcelColumn label="Trạng thái Quyết toán" value={(col) => col.trang_thai_quyet_toan ? "Đã quyết toán" : "Chưa quyết toán"}/>
                        <ExcelColumn label="Người tạo" value="nguoi_tao"/>
                        <ExcelColumn label="Ngày tạo" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                        <ExcelColumn label="Người sửa" value="nguoi_sua"/>
                        <ExcelColumn label="Ngày sửa" value={(col) => moment(col.ngay_sua).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }
              {props.dataExportReceipt &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportReceipt} name={props.title || ''}>
                        <ExcelColumn label="Mã hóa đơn" value="hoa_don_ma"/>
                        <ExcelColumn label="Tên học viên" value="ten_hoc_vien"/>
                        <ExcelColumn label="Email" value="email"/>
                        <ExcelColumn label="Sản phẩm" value="ten_san_pham"/>
                        <ExcelColumn label="Loại sản phẩm" value="loai_san_pham"/>
                        <ExcelColumn label="Email" value="email"/>
                        <ExcelColumn label="Trạng thái" value={(col) => col.trang_thai ? "Đã xử lý" : "Chưa xử lý"}/>
                        <ExcelColumn label="Tông tiền" value="tong_tien"/>
                        <ExcelColumn label="Người tạo" value="nguoi_tao"/>
                        <ExcelColumn label="Ngày tạo" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                        <ExcelColumn label="Người sửa" value="nguoi_sua"/>
                        <ExcelColumn label="Ngày sửa" value={(col) => moment(col.ngay_sua).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }
              {props.dataExportReceiptTeacher &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.dataExportReceiptTeacher.length > 0 ? props.dataExportReceiptTeacher[0].ho_ten : ''}>
                    <ExcelSheet data={props.dataExportReceiptTeacher} name={props.title || ''}>
                        <ExcelColumn label="Họ tên" value="ho_ten"/>
                        <ExcelColumn label="Email" value="email"/>
                        <ExcelColumn label="Số điện thoại" value="sdt"/>
                        <ExcelColumn label="Sản phẩm" value="ten_khoa_hoc"/>
                        <ExcelColumn label="Mã chiết khâu" value="chiet_khau_ma"/>
                        <ExcelColumn label="Trạng thái sử dụng" value={(col) => col.trang_thai_su_dung === 0 ? "Chưa sử dụng" : col.trang_thai_su_dung === 1 ? "Đã sử dụng" : "Ngưng sử dụng"}/>
                        <ExcelColumn label="Trạng thái sử dụng" value={(col) => col.trang_thai_quyet_toan === 0 ? "Chưa quyết toán" : "Đã quyết toán"}/>
                        <ExcelColumn label="Tiền chiết khấu" value="tien_chiet_khau"/>
                        <ExcelColumn label="Người tạo" value="nguoi_tao"/>
                        <ExcelColumn label="Ngày tạo" value={(col) => moment(col.ngay_lap).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                        <ExcelColumn label="Người sửa" value="nguoi_sua"/>
                        <ExcelColumn label="Ngày sửa" value={(col) => moment(col.ngay_sua).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }
              {props.dataExportDealerTeacher &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportDealerTeacher} name={props.title || ''}>
                        <ExcelColumn label="ID Chiết khấu chi tiết" value="chiet_khau_chi_tiet_id"/>
                        <ExcelColumn label="ID Chiết khấu" value="chiet_khau_id"/>
                        <ExcelColumn label="Mã chiết khấu" value="chiet_khau_ma"/>
                        <ExcelColumn label="Trạng thái sử dụng" value={(col) => col.trang_thai_su_dung ? "Đã sử dụng" : "Chưa sử dụng"}/>
                        <ExcelColumn label="Trạng thái Quyết toán" value={(col) => col.trang_thai_quyet_toan ? "Đã quyết toán" : "Chưa quyết toán"}/>
                        <ExcelColumn label="Giá gốc" value="gia_goc" />
                        <ExcelColumn label="Thực lĩnh" value="thuc_linh"/>
                        <ExcelColumn label="Người tạo" value="nguoi_tao"/>
                        <ExcelColumn label="Ngày tạo" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                        <ExcelColumn label="Người sửa" value="nguoi_sua"/>
                        <ExcelColumn label="Ngày sửa" value={(col) => moment(col.ngay_sua).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }   
              {props.dataExportStatisticTeacher &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportStatisticTeacher} name={props.title || ''}>
                        <ExcelColumn label="Họ tên" value="ho_ten"/>
                        <ExcelColumn label="Số mô-đun" value="so_mo_dun"/>
                        <ExcelColumn label="Số khóa học" value="so_khoa_hoc"/>              
                        <ExcelColumn label="Người tạo" value="nguoi_tao"/>
                        <ExcelColumn label="Ngày tạo" value={(col) => moment(col.ngay_tao).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                        <ExcelColumn label="Người sửa" value="nguoi_sua"/>
                        <ExcelColumn label="Ngày sửa" value={(col) => moment(col.ngay_sua).utc(7).format(config.DATE_FORMAT_SHORT)}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }         
              {props.dataExportStatisticStudent &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportStatisticStudent} name={props.title || ''}>
                        <ExcelColumn label="Họ tên" value="ho_ten"/>
                        <ExcelColumn label="Tên khóa học" value="ten_khoa_hoc"/>    
                        <ExcelColumn label="Trạng thái" value={(col) => (col.trang_thai === 1 || col.trang_thai === 0) ? "Đã mua" : "Chưa mua"}/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }   
              {props.buttonBack &&
              <Col xl={3} md={6} xs={2}>
                <Button type="button" onClick={() => history.push(props.linkBack)} className="ant-btn ant-btn-primary">Quay lại</Button>
              </Col>
              }
            {(props.totalStudent && props.totalStudent !== 0) && <h5>Tổng số học viên: <b>{props.totalStudent}</b></h5>}
            {props.dataExportStudent &&
                <Col xl={3} md={6} xs={2}>  
                  <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={props.title || ''}>
                    <ExcelSheet data={props.dataExportStudent} name={props.title || ''}>
                        <ExcelColumn label="Họ tên" value="ho_ten"/>
                        <ExcelColumn label="Giới tính" value="gioi_tinh"/>
                        <ExcelColumn label="Trường học" value="truong_hoc"/>
                        <ExcelColumn label="Tỉnh/Thành phố" value="tinh"/>
                        <ExcelColumn label="Ngày sinh" value={(col) => col.ngay_sinh !== null ? moment(col.ngay_sinh).format(config.DATE_FORMAT) : ''}/>
                        <ExcelColumn label="Email" value="ten_khoa_hoc"/>    
                        <ExcelColumn label="Số điện thoại" value="sdt"/>
                    </ExcelSheet>
                  </ExcelFile>
                </Col>
              }  
            </Row>
          </Col>
        </Row>
        }   
      </Col>
    </Row>
  );
}

export default AppFilter;
