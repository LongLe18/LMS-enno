import React, { useEffect } from 'react';
// css
import './css/AppFooter.css';
// helper
// import boCongThuong from 'assets/img/logo/bo-cong-thuong.png';
// component
import { Row, Col, Button } from 'antd';
import { FacebookOutlined, YoutubeOutlined, PhoneOutlined } from '@ant-design/icons';

// redux
import * as footerAction from '../../../redux/actions/footer';
import * as contactAction from '../../../redux/actions/contact';
import { useSelector, useDispatch } from "react-redux";

const Footer = () => {
    const dispatch = useDispatch();

    const footers = useSelector(state => state.footer.list.result);
    const contacts = useSelector(state => state.contact.list.result);

    useEffect(() => {
        dispatch(footerAction.getFOOTERs());
        dispatch(contactAction.getCONTACTs());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (        
        <div className='app-footer'>
            
            <div className="main-footer wraper">
                <div className="footer-container">
                    <Row gutter={[10, 10]}>
                        {footers.status === 'success' && footers.data.map((item, index) => {
                            if (index < 3) {
                                if (index === 1) {
                                    return (
                                        <Col xl={8} sm={12} xs={24} className="block-footer" key={index}>
                                            <div className="footer-info">
                                                <div className="footer-title">
                                                    <h3>{item.ten_footer}</h3>
                                                </div>
                                                <div className="footer-title" dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div>
                                                {/* <div className="policy-icon">
                                                    <img src={boCongThuong} alt="chung-chi"/>
                                                </div> */}
                                            </div>
                                        </Col>  
                                    )
                                } else if (index === 2) {
                                    return (
                                        <Col xl={8} sm={12} xs={24} className="block-footer" key={index}>
                                            <div className="footer-info">
                                                <div className="footer-title">
                                                    <h3>{item.ten_footer}</h3>
                                                </div>
                                                <iframe src={item.noi_dung.split('>')[1].split('<')[0]} 
                                                    width="340" height="70" style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder="0" allowFullScreen={true} 
                                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title='my-frame'>
                                                </iframe>
                                                <div className='social-icons follow-icons'>
                                                {contacts.status === 'success' && contacts.data.map((item, index) => {
                                                    if (index <= 3) {
                                                        if (item.mo_ta === 'FACEBOOK')
                                                            return (
                                                                <Button key={item.link_lien_ket} block shape="round" icon={<FacebookOutlined />} onClick={() => window.location.href = item.link_lien_ket} 
                                                                    className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                                                </Button>
                                                            )
                                                        else if (item.mo_ta === 'YOUTUBE')
                                                            return (
                                                                <Button key={item.link_lien_ket} block shape="round" icon={<YoutubeOutlined />} onClick={() => window.location.href = item.link_lien_ket}
                                                                    className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                                                </Button>
                                                            )
                                                        else if (item.mo_ta === 'HOTLINE')
                                                            return (
                                                                <Button key={item.link_lien_ket} block shape="round" icon={<PhoneOutlined />} onClick={() => window.location.href = 'tel:' + item.link_lien_ket}
                                                                    className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                                                </Button>
                                                            )
                                                    }
                                                    return null;
                                                })}      
                                                </div>
                                            </div>
                                        </Col>  
                                    )
                                } 
                                else {
                                    return (
                                        <Col xl={8} sm={12} xs={24} className="block-footer" key={index}>
                                            <div className="footer-info">
                                                <div className="footer-title">
                                                    <h3>{item.ten_footer}</h3>
                                                </div>
                                                <div className="footer-title" dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div>
                                                
                                            </div>
                                        </Col>    
                                    )
                                }
                            }
                            return null;
                        })                 
                        }
                    </Row>
                </div>
            </div>
            {/* Copy right */}
            {/* <div className="copy-right">
                <p className="text-center">
                    Copyright 2024 © Trung tâm Đào tạo và Chuyển giao Khoa học công nghệ (ENNO). All rights reserved.
                </p>
            </div> */}
        </div>
    )
};

export default Footer;