import React, { useEffect, useState } from "react";
import config from '../../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';

// reactstrap components
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { notification } from "antd";
import classnames from 'classnames';
import LoadingCustom from "components/parts/loading/Loading";

// redux
import { useSelector, useDispatch } from "react-redux";
import * as userAction from '../../../../../redux/actions/user';


const RankComponent = () => {
    const dispatch = useDispatch();
    let dataRankUser2 = [];
    let dataRankUser3 = [];
    let dataRankUser = [];

    const rankUser = useSelector(state => state.user.rankUser.result);
    const loadingrankUser = useSelector(state => state.user.rankUser.loading);
    const errorrankUser = useSelector(state => state.user.rankUser.error);

    const rankUser2 = useSelector(state => state.user.rankUser2.result);
    const loadingrankUser2 = useSelector(state => state.user.rankUser2.loading);
    const errorrankUser2 = useSelector(state => state.user.rankUser2.error);

    const userToken = localStorage.getItem('userToken');

    if (rankUser2.status === 'success') {
        dataRankUser = [];
        dataRankUser2 = [];
        dataRankUser3 = [];
        rankUser2.data.studentsWeek.map((student) => dataRankUser2.push({...student, 'type': 'TK tự luyện'}))
        rankUser2.data.studentsFull.map((student) => dataRankUser3.push({...student, 'type': 'TK tự luyện'}))
    };

    if (rankUser.status === 'success') {
        dataRankUser = [];
        dataRankUser2 = [];
        dataRankUser3 = [];
        rankUser.data.map((student) => dataRankUser.push({...student, 'type': 'TK tự luyện'}))
    };

    useEffect(() => {
        if (userToken) {
            dispatch(userAction.getRankUser2({ diem: '' }));
        } else {
            dispatch(userAction.getRankUser({ diem: '1' }));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [state, setState] = useState({
        activeTab: '1',
        shadow: false,
    });

    const toggleClass = (tab) => {
        const currentState = state.shadow;
        setState({ ...state, shadow: !currentState, activeTab: tab });
        if (userToken) {
            if (tab === '1') {
                dispatch(userAction.getRankUser2({ diem: '' }));
            } else if (tab === '2') {
                dispatch(userAction.getRankUser2({ diem: 'diem_tuan' }));
            }
        } else {
            if (tab === '1') {
                dispatch(userAction.getRankUser({ diem: 'diem_tuan' }));
            } else if (tab === '2') {
                dispatch(userAction.getRankUser({ diem: '' }));
            }
        }
    };

    return (
        <>
            {(loadingrankUser || loadingrankUser2) && <LoadingCustom/>}
            {(errorrankUser || errorrankUser2) && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}
            <div className="shadow-box">
                <Row className="pb-4">
                    <Col md="3" className="ml-4">
                    <img alt="..."
                            className="img-no-padding img-responsive"
                            src={require("assets/rank/flag.png").default}
                    />
                    </Col>
                    <Col md="8" style={{display: 'flex', alignItems: 'center'}}><h4 className="bold">Bảng xếp hạng</h4></Col>
                </Row>   
                {/* Tab choose */}
                <Nav tabs className="ml-2 pb-3">
                    <NavItem className={state.shadow === false ? 'shadow-box': null} 
                            onClick={() => { toggleClass('1') }} >
                        <NavLink style={{cursor: "pointer"}}
                            className={classnames({ active: state.activeTab === '1' })}
                        >
                            Xếp hạng tuần
                        </NavLink>
                    </NavItem>
                    <NavItem className={ state.shadow === true ? 'shadow-box': null} 
                            onClick={() => { toggleClass('2') }}>
                        <NavLink style={{cursor: "pointer"}}
                            className={classnames({ active: state.activeTab === '2' })}
                        >
                            Tổng xếp hạng
                        </NavLink>
                    </NavItem>
                </Nav>
                {dataRankUser.length > 0 &&
                    <TabContent activeTab={state.activeTab}>
                        <TabPane tabId="1" className="tab-rank">
                            {dataRankUser.map(({ ho_ten, diem, anh_dai_dien, type }, index) => (
                                <Row className="ml-2" key={index}>
                                    <Col md="1" className="rank ">
                                        {index + 1 === 1 && <div className="rank-1">{index + 1}</div>}
                                        {index + 1 === 2 && <div className="rank-2">{index + 1}</div>}
                                        {index + 1 === 3 && <div className="rank-3">{index + 1}</div>}
                                        {index + 1 > 3 && <div className="rank-4">{index + 1}</div>}
                                    </Col>
                                    <Col md="7" className="rank ">
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage}
                                        />
                                        <span className="bold name-rank ">{ho_ten}</span>
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={
                                                    (index + 1 === 1) ? require("assets/rank/3.png").default :
                                                    (index + 1 === 2) ? require("assets/rank/2.png").default :
                                                    (index + 1 >= 3) && require("assets/rank/1.png").default
                                                    // (diem === null ) ? require("assets/rank/8.png").default 
                                                    // (diem < 100) ? require("assets/rank/1.png").default :
                                                    // (diem > 100 && diem) < 300 ? require("assets/rank/2.png").default :
                                                    // (diem > 300 && diem) < 500 ? require("assets/rank/3.png").default :
                                                    // (diem > 700 && diem) < 800 ? require("assets/rank/4.png").default :
                                                    // (diem > 800 && diem) < 900 ? require("assets/rank/5.png").default :
                                                    // (diem > 900 && diem) < 1000 ? require("assets/rank/6.png").default :
                                                    // (diem > 1000 && diem) < 1200 ? require("assets/rank/7.png").default :
                                                    // (diem > 1200 && diem) < 1400 && require("assets/rank/8.png").default
                                                }
                                        />
                                    </Col>
                                    <Col md="3" className="text-right mb-3 p-0 type-account-parent">
                                        <span className="bold">{diem !== null ? diem : '0'} pts</span>
                                        <br/>
                                        <div className="type-account" ><span>{type}</span></div>
                                    </Col>
                                </Row>
                            ))}                           
                        </TabPane>
                        {/* Tổng xếp hạng */}
                        <TabPane tabId="2">
                            {dataRankUser.map(({ ho_ten, diem, anh_dai_dien, type }, index) => (
                                <Row className="ml-2" key={index}>
                                    <Col md="1" className="rank ">
                                        {index + 1 === 1 && <div className="rank-1">{index + 1}</div>}
                                        {index + 1 === 2 && <div className="rank-2">{index + 1}</div>}
                                        {index + 1 === 3 && <div className="rank-3">{index + 1}</div>}
                                        {index + 1 > 3 && <div className="rank-4">{index + 1}</div>}
                                    </Col>
                                    <Col md="7" className="rank ">
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage}
                                        />
                                        <span className="bold name-rank ">{ho_ten}</span>
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={
                                                    (index + 1 === 1) ? require("assets/rank/3.png").default :
                                                    (index + 1 === 2) ? require("assets/rank/2.png").default :
                                                    (index + 1 >= 3) ? require("assets/rank/1.png").default :
                                                    (index + 1 > 3) && require("assets/rank/1.png").default
                                                }
                                        />
                                    </Col>
                                    <Col md="3" className="text-right p-0 mb-3">
                                        <span className="bold">{diem} pts</span>
                                        <br/>
                                        <div className="type-account" ><span>{type}</span></div>
                                    </Col>
                                </Row>
                            ))}
                        </TabPane>
                    </TabContent>
                }
                {(dataRankUser2.length > 0 && dataRankUser3.length > 0) &&
                    <TabContent activeTab={state.activeTab}>
                        <TabPane tabId="1" className="tab-rank">
                            {dataRankUser2.map(({ ho_ten, diem, anh_dai_dien, type }, index) => (
                                <Row className="ml-2" key={index}>
                                    <Col md="1" className="rank">
                                        {index + 1 === 1 && <div className="rank-1">{index + 1}</div>}
                                        {index + 1 === 2 && <div className="rank-2">{index + 1}</div>}
                                        {index + 1 === 3 && <div className="rank-3">{index + 1}</div>}
                                        {index + 1 > 3 && <div className="rank-4">{index + 1}</div>}
                                    </Col>
                                    <Col md="7" className="rank">
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage}
                                        />
                                        <span className="bold name-rank ">{ho_ten}</span>
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={
                                                    (index + 1 === 1) ? require("assets/rank/3.png").default :
                                                    (index + 1 === 2) ? require("assets/rank/2.png").default :
                                                    (index + 1 >= 3) ? require("assets/rank/1.png").default :
                                                    (index + 1 > 3) && require("assets/rank/1.png").default
                                                }
                                        />
                                    </Col>
                                    <Col md="3" className="text-right p-0 mb-3 type-account-parent">
                                        <span className="bold">{diem} pts</span>
                                        <br/>
                                        <div className="type-account" ><span>{type}</span></div>
                                    </Col>
                                </Row>
                            ))}                           
                        </TabPane>
                        {/* Tổng xếp hạng */}
                        <TabPane tabId="2">
                            {dataRankUser3.map(({ ho_ten, diem, anh_dai_dien, type }, index) => (
                                <Row className="ml-2" key={index}>
                                    <Col md="1" className="rank">
                                        {index + 1 === 1 && <div className="rank-1">{index + 1}</div>}
                                        {index + 1 === 2 && <div className="rank-2">{index + 1}</div>}
                                        {index + 1 === 3 && <div className="rank-3">{index + 1}</div>}
                                        {index + 1 > 3 && <div className="rank-4">{index + 1}</div>}
                                    </Col>
                                    <Col md="7" className="rank">
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage}
                                        />
                                        <span className="bold name-rank">{ho_ten}</span>
                                        <img alt="..."
                                                className="img-circle img-no-padding img-responsive"
                                                src={
                                                    (index + 1 === 1) ? require("assets/rank/3.png").default :
                                                    (index + 1 === 2) ? require("assets/rank/2.png").default :
                                                    (index + 1 >= 3) ? require("assets/rank/1.png").default :
                                                    (index + 1 > 3) && require("assets/rank/1.png").default
                                                }
                                        />
                                    </Col>
                                    <Col md="3" className="text-right p-0 mb-3">
                                        <span className="bold">{diem} pts</span>
                                        <br/>
                                        <div className="type-account" ><span>{type}</span></div>
                                    </Col>
                                </Row>
                            ))}
                            
                        </TabPane>
                    </TabContent>
                }
            </div>
        </>
    )
}

export default RankComponent;