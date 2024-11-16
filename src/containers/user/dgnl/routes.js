import { Redirect } from 'react-router-dom';

import PracticeMainPage from './mainpractice/practicechoose';
import PracticeDetailPage from './detailpractice/detailpractice';
import { shouldHaveAccessPermission } from 'helpers/common.helper';
import ExamPage from './exam/exam';
import ExamModulePage from './exam/examModule';
import ExamViewPage from './exam/examview';
import ProfilePage from './mainpractice/profile/Profile';
import ExamThematicViewPage from './exam/examThematicdetail';
import ExamModuleViewPage from './exam/examModuledetail';
import ExamDetail from './exam/doExam';
import ExamCourseDetail from './exam/doExamCourse';
import ExamOnlineDetail from './exam/doExamOnline';
import ExamModuleDetail from './exam/doExamModule';
import ReviewExamPage from './exam/reviewExam';
import HistoryExam from './exam/historyExam';
import ExamViewDGNL from './exam/examViewDGNL';
// business
import BusinessPage from './business/business';
import BusinessProgramePage from './business/businessPrograme';
import BusinessTypeProgramePage from './business/businessTypePrograme';
import IntroCoursePage from './business/detailCourse';
import CoursesPage from './business/businessCourses';
import CartPage from './business/cart';
import PaymentPage from './business/payment';
import CoursesUser from './business/coursesUser';
import ReceiptUserPage from './business/receiptUser';
import CheckOutPage from './business/checkout';
import CheckOutPage2 from './business/checkout2';
import BusinessTypeProgramePageUser from './business/businessTypeProgrameUser';
// import MainPageUser from './business/mainPage';

