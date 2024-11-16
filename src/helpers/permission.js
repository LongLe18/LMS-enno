// URL mà các role được truy cập
export const PERMISSIONS = [
    {   
        role: 0,
        url: {
            key: 'detail',
            subs: [
                {
                    name: 'Luyện thi',
                    key: '/luyen-tap/chi-tiet-luyen-tap/:id/:idCourse',
                },
                {
                    name: 'Đề thi',
                    key: '/luyen-tap/kiem-tra/:idCourse'
                },
                {
                    name: 'Đề thi',
                    key: '/luyen-tap/xem/:idExam/:idCourse'
                },
                {
                    name: 'Đề thi chuyên đề',
                    key: '/luyen-tap/chuyen-de/xem/:id/:idCourse'
                }, 
                {
                    name: 'Đề thi mô đun',
                    key: '/luyen-tap/mo-dun/xem/:id/:idExam/:idCourse'
                },
                {
                    name: 'Làm đề thi',
                    key: '/luyen-tap/lam-kiem-tra/:idmodule/:time/:idthematic/:id/:idExamUser/:idCourse'
                },
                {
                    name: 'Làm đề thi mô-đun',
                    key: '/luyen-tap/lam-kiem-tra/:idmodule/:time/:id/:idExamUser/:idCourse'
                },
                {
                    name: 'Làm đề thi tổng hợp',
                    key: '/luyen-tap/lam-kiem-tra/:idExam/:time/:idExamUser/:idCourse'
                },
                {
                    name: 'Làm đề thi online',
                    key: '/luyen-tap/lam-kiem-tra-online/:idExam/:time/:idExamUser/:idCourse'
                },
                {
                    name: 'Lịch sử thi',
                    key: '/luyen-tap/lich-su/:idExam/:idDTHV'
                },
                {
                    name: 'Khóa học của bạn',
                    key: '/luyen-tap/nguoi-dung/khoa-hoc'
                },
                {
                    name: 'Hóa đơn của bạn',
                    key: '/luyen-tap/nguoi-dung/hoa-don'
                },
            ]
        }
    }, 
    {
        role: 1,
        url: {
            key: 'all',
            subs: [
                {
                    name: 'Chuyên đề',
                    key: '/admin/thematic/thematic'
                }, 
                {
                    name: 'Danh mục module',
                    key: '/admin/thematic/cate'
                }, 
                {
                    name: 'Bài giảng',
                    key: '/admin/lesson/lesson'
                }, 
                {
                    name: 'Thêm mới', 
                    key: '/admin/lesson/addcate'
                },
                {
                    name: 'Danh mục',
                    key: '/admin/lesson/cate'
                },
                {
                    name: 'Danh muục',
                    key: '/admin/lesson/cate/:id'
                }, 
                {
                    name: 'Giảng dạy',
                    key: '/teacher/teaching'
                },
                {
                    name: 'Đại lý',
                    key: '/teacher/dealer'
                }, 
                {
                    name: 'Hỏi đáp',
                    key: '/teacher/reply'
                },
                {
                    name: 'Lịch sử thi',
                    key: '/luyen-tap/lich-su-admin/:idExam/:idDTHV'
                },
            ]
        }
    },
    {
        role: 2,
        url: {
            key: 'all',
            subs: [
                {
                    name: 'Chuyên đề',
                    key: '/admin/thematic/thematic'
                }, 
                {
                    name: 'Danh mục module',
                    key: '/admin/thematic/cate'
                }, 
                {
                    name: 'Bài giảng',
                    key: '/admin/lesson/lesson'
                }, 
                {
                    name: 'Thêm mới', 
                    key: '/admin/lesson/addcate'
                },
                {
                    name: 'Danh mục',
                    key: '/admin/lesson/cate'
                },
                {
                    name: 'Danh muục',
                    key: '/admin/lesson/cate/:id'
                }, 
                {
                    name: 'Chi tiết module',
                    key: '/admin/detailModule/:id'
                },
                {
                    name: 'Chi tiết bài giảng',
                    key: '/admin/detailLesson/:id'
                },
                {
                    name: 'Học viên',
                    key: '/admin/account/student'
                }, 
                {
                    name: 'Học viên 2',
                    key: '/admin/account/student/:id'
                },  
                {
                    name: 'Giáo viên',
                    key: '/admin/account/teacher'
                }, 
                {
                    name: 'Nhân viên',
                    key: '/admin/account/admin'
                }, 
                {
                    name: 'Chuyên nghành',
                    key: '/admin/account/major'
                },
                {
                    name: 'Xem lại đề thi',
                    key: '/luyen-tap/xem-lai/:id'
                },
                {
                    name: 'Quản lý tài liệu',
                    key: '/admin/business/book'
                },
                {
                    name: 'Quảng cáo khóa học',
                    key: '/admin/banner/banner'
                },
                {
                    name: 'Quản lý menu',
                    key: '/admin/banner/menu'
                },
                {
                    name: 'Khuyến mãi',
                    key: '/admin/business/discount'
                },
                {
                    name: 'Chiết khấu',
                    key: '/admin/business/dealer'
                },
                {
                    name: 'Chi tiết chiết khấu',
                    key: '/admin/business/detaildealer/:id'
                },
                {
                    name: 'Hóa đơn',
                    key: '/admin/business/receipt'
                },
                {
                    name: 'Chi tiết hóa đơn',
                    key: '/admin/business/detailreceipt/:id'
                },
                {
                    name: 'Đại lý',
                    key: '/admin/business/dealerTeacher'
                },
                {
                    name: 'Thống kê khóa học',
                    key: '/admin/statistic/course',
                },
                {
                    name: 'Thống kê giáo viên',
                    key: '/admin/statistic/teacher'
                },
                {
                    name: 'Thống kê học viên',
                    key: '/admin/statistic/student'
                },
                {
                    name: 'Thống kê kết quả thi',
                    key: '/admin/statistic/exam',
                },
                {
                    name: 'Hỏi đáp',
                    key: '/admin/reply'
                },
                {
                    name: 'Ngân hàng',
                    key: '/admin/system/bank'
                }, 
                {
                    name: 'Footer',
                    key: '/admin/system/footer'
                }, 
                {
                    name: 'Liên hệ',
                    key: '/admin/system/contact'
                },
                {
                    name: 'Lịch sử thi',
                    key: '/luyen-tap/lich-su-admin/:idExam/:idDTHV'
                },
            ]
        }
    }
]