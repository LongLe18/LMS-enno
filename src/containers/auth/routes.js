import { lazy } from "react";
import Loadable from "components/parts/loading/Loadable";


const LoginUserPage = Loadable(lazy(() => import("./views/LoginUser")));
const RegisterPage = Loadable(lazy(() => import("./views/Register")));
const ForgotPasswordPage = Loadable(lazy(() => import("./views/ForgotPassword")));
const LoginTeacherPage = Loadable(lazy(() => import("./views/login/LoginTeacher")));
const LoginAdminPage = Loadable(lazy(() => import("./views/login/LoginAdmin")));


var routes = [
    {
        id: "register",
        path: "/auth/register",
        exact: true,
        hidden: true,
        component: RegisterPage,
    },
    {
        id: 'login',
        path: '/auth/hocvien',
        exact: false,
        hidden: true,
        component: LoginUserPage
    },
    {
        id: 'loginTeacher',
        path: '/auth/giaovien',
        exact: true,
        hidden: true,
        component: LoginTeacherPage
    },
    {
        id: 'loginAdmin',
        path: '/auth/nhanvien',
        exact: true,
        hidden: true,
        component: LoginAdminPage
    },
    {
        id: 'forgotpassword',
        path: '/auth/forgot-password',
        exact: false,
        hidden: true,
        component: ForgotPasswordPage
    },
]

export default routes;