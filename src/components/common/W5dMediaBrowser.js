import React from 'react';
import { Form, Button, Tooltip } from 'antd';
import defaultImage from 'assets/img/default.jpg';

const W5dMediaBrowser = (props) =>  {
  // const [images, setImages] = useState({});
  // const [state, setState] = useState({
  //   configData: {},
  // });
//   const getImage = async (path, server, bucket) => {
//     const res = await getFileMinio(`${config.UPLOAD_API_URL}/api/media-minio?server=${server}&bucket=${bucket}&tep_tin_url=${path}`);
//     return res.data;
//   };


  return (
    <div className="border-box image-box">
      <label style={{fontSize: "16px"}}>{props.title || 'Ảnh đại diện'}</label>
      <Form.Item className="button-col">
        {props.image ? (
          <div className="upload-img">
            <img
              onClick={() => props.openMediaLibrary(props.field)}
              src={defaultImage}
              alt={props.title}
              style={{
                width: '100%',
                cursor: 'pointer',
              }}
            />
          </div>
        ) : (
          <Button block type="link" onClick={() => props.openMediaLibrary(props.field)}>
            {props.setImageLabel || 'Chọn ảnh đại diện'}
          </Button>
        )}

        {props.image && props.image !== '' ? (
          <Tooltip>
            <Button onClick={() => props.removeImage(props.field)} className="btn-remove-image" type="link">
              {props.removeImageLabel || 'Xóa ảnh đại diện'}
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </Form.Item>
    </div>
  );
}


export default W5dMediaBrowser;
