import jwt_decode from 'jwt-decode';
import { PERMISSIONS } from './permission';
import moment from 'moment';

export const getUserInfo = () => {
    return localStorage.getItem('userInfo');
}

export const shouldHaveAccessPermission = (key, sub) => {
    var isAccssed = false;
    if (localStorage.getItem('userToken') === null) {
        return isAccssed;
    };
    
    const role = jwt_decode(localStorage.getItem('userToken')).role;
    PERMISSIONS.map(permission => {
        if (permission.role === role) {
            if (permission.url.key === key) {
                permission.url.subs.map(subpath => {
                    if (subpath.key === sub) {
                        isAccssed = true;
                    }
                    return null;
                })
            }
        }
        return null;
    });
    return isAccssed;
};

export const formatedDate = (dateVal) => {
    return moment(dateVal).isValid() ? moment(dateVal).format('DD-MM-YYYY') : '--';
};

// Hàm chuyển đổi số sang giờ
export const secondsToMinutes = (time) => {
    let hours = Math.floor(time / 3600);
    hours = hours < 10 ? `0${hours}` : hours;

    let min = Math.floor((time % 3600) / 60);
    min = min < 10 ? `0${min}` : min;
  
    let sec = Math.floor(time % 60);
    sec = sec < 10 ? `0${sec}` : sec;
  
    return hours + ':' + min + ':' + sec;
};

// chuyển đổi thời gian (hh:mm:ss) thành số
export const timeToInt = (time) => {
    if (time) {
        let hours = time.split(':')[0];
        let min = time.split(':')[1];
        return (parseInt(hours) * 60) + (parseInt(min));
    } return 0;
}

export const cutString = (str = '', length = 20) => {
    let cut = str.indexOf(' ', length);
    if (cut === -1) return str;
    return str.substring(0, cut);
};

export const diff = (date) => {
    var dateEdit = new Date(date);
    var current = new Date();
    var diff = current.getTime() - dateEdit.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;
    var days = hours >= 24 ? Math.floor(hours / 24) : "";
    hours = days > 0 ? hours - days * 24 : hours;

    return (days > 0 ? days + " ngày " : "") + (hours <= 9 ? "0" : "") + hours + " giờ " + (minutes <= 9 ? "0" : "") + minutes + ' phút trước';
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
            if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

export const similarity = (s1, s2) => {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

// example: 
// var daylist = getDaysArray(new Date("2018-05-01"),new Date("2018-07-01"));
// daylist.map((v)=>v.toISOString().slice(0,10)).join("")
export function getDaysArray (start, end) {
    for(var arr=[],dt=new Date(start); dt <= new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

export function generateCaptcha() {
    var uniquechar = "";
 
    const randomchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    // Generate captcha for length of
    // 5 with random character
    for (let i = 1; i < 5; i++) {
        uniquechar += randomchar.charAt(Math.random() * randomchar.length)
    }
    return uniquechar;
}