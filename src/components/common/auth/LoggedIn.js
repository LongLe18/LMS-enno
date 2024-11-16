import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

export default function LoggedIn(props) {
  const userInfo = localStorage.getItem('userInfo');

  const menu = (
    <Menu
      items={[
        {
          label: 'Đăng xuất',
          key: '1',
          icon: <UserOutlined />,
          onClick: () => props.onLogout(),
        },
      ]}
    />
  );
  if (userInfo) {
    const user = JSON.parse(userInfo);
    return (
      <Dropdown.Button overlay={menu} icon={<UserOutlined />} type="primary" placement="bottomRight">
        {user.ho_ten}
      </Dropdown.Button>
    );
  }
  return null;
}