const routes = [
    // {
    //     id: "trang-chu",
    //     path: "/luyen-tap/trang-chu",
    //     exact: true,
    //     hidden: true,
    //     render: (props) => <MainPageUser {...props}/>,
    // },
    {
        id: "luyen-tap",
        path: "/luyen-tap/luyen-tap/:id",
        exact: true,
        hidden: true,
        render: (props) => <PracticeMainPage {...props}/>,
    },
    {
        id: 'chi-tiet-luyen-tap',
        path: '/luyen-tap/chi-tiet-luyen-tap/:id/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/chi-tiet-luyen-tap/:id/:idCourse') ? <PracticeDetailPage {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'practicedetail',
        path: '/luyen-tap/kiem-tra/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => <ExamPage {...props}/>,
    },
    {
        id: 'danh-gia-nang-luc',
        path: '/luyen-tap/danh-gia-nang-luc/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => <ExamViewDGNL {...props}/>,
    },
    {
        id: 'practicedetail',
        path: '/luyen-tap/kiem-tra-mo-dun/:idCourse/:idModule',
        exact: true,
        hidden: true,
        render: (props) => <ExamModulePage {...props}/>,
    },
    {
        id: 'practiceview',
        path: '/luyen-tap/xem/:idExam/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/xem/:idExam/:idCourse') ? <ExamViewPage {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'practiceThematicview',
        path: '/luyen-tap/chuyen-de/xem/:id/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/chuyen-de/xem/:id/:idCourse') ? <ExamThematicViewPage {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'practiceModuleview',
        path: '/luyen-tap/mo-dun/xem/:id/:idExam/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/mo-dun/xem/:id/:idExam/:idCourse') ? <ExamModuleViewPage {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'profile',
        path: '/luyen-tap/nguoi-dung/profile',
        exact: true,
        hidden: true,
        render: (props) => <ProfilePage {...props}/>,
    },
    {
        id: 'doExam',
        path: '/luyen-tap/lam-kiem-tra/:idmodule/:time/:idthematic/:id/:idExamUser/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/lam-kiem-tra/:idmodule/:time/:idthematic/:id/:idExamUser/:idCourse') ? <ExamDetail {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'doExamModule',
        path: '/luyen-tap/lam-kiem-tra/:idmodule/:time/:id/:idExamUser/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/lam-kiem-tra/:idmodule/:time/:id/:idExamUser/:idCourse') ? <ExamModuleDetail {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'doExamCourse',
        path: '/luyen-tap/lam-kiem-tra/:idExam/:time/:idExamUser/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/lam-kiem-tra/:idExam/:time/:idExamUser/:idCourse') ? <ExamCourseDetail {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'doExamCourse',
        path: '/luyen-tap/lam-kiem-tra-online/:idExam/:time/:idExamUser/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/lam-kiem-tra-online/:idExam/:time/:idExamUser/:idCourse') ? <ExamOnlineDetail {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'reviewExam',
        path: '/luyen-tap/xem-lai/:id',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('all', '/luyen-tap/xem-lai/:id') ? <ReviewExamPage {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'historyExam',
        path: '/luyen-tap/lich-su/:idExam/:idDTHV',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/lich-su/:idExam/:idDTHV') ? <HistoryExam {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'historyExam',
        path: '/luyen-tap/lich-su-admin/:idExam/:idDTHV',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('all', '/luyen-tap/lich-su-admin/:idExam/:idDTHV') ? <HistoryExam {...props}/> : <Redirect to="/auth/hocvien"/>),
    },
    {
        id: 'business',
        path: '/luyen-tap/kinh-doanh/:idKCT',
        exact: true,
        hidden: true,
        render: (props) => <BusinessPage {...props}/>,
    },
    {
        id: 'businessPrograme',
        path: '/luyen-tap/chuong-trinh/:idKCT',
        exact: true,
        hidden: true,
        render: (props) => <BusinessProgramePage {...props}/>,
    },
    {
        id: 'businessPrograme',
        path: '/luyen-tap/loai-chuong-trinh/:idTypeKCT',
        exact: true,
        hidden: true,
        render: (props) => <BusinessTypeProgramePage {...props}/>,
    },
    {
        id: 'businessProgrameUser',
        path: '/luyen-tap/khoa-hoc-cua-ban/:idTypeKCT',
        exact: true,
        hidden: true,
        render: (props) => <BusinessTypeProgramePageUser {...props}/>,
    },
    {
        id: 'introduceCourse',
        path: '/luyen-tap/gioi-thieu-khoa-hoc/:idCourse',
        exact: true,
        hidden: true,
        render: (props) => <IntroCoursePage {...props}/>,
    },
    {
        id: 'introduceCourse',
        path: '/luyen-tap/trang-chu',
        exact: true,
        hidden: true,
        render: (props) => <CoursesPage {...props}/>,                                                                                              
    },
    {
        id: 'cart',
        path: '/luyen-tap/gio-hang/:id',
        exact: true,
        hidden: true,
        render: (props) => <CartPage {...props}/>,
    },
    {
        id: 'payment',
        path: '/luyen-tap/thanh-toan/:idReceipt/:idReceiptDetail',
        exact: true,
        hidden: true,
        render: (props) => <PaymentPage {...props}/>
    },
    {
        id: 'coursesUser',
        path: '/luyen-tap/nguoi-dung/khoa-hoc',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/nguoi-dung/khoa-hoc') ? <CoursesUser {...props}/> : <Redirect to="/auth/hocvien"/>), 
    }, 
    {
        id: 'receiptUser',
        path: '/luyen-tap/nguoi-dung/hoa-don',
        exact: true,
        hidden: true,
        render: (props) => (shouldHaveAccessPermission('detail', '/luyen-tap/nguoi-dung/hoa-don') ? <ReceiptUserPage {...props}/> : <Redirect to="/auth/hocvien"/>), 
    },
    {
        id: 'checkout',
        path: '/luyen-tap/hoa-don/checkout',
        exact: true,
        hidden: true,
        render: (props) => <CheckOutPage {...props}/>, 
    },
    {
        id: 'checkout',
        path: '/luyen-tap/hoa-don/checkout2/:idReceipt',
        exact: true,
        hidden: true,
        render: (props) => <CheckOutPage2 {...props}/>, 
    },
]

export default routes;