import { Button, Row, Col } from 'antd';
import avatar from 'assets/img/avatar.png';

export default function NotLoggedIn(props) {
  return (
    <Row className="cra-not-logged" justify="center" align="middle">
      <Col className="user-avatar">
        <img src={avatar} alt=""/>
      </Col>
      <Col className="cra-auth-buttons">
        <Button
          type="dashed"
          className="singin"
          onClick={() => {
            props.showModal();
            props.setType('login');
          }}
        >
          Đăng nhập
        </Button>
        <Button
          type="dashed"
          danger
          className="singup"
          onClick={() => {
            props.showModal();
            props.setType('register');
          }}
        >
          Đăng ký
        </Button>
      </Col>
    </Row>
  );
}
