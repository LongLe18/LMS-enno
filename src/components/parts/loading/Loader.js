import './Loading.css';
import { Spin } from 'antd';

function Loader() {
  return (
    <div className="loading-global">
      <div className="loading">
        <Spin size="large" />
      </div>
    </div>
  );
}

export default Loader;
