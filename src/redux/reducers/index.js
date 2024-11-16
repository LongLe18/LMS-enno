import { combineReducers } from 'redux';

import programme from './programme';
import course from './course';
import part from './part';
import thematic from './thematic';
import lesson from './lesson';
import user from './user';
import major from './major';
import exam from './exam';
import typeExam from './typeExam';
import question from './question';
import answer from './answer';
import exceprt from './exceprt';
import criteria from './criteria';
import advertise from './advertisement';
import document from './document';
import menu from './menu';
import descriptionCourse from './descriptionCourse';
import discount from './discount';
import dealer from './dealer';
import receipt from './receipt';
import bank from './bank';
import notification from './notification';
import comment from './comment';
import footer from './footer';
import contact from './contact';
import evaluate from './evaluate';

export default combineReducers({ 
    programme,
    course,
    part,
    thematic,
    lesson,
    user,
    major,
    exam,
    typeExam,
    question,
    answer,
    exceprt,
    criteria,
    advertise,
    document,
    menu,
    descriptionCourse,
    discount,
    dealer,
    receipt,
    bank,
    notification,
    comment,
    footer,
    contact,
    evaluate,
});