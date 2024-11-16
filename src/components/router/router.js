import { lazy } from "react";
import Loadable from "components/parts/loading/Loadable";

// import UserLayout from "containers/user/dgnl/User";
// import IeltsLayout from "containers/user/ielts/Ielts";
// import Dashboard from "containers/admin/Admin";
// import AuthLayout from "containers/auth/Auth";
// import TeacherPage from "containers/teacher/Teacher";
// import NotFound from "components/common/NotFound";

const UserLayout = Loadable(lazy(() => import("containers/user/dgnl/User")));
const Dashboard = Loadable(lazy(() => import("containers/admin/Admin")));
const AuthLayout = Loadable(lazy(() => import("containers/auth/Auth")));
const TeacherPage = Loadable(lazy(() => import("containers/teacher/Teacher")));
const NotFound = Loadable(lazy(() => import("components/common/NotFound")));


export const ROUTES = [
    {
        id: 'auth',
        path: '/auth',
        exact: false,
        hidden: true,
        component: AuthLayout
    },
    {
        id: 'admin',
        path: '/admin',
        exact: false,
        hidden: true,
        component: Dashboard
    },
    {
        id: 'practice',
        path: '/luyen-tap',
        exact: true,
        hidden: true,
        component: UserLayout
    },
    {
        id: 'teacher',
        path: '/teacher',
        exact: true,
        hidden: true,
        component: TeacherPage
    },
    {
        id: 'any',
        path: '*',
        exact: true,
        hidden: true,
        component: NotFound,
    },
]