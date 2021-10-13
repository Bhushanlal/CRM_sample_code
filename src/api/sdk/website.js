import { request } from '../request/axios.request';
import { CONTACT_US_FORM } from '../routing/route';

export async function contactUsFormApi(data) {
    let websiteData = data.data;
    return request({ url: CONTACT_US_FORM, method: 'post', data: websiteData })
}