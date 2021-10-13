import { useEffect, useRef } from "react";
import { validateInputs } from './validation';
import { constants } from './constants'
import _ from 'lodash';
import moment from 'moment'
import history from '../../app/routing/history';
import { VIEW_PROFILE } from '../../app/routing/routeContants';
import Swal from 'sweetalert2'

// util function to convert the input to string type
export const convertToString = (input) => {
    if (input) {
        if (typeof input === "string") {
            return input;
        }
        return String(input);
    }
    return '';
}

// camelcase to
export const toWords = (input) => {
    input = convertToString(input);
    var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    return input.match(regex).join(' ').toLowerCase();
}

// validation function
export const fieldValidator = (field, value, type, password = null, maxLength = null, minLength = null, fieldType = null) => {
    // console.log(field, value, type, password, maxLength, minLength)
    let getError = false, fieldNameErr = field + 'Err', errorMsg = '', fieldCls = field + 'Cls';
    let newField = toWords(field)
    if (validateInputs(type, value) === 'empty') {
        if (fieldType === 'select') {
            errorMsg = `Please select ${newField}.`;
        } else {
            errorMsg = `Please enter ${newField}.`;
        }
        getError = true;
    } else if (validateInputs(type, value) === false) {
        if (field === 'newPassword' || field === 'password' || field === 'currentPassword') {
            errorMsg = 'A special character, an upper case, a lower case, a number & minimum 8 character are required.'
        } else {
            errorMsg = `Please enter valid ${newField}.`;
        }
        getError = true;
    } else if (field === 'confirmPassword' && (value !== password)) {
        errorMsg = 'Password and confirm password does not match.';
        getError = true;
    } else if ((field === 'noOfPersons' || field === 'planPrice' || field === 'trialPeriodDays') && parseInt(value, 10) === 0) {
        errorMsg = 'Please enter valid number and not 0.';
        getError = true;
    } else if (maxLength !== null && (value.length > maxLength)) {
        errorMsg = `Please enter maximum ${maxLength} ${type === 'string' || type === 'required' || type === 'Alphanumeric' ? 'characters' : 'digits'}.`;
        getError = true;
    } else if (minLength !== null && (value.length < minLength)) {
        errorMsg = `Please enter minimum ${minLength} ${type === 'string' || type === 'required' || type === 'Alphanumeric' ? 'characters' : 'digits'}.`;
        getError = true;
    }
    return ({ getError, fieldNameErr, errorMsg, fieldCls, setClassName: getError ? 'error' : '' })
}

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const replaceAll = (str, term, replacement) => {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

export const setImagePath = (path) => {
    if (constants.BUILD === true) {
        return replaceAll(replaceAll(path, "export default &quot;", ''), '&quot;;', '');
    }
    return path;
}

export const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Floating with two decimal
export const floatingWithTwoDecimal = (input) => {
    if (input && input !== 0) {
        return parseFloat(input).toFixed(2)
    }
    return '0.00';
}

// Get Param by Url 
export const getQueryStringParams = (query) => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                let [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {}
            )
        : {}
};

// Get Last Four Digit
export const getLastFourDigit = (str) => {
    if (str !== '') {
        return str.substring(str.length - 4, str.length);
    }
    return str
};

// validation function for amount filed
export const getValidationsOnsubmit = (getData) => {
    console.log(getData)
    let getAllErr = [];
    let setError = '';
    _.map(getData, (fd, ii) => {
        _.map(_.keys(fd), (dd) => {
            if (dd === 'item_charges') {
                setError = fieldValidator(dd, fd[dd], 'dynamicPositiveNumberWithDecimals', null, 10)
            } else if (dd === 'amount') {
                setError = fieldValidator(dd, fd[dd], 'dynamicPositiveNumberWithDecimals', null, 10)
            }
            if (setError.getError === true) {
                getAllErr.push({
                    errorIndex: ii,
                    message: setError.errorMsg,
                    field: dd
                })
            }
        })
    })
    return getAllErr;
}

export const getCurrentSession = () => {
    let past = moment().subtract(1, 'year');

    let lastYear = (moment(past).year());
    let currentYear = moment.max().year();
    return lastYear + '-' + currentYear
}

export const redirectToProfile = (msg) => {
    Swal.fire({
        title: 'Confirmation',
        html: msg,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        reverseButtons: true,
        showCloseButton: false,
        customClass: "mycustom-alert",
        cancelButtonClass: 'cancel-alert-note',
    }).then((result) => {
        history.push(VIEW_PROFILE+'#Payment')
    })
}