import React, { useState, useEffect } from "react";
import Hashids from "hashids";
import { Link } from "react-router-dom";
import './css/content.css';

// helper
import config from '../../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import { diff } from "helpers/common.helper";
import { createRoot } from 'react-dom/client';

// component
import { Button, Row, Col } from "reactstrap";
import { Player, PlaybackRateMenuButton, ControlBar } from "video-react";
import { notification, Form, Upload, message, Avatar, Space, Dropdown, Menu } from 'antd';
import TextEditorWidget2 from "components/common/TextEditor/TextEditor2";
import { UploadOutlined, ArrowRightOutlined, DashOutlined } from "@ant-design/icons";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as commentAction from '../../../../../redux/actions/comment';
import * as notificationAction from '../../../../../redux/actions/notification';
import * as criteriaActions from '../../../../../redux/actions/criteria';

// pdf
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

const { Dragger } = Upload;

const ContentDetailPage = (props) => {
    const renderToolbar = (Toolbar) => (
        <Toolbar>
        {(slots) => {
            const {
                CurrentPageInput,
                EnterFullScreen,
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                Zoom,
                ZoomIn,
                ZoomOut,
            } = slots;
            return (
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                    }}
                >
                    <div style={{ padding: '0px 2px' }}>
                        <ZoomOut />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <Zoom />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <ZoomIn />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToPreviousPage />
                    </div>
                    <div style={{ padding: '0px 2px', marginLeft: 'auto', display: 'flex' }}>
                        <CurrentPageInput /> / <NumberOfPages />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToNextPage />
                    </div>
                    <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                        <EnterFullScreen />
                    </div>
                </div>
            );
        }}
    </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin(
        {
            sidebarTabs: (defaultTabs) => ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? [] : [],
            renderToolbar
        }
    );

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const hashids = new Hashids();

    const video = props.props.data.video;
    const pdf = props.props.data.pdf;
    const comments = useSelector(state => state.comment.list.result);
    const module = useSelector(state => state.part.item.result);

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
            setState({ ...state, fileImg: info.fileList });
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

    const [videosrc, setVideo] = useState("");
    const [existCriteria, setExistCriteria] = useState(true);
    const [state, setState] = useState({
        showVideo: true,
        showPDF: false,
        fileImg: '',
        comment: '',
        soluongShowComment: 2,
        idComment: 0,
        isReplied: false,
    });

    useEffect(() => {
        document.addEventListener('contextmenu', event => event.preventDefault());
        dispatch(commentAction.getCOMMENTs({ idCourse: props.idCourse, idModule: props.idModule, type: 0 }));
        // kiểm tra chuyên đề có đề thi (tiêu chí đề hay chưa)
        dispatch(criteriaActions.getCriteriaThematic({ id: props.idThematic }, (res) => {
            if (res.response && res.response.data.status === 'warning') {
                setExistCriteria(false);
            }
        }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (video.length > 0) {
            setVideo(config.API_URL + video[0].link_bai_giang);
        }
    }, [video])

    if (comments.status === 'success') {
        let temp = comments.data.filter((comment) => comment.lien_ket_id === props.idThematic.toString())
        state.comment = temp.map((comment, index) => ({...comment, key: index}));
        let body = document.getElementsByClassName('body-detail-button')[1];
        if (body)
            body.scrollIntoView();
    };

    const showVideo = () => {
        if (state.showPDF === true) {
          setState({
            showPDF: false,
            showVideo: true
          });
        }
        if (video.length === 0) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Bài này chưa có video giảng dạy',
            })
        }
    }

    const showPDF = () => {
        if (state.showVideo === true) {
            setState({
                showPDF: true,
                showVideo: false,
            });
        }
    }
    
    const OnRenderVideo = (link) => {
        setVideo(config.API_URL +  link);
        if (link === null) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Bài này chưa có video',
            })
        }
    }

    const submitComment = (values) => {
        const callback = (res) => {
            if (res.data.status === 'success' && res.statusText === 'OK') {
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm bình luận thành công',
                });
                form.resetFields();
                setState({ ...state, idComment: 0, isReplied: false }); // reset lại khi phản hồi
                
                if (state.isReplied === false)
                    dispatch(commentAction.getCOMMENTs({ idCourse: props.idCourse, idModule: props.idModule, type: 0 }));
                else renderMoreSubComment(state.idComment)

                /// Tạo thông báo cho nhân viên
                const note = {
                    "loai_thong_bao": !state.isReplied ? 0 : 1,
                    "lien_ket_id": !state.isReplied ? res.data.data.binh_luan_id : res.data.data.binh_luan_phu_id,
                    //// bổ sung link_lien_ket
                    "link_lien_ket": res.data.data.binh_luan_id
                };
                dispatch(notificationAction.CreateNOTIFICATION({ formData: note, idModule: props.idModule[0], type: 0, 
                    idThematic: props.idThematic, idExam: '', index: '', idCourse: props.idCourse,
                    Teacher: module.data.giao_vien_id !== null ? module.data.giao_vien_id : '' }))
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm bình luận thất bại',
                })
            }
        };
        
        if (state.isReplied === false) {
            const formData = new FormData();
            formData.append('noi_dung', values.nhan_xet)
            formData.append('khoa_hoc_id', props.idCourse[0])
            formData.append('mo_dun_id', props.idModule[0]);
            formData.append('loai_hoi_dap', 0)
            formData.append('lien_ket_id', props.idThematic);
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            dispatch(commentAction.CreateCOMMENT(formData, callback));
        } else {
            const formData = new FormData();
            formData.append('noi_dung', values.nhan_xet)
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            formData.append('binh_luan_id', state.idComment);
            dispatch(commentAction.CreateSUBCCOMMENT(formData, callback));
        }
    };

    const renderMoreComment = () => {
        setState({ ...state, soluongShowComment: state.soluongShowComment + 2 });
    };

    const renderMoreSubComment = (binh_luan_id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                const element = res.data.map((item, index) => 
                    (
                        <li className='ml-10' key={index}>
                            <Row className="comment">
                                <Col xs="4" sm="1" className="avatar-user">
                                    <Row style={{height: '100%', flexDirection: 'column'}}>
                                        <Avatar size={"large"}  src={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage}/>
                                    </Row>
                                </Col>
                                <Col xs="20" sm="8" className="content-user">
                                    <span className="name-user">{item.ho_ten}</span>
                                    <div className="content-comment">
                                        <div dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div><br/>
                                        {item.anh_dinh_kem !== null && <img src={config.API_URL + item.anh_dinh_kem} alt="ảnh bình luận"/>}
                                    </div>
                                </Col>
                                {(item.nguoi_tra_loi_id === JSON.parse(localStorage.getItem('userInfo')).hoc_vien_id && item.loai_quyen === 0) &&
                                    <Col>
                                        <Dropdown overlay={
                                            <Menu
                                                items={[
                                                    // {
                                                    //     label: <Button color="link" size='large' style={{width: '100%'}}>Chỉnh sửa</Button>,
                                                    //     key: '0',
                                                    // },
                                                    {
                                                        label: <Button color="link" size='large' style={{width: '100%'}} onClick={() => deleteComment(item.binh_luan_id, item.binh_luan_phu_id, true)}>Xóa</Button>,
                                                        key: '1',
                                                    },
                                                ]}
                                            />
                                        } 
                                        trigger={['click']}>
                                            <a href="#/" onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    <DashOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </Col>
                                }
                            </Row>
                            <ul>
                                <Row>
                                    <Col xs="4" sm="1" ></Col>
                                    <Col xs="20" sm="8">
                                        <Row>
                                            <li><Button style={{margin: 0, fontSize: '12px', maxWidth: '250px', width: '250px'}} color="link">{diff(item.ngay_tao)}</Button></li>
                                        </Row>
                                    </Col>
                                </Row>
                            </ul>
                        </li>          
                    )
                )
                createRoot(document.getElementById(binh_luan_id)).render(element)
            }
        };
        dispatch(commentAction.getSUBCCOMMENTs({ idComment: binh_luan_id }, callback));
    };

    // Phản hồi bình luận
    const replyComment = (binh_luan_id) => {
        document.getElementById("review").scrollIntoView();
        setState({ ...state, idComment: binh_luan_id, isReplied: true });
    };

    const cancelReply = () => {
        setState({ ...state, idComment: 0, isReplied: false });
    }; 

    // Sửa bình luận

    // Xóa bình luận
    const deleteComment = (binh_luan_id, binh_luan_phu_id, bool) => {
        // bool: true => xóa bình luận phụ
        // bool: false => xóa bình luận chính
        const callback = (res) => {
            console.log(res)
            if (res.statusText === 'OK' && res.status === 200) {
                if (bool) renderMoreSubComment(binh_luan_id);
                else dispatch(commentAction.getCOMMENTs({ idCourse: props.idCourse, idModule: props.idModule, type: 0 })); 

                notification.success({
                    message: 'Thành công',
                    description: 'Xóa bình luận thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Xóa bình luận mới thất bại',
                })
            };
        }

        const result = window.confirm('Bạn có chắc chắn muốn xóa bình luận này?');
        if (bool && result) {
            dispatch(commentAction.DeleteSUBCCOMMENT({ idComment: binh_luan_phu_id }, callback));
        } else if (bool === false && result) {
            dispatch(commentAction.DeleteCOMMENT({ idComment: binh_luan_id }, callback));
        }
    };

    return (
        <>
            <div className="body-detail">   
                <div className="title text-center mb-0">
                    <h3 className="red-text bold" style={{margin: '5px'}}>NỘI DUNG HỌC TẬP</h3>
                </div>
                <Row className="body-detail-button" style={{marginBottom:"30px"}}>                      
                    <Col md="2">
                        <Button color="success" type="button" onClick={() => showVideo()}>VIDEO BÀI GIẢNG</Button>
                    </Col>
                    <Col md="2">
                        <Button color="success" type="button" onClick={() => showPDF()}>BÀI GIẢNG (PDF)</Button>
                    </Col>
                    {existCriteria &&
                        <Col md="2">
                            <Link to={"/luyen-tap/chuyen-de/xem/" + hashids.encode(props.idThematic) + '/' + hashids.encode(props.idCourse)}>
                                <Button color="success" type="button">BÀI KIỂM TRA</Button>
                            </Link>
                        </Col>
                    }
                    <Col md="2">
                        <Button color="success" type="button" onClick={() => document.getElementById("review").scrollIntoView()}>HỎI ĐÁP</Button>
                    </Col>
                </Row>
                <Row className="body-detail-button mb-4">
                    {(state.showPDF && pdf !== null) && 
                        <div style={{width: "90%", height: '1000px'}}>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                <Viewer fileUrl={config.API_URL + pdf.link_bai_giang} plugins={[defaultLayoutPluginInstance]} defaultScale={1.25} />
                            </Worker> 
                        </div>
                    }
                    <div className="video-content">  
                        <Col md="8">
                            {state.showVideo && 
                                <Player
                                    playsInline
                                    src={videosrc}
                                >
                                    <ControlBar>
                                        <PlaybackRateMenuButton rates={[2, 1.5, 1.25, 1, 0.75, 0.5]} />
                                    </ControlBar>
                                </Player>
                            }  
                        </Col>
                        <Col md="4">
                            {(state.showVideo && video.length > 0 ) && 
                                <div className="widget cate__mobile" style={{height:"100%", justifyContent:"flex-start"}}>
                                    <span className="widget-title" style={{backgroundColor: "#ff4e00", backgroundImage: "linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%)"}}>
                                        <span>DANH MỤC BÀI GIẢNG</span>
                                    </span> 
                                    <ul className="product-categories">
                                        {video.map((item, index) => {
                                            return (
                                                <li className="cat-item cat-item-187" key={index}>
                                                    <button className="text-left" style={{marginLeft:"10px"}} onClick={() => OnRenderVideo(item.link_bai_giang)}>{item.ten_bai_giang}</button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>}
                        </Col>
                    </div>                       
                </Row>      
                {/* Bình luận */}
                {comments.status === 'success' &&
                <Row className="body-detail-button mb-4">
                    <div className='product-footer' style={{width: '90%'}}>
                        <div className='woocommerce-tabs wc-tabs-wrapper container tabbed-content'>
                            <ul className='tabs wc-tabs product-tabs small-nav-collapse nav nav-uppercase nav-line'>
                                <li className="reviews_tab active" id="tab-title-reviews" role="tab" aria-controls="tab-reviews">
                                    <a href="#tab-reviews">Bình luận ({state.comment !== '' ? state.comment.length : '0'})</a>
                                </li>
                            </ul>
                            <div className='woocommerce-Tabs-panel woocommerce-Tabs-panel--reviews panel entry-content active'>
                                <div className='tab-panels'>
                                    {/* Show comment */}
                                    {state.comment !== '' &&
                                        state.comment.map((comment, index) => {
                                            if (index < state.soluongShowComment) {
                                                return (
                                                    <ul>
                                                        {/* Main comment */}
                                                        <li>
                                                            <Row className="comment">
                                                                <Col xs="4" sm="1" className="avatar-user">
                                                                    <Row style={{height: '100%', flexDirection: 'column'}}>
                                                                        <Avatar size={"large"} src={comment.anh_dai_dien !== null ? config.API_URL + comment.anh_dai_dien : defaultImage} />
                                                                    </Row>
                                                                </Col>
                                                                <Col xs="20" sm="8" className="content-user">
                                                                    <span className="name-user">{comment.ten_hoc_vien}</span>
                                                                    <div className="content-comment">
                                                                        <div dangerouslySetInnerHTML={{ __html: comment.noi_dung }}></div><br/>
                                                                        {comment.anh_dinh_kem !== null && <img src={config.API_URL + comment.anh_dinh_kem} alt="ảnh bình luận"/>}
                                                                    </div>
                                                                </Col>
                                                                {comment.hoc_vien_id === JSON.parse(localStorage.getItem('userInfo')).hoc_vien_id &&
                                                                    <Col>
                                                                        <Dropdown overlay={
                                                                            <Menu
                                                                                items={[
                                                                                    {
                                                                                        label: <Button color="link" size='large' style={{width: '100%'}} onClick={() => deleteComment(comment.binh_luan_id, 1, false)}>Xóa</Button>,
                                                                                        key: '1',
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        } 
                                                                        trigger={['click']}>
                                                                            <a href="#/" onClick={(e) => e.preventDefault()}>
                                                                                <Space>
                                                                                    <DashOutlined />
                                                                                </Space>
                                                                            </a>
                                                                        </Dropdown>
                                                                    </Col>
                                                                }
                                                            </Row>
                                                            <ul>
                                                                <Row>
                                                                    <Col xs="4" sm="1" ></Col>
                                                                    <Col xs="20" sm="8">
                                                                        <Row>
                                                                            <li><Button style={{margin: 0, fontSize: '12px'}} color="link" onClick={() => replyComment(comment.binh_luan_id)}>Phản hồi</Button></li>
                                                                            <li><Button style={{margin: 0, fontSize: '12px', maxWidth: '250px', width: '250px'}} color="link">{diff(comment.ngay_tao)}</Button></li>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </ul>
                                                        </li>
                                                        {/* Sub Comment */}
                                                        <div id={comment.binh_luan_id}>

                                                        {comment.so_binh_luan_phu > 0 &&                                                  
                                                            <Row>
                                                                <Col xs="4" sm="1" ></Col>
                                                                <Col xs="20" sm="8">
                                                                    <ArrowRightOutlined />
                                                                    {/* Button render more sub comment */}
                                                                    <Button onClick={() => renderMoreSubComment(comment.binh_luan_id)} style={{margin: 0}} color="link">{comment.so_binh_luan_phu} phản hồi</Button> 
                                                                </Col>
                                                            </Row>
                                                        }
                                                        </div>
                                                    </ul>
                                                )
                                            } else return null;
                                        }) 
                                    }
                                    {(comments.data.length > 1 && state.soluongShowComment < comments.data.length) && 
                                        <div className="more-content">
                                            <Button style={{maxWidth: '200px', width: '200px'}} color="link" onClick={() => renderMoreComment()}>Xem thêm bình luận</Button>
                                        </div>
                                    }
                                    <br/>
                                    <Row id='review' className='woocommerce-Reviews'>
                                        <Col span={24}>
                                            <div className='col-inner' id='review_form'>
                                                <div className='review-form-inner has-border'>
                                                    <div id='response' className='comment-respond'>
                                                        <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={submitComment}>
                                                            <Form.Item 
                                                                className="input-col"
                                                                label="Nhận xét của bạn *"
                                                                name="nhan_xet"
                                                                rules={[
                                                                    {
                                                                    required: true,
                                                                    message: 'Nhận xét là trường bắt buộc.',
                                                                    },
                                                                ]}
                                                                >
                                                                    <TextEditorWidget2
                                                                        placeholder="Bình luận bài giảng"
                                                                        showToolbar={true}
                                                                        isMinHeight200={true}
                                                                        isSimple={false}
                                                                    />
                                                            </Form.Item>
                                                            <Form.Item className="input-col" label="Hình ảnh" name="hinh_anh" rules={[]}>
                                                                <Dragger {...propsImage} maxCount={1}
                                                                    listType="picture"
                                                                    className="upload-list-inline"
                                                                >
                                                                    <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                                                    <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                                                </Dragger>
                                                            </Form.Item>
                                                            <Form.Item className="button-col">
                                                                {state.isReplied === false ?
                                                                <Button type="primary" size='large'>GỬI ĐI</Button>  
                                                                :   
                                                                    <>
                                                                        <Button type="primary" size='large'>GỬI ĐI</Button>  
                                                                        <Button type="primary" onClick={() => cancelReply()} size='large'>HỦY</Button>  
                                                                    </>
                                                                }
                                                            </Form.Item>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>    
                </Row>   
                }
            </div>
            
        </>
    )
}

export default ContentDetailPage;