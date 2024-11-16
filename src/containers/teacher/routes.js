import { Redirect } from 'react-router-dom';

import Dashboard from './views/dashboard/Dashboard';
import TeachingPage from './views/teach/teach';
import DealerTeacherPage from './views/dealer/dealer';
import ReplyPage from './views/reply/reply';
import ProfilePage from './views/profile/profile';

import { shouldHaveAccessPermission } from "helpers/common.helper.js";

import {
    HomeOutlined,
    CloudOutlined,
    DiffOutlined,
    SoundOutlined,
} from '@ant-design/icons';

var routes = [
    {
        id: "dashboard",
        path: "/teacher/dashboard",
        name: "Dashboard",
        hide: false,
        icon: <HomeOutlined/>,
        render: (props) => <Dashboard {...props}/>, // OK
    },
    {
        id: "teaching",
        path: "/teacher/teaching",
        name: "Giảng dạy",
        hide: false,
        icon: <CloudOutlined/>,
        render: (props) => (shouldHaveAccessPermission('all', '/teacher/teaching') ? <TeachingPage {...props}/> : <Redirect to="/"/>) // OK
    },
    {
        id: "dealer",
        path: "/teacher/dealer",
        name: "Đại lý",
        hide: false,
        icon: <DiffOutlined/>,
        render: (props) => (shouldHaveAccessPermission('all', '/teacher/dealer') ? <DealerTeacherPage {...props}/> : <Redirect to="/"/>) // OK
    },
    {
        id: "reply",
        path: "/teacher/reply",
        name: "Hỏi đáp",
        hide: false,
        icon: <SoundOutlined/>,
        render: (props) => (shouldHaveAccessPermission('all', '/teacher/reply') ? <ReplyPage {...props}/> : <Redirect to="/"/>) // OK
    },
    {
        id: "profile",
        path: "/teacher/profile",
        hide: true,
        name: "Tài khoản cá nhân",  
        render: (props) => <ProfilePage {...props}/>
    },
];

export default routes;