
const COLUMN_TYPE = [
  {
    title: 'Boolean',
    value: 'boolean',
  },
  {
    title: 'Text',
    value: 'text',
  },
  {
    title: 'Long text',
    value: 'longtext',
  },
  {
    title: 'Varchar',
    value: 'varchar',
  },
  {
    title: 'Integer',
    value: 'integer',
  },
  {
    title: 'Big int',
    value: 'bigint',
  },
  {
    title: 'Small Int',
    value: 'smallint',
  },
  {
    title: 'Real',
    value: 'real',
  },
  {
    title: 'Datetime',
    value: 'datetime',
  },
];

const COMMON_STATUS = [
  {
    title: 'Đang hoạt động',
    value: 'active',
  },
  {
    title: 'Bị khóa',
    value: 'inactive',
  },
];

const APPOINMENT_STATUS = [
  {
    title: 'Chờ xác nhận',
    value: 'pending',
  },
  {
    title: 'Đã xác nhận',
    value: 'active',
  },
  {
    title: 'Đã kết thúc',
    value: 'completed',
  },
  {
    title: 'Đã bị hủy',
    value: 'cancelled',
  },
];

const FORMAT_TYPES = [
  {
    title: 'Kiểu chữ',
    value: 'text',
  },
  {
    title: 'Số tự nhiên',
    value: 'int',
  },
  {
    title: 'Số thực',
    value: 'float',
  },
  {
    title: 'Ngày tháng',
    value: 'date',
  },
  {
    title: 'Ngày tháng, giờ phút giây',
    value: 'datetime',
  },
  {
    title: 'Hình ảnh',
    value: 'image',
  },
  {
    title: 'Liên kết',
    value: 'relationship',
  },
  {
    title: 'Tùy biến',
    value: 'custom',
  },
];

const FORMAT_DATA_TYPES = [
  {
    value: 'text',
    label: 'Kiểu chữ',
  },
  {
    value: 'number',
    label: 'Kiểu số',
    children: [
      {
        value: 'int',
        label: 'Số tự nhiên',
      },
      {
        value: 'float',
        label: 'Số thực',
      },
    ],
  },
];

const LAYOUT_TYPES = [
  {
    title: 'Dọc',
    value: 'vertical',
  },
  {
    title: 'Ngang',
    value: 'horizontal ',
  },
];

const COLUMN_NUMBER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const THEME_TYPES = [
  { label: 'Xanh da trời', value: 'blue-theme' },
  { label: 'Màu đỏ', value: 'red-theme' },
  { label: 'Màu xám', value: 'gray-theme' },
  { label: 'Màu lá cây', value: 'green-theme' },
];

const UPLOAD_TYPES = [
  { label: 'Default', value: 'backend' },
  { label: 'MinIO', value: 'minio' },
];

const EXAMS_VERSIONS = [
  { label: 'Tự luyện', value: 'TU_LUYEN' },
  { label: 'Chính thức', value: 'CHINH_THUC' },
];

const COURSES_TYPES = [
  { label: 'Offline + live', value: 'OFFLINE' },
  { label: 'Online', value: 'ONLINE' },
];

const QUESTIONS_TYPES = [
  { label: 'Trắc nghiệm', value: 1 },
  { label: 'Tự luận ', value: 0 },
  { label: 'Đúng sai ', value: 2 },
];

const QUESTIONS_LEVELS = [
  { label: 'Dễ (Nhận biết)', value: 1 },
  { label: 'Vừa (Thông hiểu) ', value: 2 },
  { label: 'Khó (Vận dụng)', value: 3 },
  { label: 'Nâng cao (Vận dụng cao)', value: 4 },
];

const SUBJECT_LIST = [
  { label: 'Toán Học', value: 'TOAN' },
  { label: 'Ngữ Văn', value: 'VAN' },
  { label: 'Vật Lí', value: 'LI' },
  { label: 'Hóa Học', value: 'HOA' },
  { label: 'Sinh Học', value: 'SINH' },
  { label: 'Lịch Sử', value: 'SU' },
  { label: 'Địa lí', value: 'DIA' },
];

const EXAM_ANSWER_VIEW_LIST = [
  { label: 'Hàng 1 cột', value: '1' },
  { label: 'Hàng 2 cột', value: '2' },
  { label: 'Hàng 3 cột', value: '3' },
  { label: 'Hàng 4 cột', value: '4' },
];

const TYPE_PROGRAMES = [
  { label: 'Thi thử Online', value: 1 },
  { label: 'Đánh giá năng lực', value: 0 },
  { label: 'Đánh giá tư duy Bách khoa', value: 3 },
  { label: 'Ôn luyện', value: 2 },
];

const QUESTIONS_FORMATS = [{ label: 'Câu hỏi lựa chọn', value: 'LUA_CHON' }];

const ANSWER_OPTIONS = [
  { label: 'Đáp án A', value: 'A' },
  { label: 'Đáp án B', value: 'B' },
  { label: 'Đáp án C', value: 'C' },
  { label: 'Đáp án D', value: 'D' },
];

const CONFIG_LIST = {
  CONFIG_MODULE: 'CONFIG_MODULES',
  CONFIG_DEDUCE: 'CONFIG_DEDUCE_MODULES',
  CONFIG_CATEGORY: 'CONFIG_CATEGORY_MODULES',
  CONFIG_USER: 'CONFIG_USER',
  CONFIG_COMMON: 'CONFIG_COMMON',
  CONFIG_CRONJOB: 'CONFIG_CRONJOB',
  CONFIG_EMAIL: 'CONFIG_EMAIL',
  CONFIG_MOBILE: 'CONFIG_MOBILE',
  CONFIG_CLIENT: 'CONFIG_CLIENT',
};

const PAGE_SIZE_OPTIONS = [10, 50, 100, 500, 1000];

const constants = {
    CONFIG_LIST,
    COMMON_STATUS,
    APPOINMENT_STATUS,
    LAYOUT_TYPES,
    COLUMN_NUMBER,
    THEME_TYPES,
    UPLOAD_TYPES,
    EXAMS_VERSIONS,
    COURSES_TYPES,
    QUESTIONS_TYPES,
    TYPE_PROGRAMES,
    QUESTIONS_LEVELS,
    SUBJECT_LIST,
    QUESTIONS_FORMATS,
    ANSWER_OPTIONS,
    EXAM_ANSWER_VIEW_LIST,
    FORMAT_DATA_TYPES,
    COLUMN_TYPE,
    FORMAT_TYPES,
    PAGE_SIZE_OPTIONS,
};

export default constants;
