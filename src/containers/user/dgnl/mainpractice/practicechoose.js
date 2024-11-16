import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
// reactstrap components
import { Container, Row, Col } from "reactstrap";
import Hashids from 'hashids';

import * as courseAction from '../../../../redux/actions/course';
// core components
import RankComponent from './rank/rank';
import InfoComponent from './info/info';
import ContentComponent from './content/content';
import SideBarComponent from "./sidebar/SideBar";
import LoadingCustom from "components/parts/loading/Loading";

// hooks
import useScrollToTop from "hooks/useScrollToTop";

const PracticeMainPage = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const hashids = new Hashids();

  const course = useSelector(state => state.course.item.result);
  const loading = useSelector(state => state.course.item.loading);
  const error = useSelector(state => state.course.item.error);

  useEffect(() => {
    dispatch(courseAction.getCourse({ 'id': hashids.decode(params.id) }))
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useScrollToTop();
    
  return (
    <>
      {loading && <LoadingCustom/>}
      {course.status === "success" && 
        <div className="section section-navbars">
          {/* <Slider /> */}
          <div className="title" style={{textAlign: "center"}}>
              <h3 className="blue-text bold">{course.data.ten_khoa_hoc}</h3>
          </div>
          <Row>
            
            {/* Danh mục và quảng cáo */}
            <Col md="3" style={{padding: "0", maxWidth: "22%"}}>
                <SideBarComponent/>
            </Col>
            {/* Main content */}
            <Col md="9" style={{alignItems: 'baseline'}}>
              <Container style={{padding: '0', margin: '0'}}>
                
                <Row id="row-content">
                  <div className="title" style={{width: "100%", textAlign: "center", margin:"20px 10px"}}>
                    <h4 className="blue-text bold">NHỮNG PHẦN TRONG {course.data.ten_khoa_hoc}</h4>
                  </div>
                  <br />
                  <Col md="8" >
                    <ContentComponent id={course.data.khoa_hoc_id} loai={course.data.loai_kct} {...props}></ContentComponent>
                  </Col>
                  
                  <Col md="4">
                    {/* Tài khoản */}
                    <InfoComponent {...props} ></InfoComponent>
                    
                    {/* Bảng xếp hạng */}
                    <RankComponent></RankComponent>
                  </Col>
                </Row>
              </Container>
            </Col>
            
          </Row>
          
        </div>
      }
      {error && !loading && <p>{error}</p>}
    </>
  );
}

export default PracticeMainPage;