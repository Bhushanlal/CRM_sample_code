import { put, takeLatest } from 'redux-saga/effects';
import { contactUsFormResponse, CONTACT_US_FORM, ERROR_CONTACT_US_FORM, SUCCESS_CONTACT_US_FORM } from './website.action';
import { contactUsFormApi } from '../../../api/index';
import _ from 'lodash';
import { successHomeNotification } from '../../common/notification-alert';

// Contact US Form Data
function* contactUsFormRequest(data) {
    let getData = yield contactUsFormApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successHomeNotification(getData.data.message)
        yield put(contactUsFormResponse(SUCCESS_CONTACT_US_FORM, getData.data));
    } else {
        yield put(contactUsFormResponse(ERROR_CONTACT_US_FORM, getData.data));
    }
}

export function* contactUsFormWatcher() {
    yield takeLatest(CONTACT_US_FORM, contactUsFormRequest);
}