import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Hashids from 'hashids';
import LoadingCustom from "components/parts/loading/Loading";
import config from '../../../../configs/index';
import constants from '../../../../helpers/constants';
import MathJax from 'react-mathjax';
import './css/ExamOnline.css';

// antd
import { Row, Col, Form, Steps, Tabs, Modal,
    Input, Upload, message, Result,
    Select, Image, Button, notification, Radio } from 'antd';
import { UploadOutlined, SaveOutlined, RightOutlined, LeftOutlined, 
    CloseOutlined, ExclamationCircleOutlined, TeamOutlined, } from '@ant-design/icons';
import TextEditorWidget from 'components/common/TextEditor/TextEditor';

// image
import nottickImg from 'assets/img/math-icons/ic_tick_disabled.png';
import tickImg from 'assets/img/math-icons/ic_tick.png';

// redux
import { useSelector, useDispatch } from "react-redux";
import * as examActions from '../../../../redux/actions/exam';
import * as programmeActions from '../../../../redux/actions/programme';
import * as courseActions from '../../../../redux/actions/course';
import * as typeExamActions from '../../../../redux/actions/typeExam';
import * as exceprtActions from '../../../../redux/actions/exceprt';
import * as answerActions from '../../../../redux/actions/answer';
import * as questionActions from '../../../../redux/actions/question';
import * as majorActions from '../../../../redux/actions/major';

const { Step } = Steps;
const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const defaultExam = {
    ten_de_thi: '',
    khoa_hoc_id: '',
    mo_dun_id: '',
    chuyen_de_id: '',
    anh_dai_dien: '',
    loai_de_thi_id: '',
    trang_thai: true,
    mo_ta: ''
};

const defaultQuestion = {
    noi_dung: '',
    loi_giai: '',
    chu_de_id: '',
    de_thi_id: '',
    loai_cau_hoi: '',
    muc_do_cau_hoi: '',
    kieu_cau_hoi: 'LUA_CHON',
    mo_dun_id: '',
    dap_an_dung: '',
    kieu_hien_thi_dap_an: 'HANG_1_COT',
    nhom_cau_hoi_id: '',
    trang_thai: 'active',
    trich_doan: '',
    diem: '1',
    dap_an: [
        { tieu_de: '', label: 'Đáp án A', key: 'A' },
        { tieu_de: '', label: 'Đáp án B', key: 'B' },
        { tieu_de: '', label: 'Đáp án C', key: 'C' },
        { tieu_de: '', label: 'Đáp án D', key: 'D' },
    ],
    dap_an_tu_luan: [
        { tieu_de: '', label: 'Đáp án', key: 'A' },
    ],
};

