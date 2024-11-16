import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import 'components/parts/breadcrumb/AppBreadCrumb.scss';

import config from '../../../configs/index';

function AppBreadCrumb(props) {
  if (props.hidden) return null;

  const renderItems = () => {
    const { list } = props;
    if (list) {
      return list.map((item, index) => {
        return <Breadcrumb.Item key={index}>{item.link ? <Link to={item.link}>{item.title}</Link> : <span>{item.title}</span>}</Breadcrumb.Item>;
      });
    }
  };
  return (
    <div className="cra-breadcrumb">
      <div className="wraper">
        <Breadcrumb>
          <Breadcrumb.Item href={config.BASE_URL + "/luyen-tap/kiem-tra"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          {renderItems()}
        </Breadcrumb>
      </div>
    </div>
  );
}

export default AppBreadCrumb;
