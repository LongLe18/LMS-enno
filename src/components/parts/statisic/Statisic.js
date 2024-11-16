import React from 'react';
import { Row, Col } from 'antd';
import 'components/parts/statisic/Statisic.css';

import experience from 'assets/img/kinh-nghiem.png';
import teacher from 'assets/img/teacher.png';
import registered from 'assets/img/registered.png';
import successfully from 'assets/img/successfully.png';

// const { Header, Content, Footer } = Layout;

// import internal libs

// logo

function Statisic() {
  return (
    <div className="statisic">
      <div className="wraper">
        <Row gutter={[20]} align={'middle'}>
          <Col xl={6} sm={12} xs={12} className="statisic-row">
            <div className="statisic-box">
              <div className="icon-box-img">
                <img src={experience} className="box-icon" alt="experience" />
              </div>
              <h3 className="statisic-description">Trung tâm đào tạo và chuyển giao công nghệ</h3>
            </div>
          </Col>
          <Col xl={6} sm={12} xs={12} className="statisic-row">
            <div className="statisic-box">
              <div className="icon-box-img">
                <img src={teacher} className="box-icon" alt="teacher" />
              </div>
              <h3 className="statisic-description">Giảng viên nhiệt tình và chất lượng trình độ cao</h3>
            </div>
          </Col>
          <Col xl={6} sm={12} xs={12} className="statisic-row">
            <div className="statisic-box">
              <div className="icon-box-img">
                <img src={registered} className="box-icon" alt="registered" />
              </div>
              <h3 className="statisic-description">Nền tảng học trực tuyến hàng đầu Việt Nam</h3>
            </div>
          </Col>
          <Col xl={6} sm={12} xs={12} className="statisic-row">
            <div className="statisic-box">
              <div className="icon-box-img">
                <img src={successfully} className="box-icon" alt="successfully" />
              </div>
              <h3 className="statisic-description">Hàng ngàn học sinh giỏi đã được đào tạo</h3>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Statisic;