const OnlineExamDetailPage = () => {
    let history = useHistory();
    const [form] = Form.useForm();
    const [questionForm] = Form.useForm();
    const id = useParams().id; // id
    const hashids = new Hashids();
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(defaultQuestion);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const exam = useSelector(state => state.exam.item.result);
    const loading = useSelector(state => state.exam.item.loading);
    const error = useSelector(state => state.exam.item.error);

    const criteria = useSelector(state => state.exam.criteria.result);
    const programmes = useSelector(state => state.programme.list.result);
    const courses = useSelector(state => state.course.list.result);
    const typeExams = useSelector(state => state.typeExam.list.result);
    const exceprts = useSelector(state => state.exceprt.list.result);
    const question = useSelector(state => state.question.item.result);
    const majors = useSelector(state => state.major.list.result);

    const [state, setState] = useState({
        so_cau_hoi: 0,
        isEdit: false,
        idQuestion: '',
        indexQuestion: 0,
        // file
        fileImg: '',
        defaultExam: defaultExam,
        showTuLuan: false,
        showTextTuLuan: false,
        showTextTuLuan2: false,
        typeQuestion: 0,
    });

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
          setState({ ...state, fileImg: '' });
        },
    };

    useEffect(() => {
        const callback = (res) => {
            // lấy số lượng câu hỏi của đề theo tiêu chí đề  thi thuộc vào
            if (res.status === 'success') {
                dispatch(examActions.getCriteriaDGNLById({  idCourse: res.data.khoa_hoc_id }));
            };
        };

        dispatch(examActions.getExam({ id: id }, callback));
        dispatch(programmeActions.getProgrammes({ status: '' }));
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
        dispatch(typeExamActions.getTypes());
        dispatch(exceprtActions.getExceprts({ pageSize: 1000000000, pageIndex: 1, id: '' }));
        dispatch(majorActions.getMajors()); // request chuyên ngành
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const next = () => {
        if (currentStep === 0) {
            setCurrentStep(1);
            state.so_cau_hoi = state.so_cau_hoi + criteria.data[`so_cau_hoi_phan_${currentStep + 1}`] // số câu hỏi tại mỗi phần
        } else if (currentStep >= 1 && currentStep <= criteria.data.so_phan + 1) {
            if (exam.data.cau_hoi_de_this.length < state.so_cau_hoi) {
                Modal.warning({
                    title: 'Thông báo',
                    content: 'Bạn chưa nhập đủ số lượng câu hỏi.',
                });
            } else {
                state.so_cau_hoi = state.so_cau_hoi + criteria.data[`so_cau_hoi_phan_${currentStep + 1}`] // số câu hỏi tại mỗi phần
                setCurrentStep(currentStep + 1);
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    // cập nhật câu hỏi
    const save = () => {
        form.submit();
    };
    
    // render hỏi cập nhật câu hỏi
    const EditQuestion = (cau_hoi, index) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: `Bạn muốn cập nhật lại câu hỏi số ${index + 1}?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                dispatch(questionActions.getQuestion({ id: cau_hoi.cau_hoi_id }, (res) => {
                    if (res.status === 'success') {
                        let dap_an_dung = [''];
                        let dap_ans = [];
                        res.data.dap_ans.map((item, index) => {
                            switch(index) {
                                case 0:
                                    if (item.dap_an_dung) dap_an_dung.push('A');
                                    dap_ans.push({ tieu_de: item.noi_dung_dap_an, label: 'Đáp án A', key: 'A' });
                                    break;
                                case 1:
                                    if (item.dap_an_dung) dap_an_dung.push('B');
                                    dap_ans.push({ tieu_de: item.noi_dung_dap_an, label: 'Đáp án B', key: 'B' });
                                    break;
                                case 2:
                                    if (item.dap_an_dung) dap_an_dung.push('C');
                                    dap_ans.push({ tieu_de: item.noi_dung_dap_an, label: 'Đáp án C', key: 'C' });
                                    break;
                                case 3: 
                                    if (item.dap_an_dung) dap_an_dung.push('D');
                                    dap_ans.push({ tieu_de: item.noi_dung_dap_an, label: 'Đáp án D', key: 'D' });
                                    break; 
                                default:  
                                    if (item.dap_an_dung) dap_an_dung.push('');
                                    break;                                   
                            }
                            return null;
                        });
    
                        questionForm.setFieldsValue({
                            trich_doan: res.data.trich_doan_id ? res.data.trich_doan_id : '',
                            diem: res.data.diem,
                            loai_cau_hoi: res.data.loai_cau_hoi,
                            muc_do_cau_hoi: res.data.mdch_id,
                            kieu_hien_thi_dap_an: res.data.cot_tren_hang.toString(),
                            dap_an_dung: dap_an_dung,
                            chuyen_nganh_id: res.data.chuyen_nganh_id,
                            //
                            noi_dung: res.data.noi_dung,
                            dap_an: dap_ans,
                            loi_giai: res.data.loi_giai,
                        });
                        setCurrentQuestion({...currentQuestion, noi_dung: res.data.noi_dung, 
                            dap_an: dap_ans, loi_giai: res.data.loi_giai,
                        });
    
                        setState({ ...state, isEdit: true, idQuestion: cau_hoi.cau_hoi_id, indexQuestion: index + 1,
                            showTuLuan: res.data.loai_cau_hoi === 0 ? true : false, 
                            showTextTuLuan: res.data.loai_cau_hoi === 0 ? true : false, 
                            showTextTuLuan2: res.data.loai_cau_hoi === 0 ? true : false })
                    }
                }));
            },
        });
    };

    // render danh sách câu hỏi cho sidebar bên phải 
    const renderQuestions = () => {
        const questionArr = exam.data.cau_hoi_de_this.map((question, index) => {
            return (
                <div
                    className={`${currentQuestion.cau_hoi_id === question.cau_hoi_id ? 'active' : ''} item`}
                    key={index}
                    onClick={() => {
                        EditQuestion(question.cau_hoi, index);
                    }}
                >
                    <CloseOutlined
                        title="Xóa câu hỏi"
                        onClick={(e) => {
                            e.stopPropagation();
                            questionForm.setFieldsValue(defaultQuestion);
                            Modal.confirm({
                                title: 'Xóa câu hỏi',
                                content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
                                okText: 'Có',
                                cancelText: 'Không',
                                onOk: () => handleRemoveQuestion(question.chdt_id),
                            });
                        }}
                    />
      
                    <div className="header-question">
                        Câu {index + 1} 
                        <span className="point">
                            {/* [{question.cau_hoi.diem} điểm] */}
                            {majors.data.filter((marjor) => marjor.chuyen_nganh_id === question.cau_hoi.chuyen_nganh_id)[0]?.ten_chuyen_nganh}
                            {question.cau_hoi.loai_cau_hoi === 2 && 'Câu hỏi đúng sai'}
                        </span>
                    </div>
                    {(question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) ?
                        <div className="body-question">
                            {question.cau_hoi.dap_ans.map((item, idx) => {
                                return (
                                    <div className="answer-detail" key={idx}>
                                        {(item.dap_an_dung === true) && <img src={tickImg} alt="tick"/>}
                                        {(item.dap_an_dung === false || item.dap_an_dung === null) && <img src={nottickImg} alt="not tick"/>}
                                        <div className="answer-position">{item.dap_an_dung}</div>
                                    </div>
                                );
                            })}
                        </div>
                    : 
                        <div className='body-question' style={{color: question.cau_hoi.dap_ans.length === 0 ? 'red' : 'black'}}>
                            <div className="answer-detail">Câu hỏi Tự Luận</div>
                        </div>}
                </div>
            );
          });
        return <div className="question-items">{questionArr}</div>;
    };

    const renderAnswer = () => {
        return (
            <Select
                mode='multiple'
                allowClear
                showSearch={false}
                placeholder="Chọn đáp án"
            >
                <Option value='A'>Đáp án A</Option>
                <Option value='B'>Đáp án B</Option>
                <Option value='C'>Đáp án C</Option>
                <Option value='D'>Đáp án D</Option>
            </Select>
            );
    };

    const renderProgramme = () => {
        let options = [];
        if (programmes.status === 'success') {
            options = programmes.data
                .filter(programme => programme.loai_kct !== 2)
                .map((programme) => (
                    <Option key={programme.kct_id} value={programme.kct_id} >{programme.ten_khung_ct}</Option>
                ))
        }
        return (
            <Select
                showSearch={true}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                placeholder="Chọn khung chương trình"
                onChange={(kct_id) => dispatch(courseActions.getCourses({ idkct: kct_id, status: '', search: '' }))}
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
                showSearch={true}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                placeholder="Chọn khóa học"
            >
                {options}
            </Select>
        );
    };

    // render UI chuyên ngành
    const renderMajor = () => {
        let options = [];
        if (majors.status === 'success') {
          options = majors.data.map((major) => (
            <Option key={major.chuyen_nganh_id} value={major.chuyen_nganh_id} >{major?.ten_chuyen_nganh}</Option>
          ))
        }
        return (
            <Select
                showSearch={true}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                placeholder="Chọn Chuyên ngành"
            >
                {options}
            </Select>
        );
    }

    const renderExamCategories = () => {
        let options = [];
        if (typeExams.status === 'success') {
            options = typeExams.data.map((type) => (
                <Option key={type.loai_de_thi_id} value={type.loai_de_thi_id} >{type.mo_ta}</Option>
            ));
            options.push(<Option key={'5'} value={5} >Đề thi mẫu ĐGNL</Option>)
        }
        return (
            <Select
                disabled={true}
                showSearch={false}
                placeholder="Chọn loại đề thi"
            >
                {options}
            </Select>
        );
    }

    const handleChangeType = (type) => {
        if (type.target.value === 0 ) { // tự luận 
            setState({...state, showTuLuan: true, showTextTuLuan: true, showTextTuLuan2: true, typeQuestion: type.target.value});
        } else {
            setState({...state, showTuLuan: false, showTextTuLuan: false, showTextTuLuan2: false, typeQuestion: type.target.value});
        }
    };

    // Cập nhật thông tin đề thi
    const handleSaveExam = (values) => {
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                dispatch(examActions.getExam({ id: id }));
                setState({ ...state, fileImg: '' });
                notification.success({
                    message: 'Thành công',
                    description: 'Sửa thông tin đề thi thành công',
                });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Sửa thông tin đề thi thất bại',
                })
            }
        };
        const formData = new FormData();
        formData.append('ten_de_thi', values.ten_de_thi);
        formData.append('mo_ta', values.mo_ta !== undefined ? values.mo_ta : '' );
        formData.append('loai_de_thi_id', values.loai_de_thi_id);
        formData.append('de_thi_ma', (values.de_thi_ma !== undefined || values.de_thi_ma !== null || values.de_thi_ma !== 'null') 
                                        ? values.de_thi_ma : '');


        if (values.khoa_hoc_id === "") {
            notification.error({
                message: 'Thông báo',
                description: 'Bạn chưa chọn khóa học',
            })
            return;
        }
        formData.append('khoa_hoc_id', values.khoa_hoc_id);
        
        if (state.fileImg !== '')
            formData.append('anh_dai_dien', state.fileImg !== undefined ? state.fileImg : '');
        dispatch(examActions.editExam({ formData: formData, idExam: id }, callback));
    };

    // Cập nhật câu hỏi
    const handleSaveQuestion = (values) => {
        if (!state.isEdit) {
            if (exam.data.cau_hoi_de_this.length === state.so_cau_hoi) {
                Modal.warning({
                    title: 'Thông báo',
                    content: 'Bạn đã nhập đủ số lượng câu hỏi.',
                });
                return;
            };
        }

        const subCallBack = (res) => {
            if (res.status === 200 ) {
                questionForm.resetFields();
                notification.success({
                    message: state.isEdit ? 'Sửa câu hỏi thành công.' : 'Thêm mới câu hỏi thành công.',
                });
            }
        };

        const subCallBack2 = (res) => {
            if (res.status === 200 ) {
                questionForm.resetFields();
                notification.success({
                    message: state.isEdit ? 'Cập nhật câu hỏi thành công.' : 'Thêm mới đáp án thành công.',
                });
                setState({...state, isEdit: false});
            }
            dispatch(examActions.getExam({ id: id }));
        };

        const callback = (res) => {
            if (res.status === 200) {   
                if (!state.isEdit) {
                    const questionExam = { cau_hoi_id: res.data.data.cau_hoi_id, de_thi_id: id, chuyen_nganh_id: values.chuyen_nganh_id }
                    dispatch(questionActions.createQuestionExam(questionExam, subCallBack));             
                    
                    const answer = new FormData();
                    if (values.loai_cau_hoi === 1 || values.loai_cau_hoi === 2) { // Trắc nghiệm
                        for (let i = 0; i < values.dap_an.length; i++) {
                            answer.append(`noi_dung_dap_an${i+1}`, values.dap_an[i].tieu_de)
                        };
                        let dap_an_dung = values.dap_an_dung;
                        if (dap_an_dung[0] === '') dap_an_dung.shift(); // xóa phần tử đâu tiên ''
                        for (let i = 0; i < dap_an_dung.length; i++) {
                            if (dap_an_dung[i] === 'A') answer.append('dap_an_dung1', 1)
                            if (dap_an_dung[i] === 'B') answer.append('dap_an_dung2', 1)
                            if (dap_an_dung[i] === 'C') answer.append('dap_an_dung3', 1)
                            if (dap_an_dung[i] === 'D') answer.append('dap_an_dung4', 1)
                        }
                    } else {// Tự luận
                        answer.append(`noi_dung_dap_an1`, values.dap_an_tu_luan[0].tieu_de)
                    }
                    answer.append('cau_hoi_id', res.data.data.cau_hoi_id);

                    dispatch(answerActions.createANSWER(answer, subCallBack2));
                } else { // Sửa đáp án
                    
                    const answer = new FormData();
                    if (question.data.loai_cau_hoi === values.loai_cau_hoi) { // cùng 1 câu hỏi
                        if (values.loai_cau_hoi === 1 || values.loai_cau_hoi === 2) { // Trắc nghiệm
                            answer.append('loai_cau_hoi', values.loai_cau_hoi); 
                            for (let i = 0; i < values.dap_an.length; i++) {
                                answer.append(`noi_dung_dap_an${i+1}`, values.dap_an[i].tieu_de)
                                answer.append(`dap_an_id${i+1}`, question.data.dap_ans[i].dap_an_id)
                            };
                            let dap_an_dung = values.dap_an_dung;
                            if (dap_an_dung[0] === '') dap_an_dung.shift(); // xóa phần tử đâu tiên ''
                            for (let i = 0; i < dap_an_dung.length; i++) {
                                if (dap_an_dung[i] === 'A') answer.append('dap_an_dung1', 1)
                                else if (dap_an_dung[i] === 'B') answer.append('dap_an_dung2', 1)
                                else if (dap_an_dung[i] === 'C') answer.append('dap_an_dung3', 1)
                                else if (dap_an_dung[i] === 'D') answer.append('dap_an_dung4', 1)
                            }
                        } else {// Tự luận
                            answer.append('loai_cau_hoi', values.loai_cau_hoi); 
                            answer.append(`noi_dung_dap_an1`, values.dap_an_tu_luan[0].tieu_de)
                            answer.append('dap_an_id1', question.data.dap_ans[0].dap_an_id)
                        }
                        dispatch(answerActions.editANSWER({ formData: answer, de_thi_id: id  }, subCallBack2));
                    } else { // đổi loại câu hỏi
                        if (values.loai_cau_hoi === 1 || values.loai_cau_hoi === 2) { // Tự luận -> Trắc nghiệm
                            // Xoá đáp án hiện có
                            dispatch(answerActions.deleteAnswerByQuestion({ id: question.data.cau_hoi_id }));
                            // Tạo lại đáp án mới
                            for (let i = 0; i < values.dap_an.length; i++) {
                                answer.append(`noi_dung_dap_an${i+1}`, values.dap_an[i].tieu_de)
                            };
                            let dap_an_dung = values.dap_an_dung;
                            if (dap_an_dung[0] === '') dap_an_dung.shift(); // xóa phần tử đâu tiên ''
                            for (let i = 0; i < dap_an_dung.length; i++) {
                                if (dap_an_dung[i] === 'A') answer.append('dap_an_dung1', 1)
                                else if (dap_an_dung[i] === 'B') answer.append('dap_an_dung2', 1)
                                if (dap_an_dung[i] === 'C') answer.append('dap_an_dung3', 1)
                                if (dap_an_dung[i] === 'D') answer.append('dap_an_dung4', 1)
                            }
                        } else { // Trắc nghiệm -> Tự luận
                            // Xoá đáp án hiện có
                            dispatch(answerActions.deleteAnswerByQuestion({ id: question.data.cau_hoi_id }));
                            // Tạo lại đáp án mới
                            answer.append(`noi_dung_dap_an1`, values.dap_an_tu_luan[0].tieu_de)
                        }
                        answer.append('cau_hoi_id', state.idQuestion);

                        dispatch(answerActions.createANSWER(answer, subCallBack2));
                    }
                }
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm câu hỏi mới thất bại',
                })
            }
        };

        // create form for craete question
        // Thiếu khung chương trình
        const formQuestionData = new FormData();
        formQuestionData.append('noi_dung', currentQuestion.noi_dung);
        formQuestionData.append('loai_cau_hoi', values.loai_cau_hoi);
        formQuestionData.append('mdch_id', values.muc_do_cau_hoi);
        formQuestionData.append('diem', values.diem);
        formQuestionData.append('loi_giai', values.loi_giai);
        formQuestionData.append('cot_tren_hang', values.kieu_hien_thi_dap_an);
        formQuestionData.append('chuyen_nganh_id', values.chuyen_nganh_id);

        if (state.fileImg !== '')
            formQuestionData.append('tep_dinh_kem_noi_dung', state.fileImg !== undefined ? state.fileImg : '');
        if (values.trich_doan !== '')
            formQuestionData.append('trich_doan_id', values.trich_doan);    
        if (state.isEdit) {
            dispatch(questionActions.editQuestion({ idQuestion: state.idQuestion, formData: formQuestionData, de_thi_id: id }, callback));        
        } else {
            dispatch(questionActions.createQuestion(formQuestionData, callback));         
        }
    };

    const handlePublishExam = () => {
        const callback = (res) => {
            if (res.status === 'success') {
                notification.success({
                    message: 'Xuất bản đề thi thành công.',
                });   
                if (new URLSearchParams(history.location.search).get('loai_de_thi') === 'DGNL') {
                    history.push('/admin/question/examDgnl');
                } else {
                    history.push('/admin/question/exam');
                }
            }
        };

        dispatch(examActions.publishExam({ id: id }, callback))
    };

    const handleRemoveQuestion = (idQ) => {
        
        const callback = (res) => {
            setState({...state, isEdit: false, idQuestion: 0, indexQuestion: 0});

            if (res.status === 200 && res.statusText === 'OK') {
                dispatch(examActions.getExam({ id: id }));
                notification.success({
                    message: 'Xóa câu hỏi thành công.',
                });   
            }
        }
        dispatch(questionActions.deleteQuestionExam({ idQuestion: idQ }, callback))
    };

    const chooseExceprt = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn chọn trích đoạn này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                questionForm.setFieldsValue({'trich_doan': id})
                setIsModalVisible(false);
            },
        });
    };

    return (
        <div className="content">
            {loading && <LoadingCustom/>}
            <Row className="app-main" gutter={25}>
                <Col xs={24} className="body-content">
                    <div className='exam-page'>
                        <Steps current={currentStep} style={{maxWidth: '100%'}}>
                            <Step title="Thông tin chung" />
                            {
                                Array.from({ length: criteria?.data?.so_phan }).map((_, index) => {
                                    return <Step title={`Danh sách câu hỏi phần ${index + 1}`} />
                                })
                            }
                            <Step title="Hoàn thành" />
                        </Steps>
                    </div>

                    <Tabs activeKey={`step_${currentStep}`}>
                    {(exam && exam.status === 'success' && criteria.status === 'success') &&         
                    <>
                        <TabPane tab="Thông tin" key="step_0">
                            <Form layout="vertical" className="ExamForm" onFinish={handleSaveExam} form={form}>
                                <Row gutter={25}>
                                    <Col xl={18} sm={24} xs={24} className="left-content">
                                        <div className="border-box">
                                            <Row gutter={25}>
                                                <Col xl={24} sm={12} xs={24}>
                                                    <Form.Item
                                                        initialValue={exam.data.de_thi_ma}
                                                        className="input-col"
                                                        label="Mã đề thi"
                                                        name="de_thi_ma"
                                                        rules={[]}
                                                    >
                                                        <Input placeholder="Mã đề thi"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={24} sm={12} xs={24}>
                                                    <Form.Item
                                                        initialValue={exam.data.ten_de_thi}
                                                        className="input-col"
                                                        label="Tên đề thi"
                                                        name="ten_de_thi"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Tên đề thi là trường bắt buộc',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Tên đề thi"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={7} sm={12} xs={24}>
                                                    <Form.Item label="Khung chương trình" name="kct_id"
                                                        initialValue={exam.data.kct_id}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Tên đề thi là trường bắt buộc',
                                                            },
                                                        ]}
                                                    >
                                                        {renderProgramme()}
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={7} sm={12} xs={24}>
                                                    <Form.Item label="Khóa học" name="khoa_hoc_id"  
                                                        initialValue={exam.data.khoa_hoc_id !== null ? exam.data.khoa_hoc_id : ''}>
                                                        {renderCourse()}
                                                    </Form.Item>
                                                </Col>
                                                <Col xl={24} sm={12} xs={24}>
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
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>         
                                    <Col xl={6} sm={24} xs={24} className="right-content">
                                        <div className="border-box">
                                            <Form.Item
                                                initialValue={exam.data.loai_de_thi_id}
                                                label="Loại đề thi"
                                                className="input-col"
                                                name="loai_de_thi_id"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Loại đề thi là trường bắt buộc.',
                                                    },
                                                ]}
                                            >
                                                {renderExamCategories()}
                                            </Form.Item>
                                        </div>
                                        <Image
                                            width={400}
                                            height={400}
                                            src={config.API_URL + exam.data.anh_dai_dien}
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                        />
                                    </Col>
                                </Row>                              
                            </Form>
                        </TabPane>
                        
                        {
                            Array.from({ length: criteria?.data?.so_phan }).map((_, index) => {
                                return (
                                    <TabPane tab={`Tạo câu hỏi phần ${index + 1}`} key={`step_${index + 1}`}>
                                        <Row gutter={[16, 16]} style={{marginBottom: 12}}>
                                            {majors.data.map((major) => (
                                                <Col xl={4} lg={6} md={12} sm={12} xs={24}>
                                                    <div className="dashboard-stat stat-user">
                                                        <div className="visual"><TeamOutlined /></div>
                                                        <div className="detail">
                                                            <div className="number">
                                                                <span>{exam.data.cau_hoi_de_this.filter((cau_hoi) => cau_hoi.cau_hoi.chuyen_nganh_id === major.chuyen_nganh_id).length}</span>
                                                            </div>
                                                            <div className="dashboard-stat stat-user">
                                                                <div className="desc">
                                                                {major?.ten_chuyen_nganh} <RightOutlined />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>  
                                        <Form layout="vertical" className="QuestionForm" onFinish={handleSaveQuestion} form={questionForm} initialValues={defaultQuestion}>
                                            <Row gutter={25}>
                                                <Col xl={18} sm={24} xs={24} className="left-content">
                                                    <div className="border-box question-content">
                                                        <Row gutter={0}>
                                                            <Col xl={24} sm={24} xs={24}>
                                                                {state.isEdit && 
                                                                    <Row>
                                                                        <Col>
                                                                            <Form.Item className="label"><span style={{color: 'red'}}>Bạn đang cập nhật câu hỏi số {state.indexQuestion} (ID câu hỏi: {state.idQuestion})</span></Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                }
                                                                {/* Section đề bài */}
                                                                <Col xl={24}>
                                                                    <Form.Item className="label">
                                                                        <span style={{ color: '#000', fontWeight: 600 }}>Nội dung</span>
                                                                    </Form.Item>
                                                                </Col>
                                                                <Row>         
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Nội dung câu hỏi
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={20} key={`key${index}`}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="noi_dung"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'Nội dung câu hỏi là trường bắt buộc',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <TextEditorWidget 
                                                                                disabled={state.defaultExam.trang_thai === false}
                                                                                valueParent={currentQuestion.noi_dung}
                                                                                placeholder="Thêm nội dung câu hỏi"
                                                                                onChange={(val) => {
                                                                                    setCurrentQuestion({ ...currentQuestion, noi_dung: val });
                                                                                }}
                                                                                isSimple={true} 
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#000' }}>Hình ảnh câu hỏi</span>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={20} key={`key${index}`}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="tep_dinh_kem_noi_dung"
                                                                        >
                                                                            <Dragger {...propsImage} style={{width: '90%'}} maxCount={1}>
                                                                                <p className="ant-upload-drag-icon">
                                                                                    <UploadOutlined />
                                                                                </p>
                                                                                <p className="ant-upload-text">Kéo thả hình ảnh tại đây</p>
                                                                                <p className="ant-upload-hint">
                                                                                    Định dạng hình ảnh JPEG/PNG
                                                                                </p>
                                                                            </Dragger>
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                {/* Section tuỳ chọn */}
                                                                <Col xl={24}>
                                                                    <Form.Item className="label">
                                                                        <span style={{ color: '#000', fontWeight: 600 }}>Tùy chọn câu hỏi</span>
                                                                    </Form.Item>
                                                                </Col>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span>Tùy chọn thêm</span>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={4}>
                                                                        <Form.Item>
                                                                            <Button type='primary' onClick={() => history.push('/admin/sample/question/' + id)}>Câu hỏi có sẵn</Button>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={3}>
                                                                        <Form.Item>
                                                                            <Button type='primary' onClick={showModal}>Trích đoạn</Button>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={3}>
                                                                        <Form.Item className="label">
                                                                            <span>Trích đoạn</span>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={4}>
                                                                        <Form.Item
                                                                            initialValue={currentQuestion.trich_doan}
                                                                            value
                                                                            className="input-col"
                                                                            label=""
                                                                            name="trich_doan"
                                                                            rules={[]}
                                                                        >
                                                                            <Input placeholder='Trích đoạn sử dụng'/>
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Loại câu hỏi
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={10}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="loai_cau_hoi"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'Loại câu hỏi là trường bắt buộc',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Radio.Group onChange={(type) => handleChangeType(type)} options={constants.QUESTIONS_TYPES} optionType="button" buttonStyle="solid" />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Chuyên ngành
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={10}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="chuyen_nganh_id"
                                                                            rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Chuyên ngành là trường bắt buộc',
                                                                            },
                                                                            ]}
                                                                        >
                                                                            {renderMajor()}
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Điểm câu hỏi
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={6}>
                                                                        <Form.Item
                                                                            initialValue={currentQuestion.diem}
                                                                            className="input-col"
                                                                            label=""
                                                                            name="diem"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: 'Điểm là trường bắt buộc',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input disabled={state.typeQuestion === 2 ? true : false} placeholder="Nhập điểm câu hỏi" style={{width: '60%'}}/>
                                                                        </Form.Item>
                                                                    </Col>  
                                                                </Row>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Mức độ câu hỏi
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={20}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="muc_do_cau_hoi"
                                                                            rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Mức độ câu hỏi là trường bắt buộc',
                                                                            },
                                                                            ]}
                                                                        >
                                                                            <Radio.Group options={constants.QUESTIONS_LEVELS} optionType="button" buttonStyle="solid" />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{display: !state.showTuLuan ? '' : 'none'}}>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">
                                                                            <span style={{ color: '#ff4d4f' }}>*</span>Đáp án đúng
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xl={20}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="dap_an_dung"
                                                                            rules={[
                                                                            {
                                                                                required: !state.showTuLuan,
                                                                                message: 'Đáp án đúng là trường bắt buộc',
                                                                            },
                                                                            ]}
                                                                        >
                                                                            {renderAnswer()}
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label"><span style={{ color: '#ff4d4f' }}>*</span>Hiển thị đáp án</Form.Item>
                                                                    </Col>
                                                                    <Col xl={20}>
                                                                        <Form.Item
                                                                            className="input-col"
                                                                            label=""
                                                                            name="kieu_hien_thi_dap_an"
                                                                            rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Hiển thị đáp án',
                                                                            },
                                                                            ]}
                                                                        >
                                                                            <Radio.Group options={constants.EXAM_ANSWER_VIEW_LIST} disabled={state.trang_thai === 'active'} optionType="button" buttonStyle="solid" />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                {/* Section Đáp án */}
                                                                <Col xl={24}>
                                                                    <Form.Item className="label">
                                                                        <span style={{ color: '#000', fontWeight: 600 }}>Tùy chọn đáp án</span>
                                                                    </Form.Item>
                                                                </Col>
                                                                <Form.List name="dap_an">
                                                                    {(fields, { add, remove }) => (
                                                                        <div className="group-answers">
                                                                            {fields.map(({ key, name, ...restField }) => ( // loop dap an 
                                                                                <Row key={key} style={{display: !state.showTuLuan ? '' : 'none'}}>
                                                                                    <Col xl={4}>
                                                                                        <Form.Item {...restField} rules={[]} className="label">
                                                                                            <span style={{ color: '#ff4d4f' }}>*</span> {currentQuestion?.dap_an[key]?.label}
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                    <Col xl={20}>
                                                                                        <Form.Item {...restField} name={[name, 'tieu_de']} rules={[{ required: !state.showTuLuan, message: 'Bạn chưa nhập nội dung đáp án' }]}>
                                                                                            <TextEditorWidget
                                                                                                valueParent={currentQuestion?.dap_an[key]?.tieu_de}
                                                                                                placeholder="Thêm nội dung đáp án"
                                                                                                onChange={(val) => {
                                                                                                    let dap_an = [...currentQuestion.dap_an];
                                                                                                    dap_an[key] = {
                                                                                                    ...dap_an[key],
                                                                                                    tieu_de: val,
                                                                                                    };
                                                                                                    setCurrentQuestion({ ...currentQuestion, dap_an });
                                                                                                }}
                                                                                                isSimple={true}
                                                                                            />
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                </Row>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </Form.List>

                                                                {/* câu hỏi Tự luận */}
                                                                <Form.List name="dap_an_tu_luan">
                                                                    {(fields, { add, remove }) => (
                                                                        <div className="group-answers">
                                                                            {fields.map(({ key, name, ...restField }) => ( // loop dap an 
                                                                                <Row key={key} style={{display: state.showTuLuan ? '' : 'none' }}>
                                                                                    <Col xl={4}>
                                                                                        <Form.Item {...restField} rules={[]} className="label">
                                                                                            <span style={{ color: '#ff4d4f' }}>*</span> {currentQuestion?.dap_an_tu_luan[key]?.label}
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                    <Col xl={20}>
                                                                                        <Form.Item {...restField} name={[name, 'tieu_de']} rules={[{ required: !state.showTextTuLuan && state.showTuLuan, message: 'Bạn chưa nhập nội dung đáp án' }]} 
                                                                                            style={{display: !state.showTextTuLuan ? '' : 'none'}}
                                                                                        >
                                                                                            <TextEditorWidget 
                                                                                                valueParent={currentQuestion?.dap_an_tu_luan[key]?.tieu_de}
                                                                                                placeholder="Thêm nội dung đáp án"
                                                                                                onChange={(val) => {
                                                                                                    let dap_an_tu_luan = [...currentQuestion.dap_an_tu_luan];
                                                                                                    dap_an_tu_luan[key] = {
                                                                                                        ...dap_an_tu_luan[key],
                                                                                                        tieu_de: val,
                                                                                                    };
                                                                                                    setCurrentQuestion({ ...currentQuestion, dap_an_tu_luan });
                                                                                                }}
                                                                                                isSimple={true}
                                                                                            />
                                                                                        </Form.Item>     
                                                                                        <Form.Item {...restField} name={[name, 'tieu_de']} rules={[{ required: state.showTextTuLuan && state.showTuLuan, message: 'Bạn chưa nhập nội dung đáp án' }]}
                                                                                            style={{display: state.showTextTuLuan ? '' : 'none'}}
                                                                                        >
                                                                                            <TextArea placeholder='Nhập nội dung đáp án' 
                                                                                                value={currentQuestion?.dap_an_tu_luan[key]?.tieu_de}
                                                                                                onChange={(val) => {
                                                                                                    let dap_an_tu_luan = [...currentQuestion.dap_an_tu_luan];
                                                                                                    dap_an_tu_luan[key] = {
                                                                                                        ...dap_an_tu_luan[key],
                                                                                                        tieu_de: val.target.value,
                                                                                                    };
                                                                                                    setCurrentQuestion({ ...currentQuestion, dap_an_tu_luan });
                                                                                                }}
                                                                                            />
                                                                                        </Form.Item>
                                                                                    </Col>

                                                                                </Row>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </Form.List> 
                                                                
                                                                {/* Lời giải */}
                                                                <Row>
                                                                    <Col xl={4}>
                                                                        <Form.Item className="label">Lời giải</Form.Item>
                                                                    </Col>
                                                                    <Col xl={20}>
                                                                        <Form.Item className="input-col" label="" name="loi_giai" rules={[]}
                                                                            style={{display: !state.showTextTuLuan2 ? '' : 'none'}}
                                                                        >
                                                                            <TextEditorWidget
                                                                                disabled={state.trang_thai === 'active'}
                                                                                valueParent={currentQuestion?.loi_giai}
                                                                                placeholder="Thêm nội dung lời giải"
                                                                                onChange={(val) => setCurrentQuestion({ ...currentQuestion, loi_giai: val })}
                                                                                isSimple={true}
                                                                            />  
                                                                        </Form.Item>
                                                                        <Form.Item className="input-col" label="" name="loi_giai" rules={[]}
                                                                            style={{display: state.showTextTuLuan2 ? '' : 'none'}}
                                                                        >
                                                                            <TextEditorWidget 
                                                                                valueParent={currentQuestion?.loi_giai}
                                                                                placeholder="Thêm nội dung lời giải"
                                                                                onChange={(val) => setCurrentQuestion({ ...currentQuestion, loi_giai: val })}
                                                                                isSimple={true}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="footer-question">
                                                        <Button
                                                            type="dash"
                                                            danger
                                                            onClick={() => {
                                                                questionForm.resetFields();
                                                                questionForm.setFieldsValue(defaultQuestion);
                                                                setCurrentQuestion(defaultQuestion);
                                                                setState({ ...state, isEdit: false })
                                                            }}
                                                            size="large"
                                                        >
                                                            {state.isEdit ? 'Hủy bỏ' : 'Làm lại'}
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => {
                                                                setTimeout(() => {
                                                                    questionForm.submit();
                                                                }, 600);
                                                            }}
                                                            size="large"
                                                        >
                                                        {state.isEdit ? 'Cập nhật' : 'Thêm mới'}
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col xl={6} sm={24} xs={24} className="right-content " style={{height: 1000, overflowY: 'scroll'}}>
                                                    <div className="box ">
                                                        <div className="box-body ">
                                                            <div className="border-box question-list mt-0">
                                                            <h6 style={{padding: "10px 0 0 10px"}}>
                                                                Danh sách câu hỏi{' '}
                                                                <span className="counter">
                                                                {exam.data.cau_hoi_de_this.length}/{state.so_cau_hoi}
                                                                </span>
                                                            </h6>
                                                            {renderQuestions()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </TabPane>
                                )
                            })
                        }
                        <TabPane tab="Hoàn thành" key={`step_${criteria?.data?.so_phan + 1}`}>
                            <Row gutter={25}>
                                <Col xl={24} sm={24} xs={24} className="left-content">
                                    <Result
                                        status="success"
                                        title="Tạo đề thi mới thành công."
                                        subTitle="Hãy kiểm tra kỹ trước khi tiến hành xuất bản đề thi, đề thi sau khi xuất bản sẽ không thể được cập nhật thêm."
                                        extra={[
                                            <Button key={1} onClick={() => {
                                                state.so_cau_hoi = 0 // số câu hỏi tại mỗi phần   
                                                setCurrentStep(0);
                                            }}> Kiểm tra lại</Button>,
                                            <Button key={2}
                                            type="primary"
                                            onClick={() =>
                                                Modal.confirm({
                                                title: 'Xuất bản đề thi',
                                                content: 'Bạn có chắc chắn muốn xuất bản đề thi này không?',
                                                okText: 'Có',
                                                cancelText: 'Không',
                                                onOk: () => {
                                                    handlePublishExam();
                                                }})}
                                            >
                                                Xuất bản
                                            </Button>,
                                            <Button key={3} type="primary" onClick={() => window.open(`/luyen-tap/xem-lai/${hashids.encode(id)}`, "_blank")}>Xem toàn đề</Button>,
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                    </>
                    }  
                    </Tabs>
                    <footer className="footer-exam">
                        <div className="footer-action">
                            {currentStep === 0 && (
                            <>
                                <Button type="primary" onClick={() => save()} size="large">
                                    Cập nhật <SaveOutlined />
                                </Button>
                                <Button type="primary" onClick={() => next()} size="large">
                                    Danh sách câu hỏi <RightOutlined />
                                </Button>
                            </>
                            )}
                            {(currentStep >= 1 && currentStep <= criteria?.data?.so_phan )&& (
                            <>
                                <Button type="primary" onClick={() => window.open(`/luyen-tap/xem-lai/${hashids.encode(id)}`, "_blank")} size="large">
                                    Xem toàn đề
                                </Button>
                                <Button type="dash" onClick={() => {
                                    state.so_cau_hoi = state.so_cau_hoi - criteria.data[`so_cau_hoi_phan_${currentStep + 1}`] // số câu hỏi tại mỗi phần   
                                    setCurrentStep(currentStep - 1)
                                }} size="large">
                                    <LeftOutlined /> Quay lại
                                </Button>
                                <Button type="primary" onClick={() => next()} size="large">
                                    Tiếp theo <RightOutlined />
                                </Button>
                            </>
                            )}
                        </div>
                    </footer>
                </Col>
            </Row>
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}

            <Modal title="Chọn trích đoạn sử dụng" visible={isModalVisible} className='modal-exceprt'
                onOk={handleOk} width={1200} onCancel={handleCancel}
                okText={'Đồng ý'} cancelText={'Hủy'}
            >
                {exceprts.status === 'success' && 
                    exceprts.data.map((exceprt, index) => (
                        <div className="question-items" key={index}>
                            <div className='item' onClick={() => chooseExceprt(exceprt.trich_doan_id)}>
                                <div className="header-question">
                                    Trích đoạn {index + 1}
                                </div>
                                <div className="body-question">
                                    <div className="answer-detail">
                                        <MathJax.Provider>
                                            <div style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: exceprt.noi_dung }}></div>
                                        </MathJax.Provider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Modal>
        </div>
    )
}

export default OnlineExamDetailPage;                    
