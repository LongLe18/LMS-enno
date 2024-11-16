import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

function NoRecord(props) {
  return (
    <Result
      status={props.status ? props.status : '404'}
      title={props.title ? props.title : 'Dữ liệu chỉ được cập nhật khi bạn đăng ký môn học.'}
      subTitle={props.subTitle ? props.subTitle : 'Không tìm thấy dữ liệu.'}
      extra={
        <Button type="primary" style={{borderRadius: 6}}>
          <Link to="/luyen-tap/trang-chu">Về trang chủ</Link>
        </Button>
      }
    />
  );
}

export default NoRecord;
