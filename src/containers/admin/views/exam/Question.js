import React, { useEffect, useState } from "react";

import config from '../../../../configs/index'
import { Row, Table, Space, Col, Button, Pagination, notification, Modal, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MathJax from 'react-mathjax';
import './css/question.css';

// component
import LoadingCustom from "components/parts/loading/Loading";

// redux
import { useSelector, useDispatch } from "react-redux";
import * as questionActions from '../../../../redux/actions/question';
import * as majorActions from '../../../../redux/actions/major';
import * as programmeAction from '../../../../redux/actions/programme';

const { confirm } = Modal;
const { Option } = Select;

const QuestionPage = () => {
    const regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
    const dispatch = useDispatch();

    const majors = useSelector(state => state.major.list.result);
    const programmes = useSelector(state => state.programme.list.result);
    const questions = useSelector(state => state.question.list.result);
    const loading = useSelector(state => state.question.list.loading);
    const error = useSelector(state => state.question.list.error);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState({
      kct_id: '',
      chuyen_nganh_id: '',
    });

    useEffect(() => {
      dispatch(majorActions.getMajors());
      dispatch(programmeAction.getProgrammes({ status: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      dispatch(questionActions.getQuestions({ kct_id: filter.kct_id, chuyen_nganh_id: filter.chuyen_nganh_id, pageSize: pageSize, pageIndex: pageIndex }));
    }, [pageSize, pageIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      dispatch(questionActions.getQuestions({ kct_id: filter.kct_id, chuyen_nganh_id: filter.chuyen_nganh_id, pageSize: pageSize, pageIndex: pageIndex }));
    }, [filter.chuyen_nganh_id, filter.kct_id]) // eslint-disable-line react-hooks/exhaustive-deps

    const showConfirmDelete = (cau_hoi_id) => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
        okText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
        onOk() {
          deleteQuestion(cau_hoi_id);
        },
        onCancel() {
          Modal.destroyAll();
        },
      });
    };

    // Hàm hiển thị bộ lọc 'Chuyên ngành'
    const renderMajor = () => {
      let options = [];
      if (majors.status === 'success') {
        options = majors.data.map((major) => (
          <Option key={major.chuyen_nganh_id} value={major.chuyen_nganh_id} >{major.ten_chuyen_nganh}</Option>
        ))
      }
      return (
        <Select style={{width: '100%'}}
          showSearch={true}
          allowClear
          onChange={(chuyen_nganh_id) => {
            if (chuyen_nganh_id === undefined) setFilter({ ...filter, chuyen_nganh_id: '' });
            else setFilter({ ...filter, chuyen_nganh_id: chuyen_nganh_id });
          }}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          placeholder="Chọn chuyên ngành"
        >
          {options}
        </Select>
      );
    };

    // Hàm hiển thị bộ lọc 'Khung chương trình'
    const renderProgramme = () => {
      let options = [];
        if (programmes.status === 'success') {
            options = programmes.data.map((programme) => (
                <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
            ))
        }
        return (
            <Select style={{width: '100%'}}
              showSearch={true}
              allowClear
              placeholder="Chọn khung chương trình"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onChange={(kct_id) => {
                if (kct_id === undefined) setFilter({ ...filter, kct_id: '' });
                else setFilter({ ...filter, kct_id: kct_id });
              }}
            >
            {options}
            </Select>
      );
    };

    const column = [
        {
          title: 'Câu hỏi',
          dataIndex: 'noi_dung',
          key: 'noi_dung',
          responsive: ['md'],
          render: (noi_dung) => (
            <div className="title-exam">
              <MathJax.Provider>
                {noi_dung?.split('\n').map((item, index_cauhoi) => {
                  return (
                      <div className="help-answer-content" key={index_cauhoi}> 
                      {
                          (item.indexOf('includegraphics') !== -1 && item !== '' && item?.match(regex) !== null && item?.match(regex).length >= 2) ? (
                            <img src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question_${index_cauhoi}`}></img>
                          ) : (
                              item.split('$').map((item2, index2) => {
                                  return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                      <MathJax.Node key={index2} formula={item2} />
                                  ) : (
                                      <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                  )
                              })
                          )
                      }
                      </div>
                  )}
              )}
            </MathJax.Provider>
          </div>
        )
        },
        {
          title: 'Chuyên ngành',
          dataIndex: 'chuyen_nganh',
          key: 'chuyen_nganh',
          responsive: ['md'],
          render: (chuyen_nganh, cau_hoi) => cau_hoi?.chuyen_nganh?.ten_chuyen_nganh
        },
        {
          title: 'Tùy chọn',
          key: 'cau_hoi_id',
          dataIndex: 'cau_hoi_id',
          // Redirect view for edit
          render: (cau_hoi_id) => (
            <Space size="middle">
              {/* <Link to={ "#" } type="button" className="ant-btn ant-btn-round ant-btn-primary">Xem</Link> */}
              <Button shape="round" type="danger" onClick={() => showConfirmDelete(cau_hoi_id)}>Xóa</Button> 
            </Space>
          ),
        },
    ];

    const onChangePageIndex = (page) => {
      setPageIndex(page);
    };
    
    const onShowSizeChange = (current, pageSize) => {
      setPageSize(pageSize);
    };

    // hàm xóa câu hỏi 
    const deleteQuestion = (idQuestion) => {
      const callback = (res) => {
        if (res.data.status === 'success') {
          notification.success({
            message: 'Thông báo',
            description: 'Xóa câu hỏi thành công',
          });
          dispatch(questionActions.getQuestions({ kct_id: '', chuyen_nganh_id: '', pageSize: pageSize, pageIndex: pageIndex }));
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Xóa câu hỏi thất bại',
          });
        }
      }

      dispatch(questionActions.deleteQuestion({ idQuestion: idQuestion }, callback));
    }

    return (
        <div className="content">
            <Row className="app-main">
                <Col xl={24} className="body-content">
                  <h5>Quản lý câu hỏi</h5>
                  {/* Bộ lọc */}
                  <Row gutter={8}>
                    <Col xl={8} md={24} xs={24}>
                      {renderMajor()}
                    </Col>
                    <Col xl={12} md={24} xs={24}>
                      {renderProgramme()}
                    </Col>
                  </Row>
                </Col>
            </Row>
            <br/>
            {loading && <LoadingCustom/>}
            {questions.status === 'success' && 
              <div className="question-list">
                <Table className="table-striped-rows" pagination={false} columns={column} dataSource={questions.data}/>
                <br/>
                <Pagination current={pageIndex}
                  onChange={onChangePageIndex} 
                  total={questions.totalCount} 
                  onShowSizeChange={onShowSizeChange} 
                  defaultPageSize={pageSize}
                />
              </div>
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}

        </div>
    )
}

export default QuestionPage;
