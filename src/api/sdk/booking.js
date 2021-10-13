import { ADD_BOOKING, DELETE_BOOKING, GET_BOOKING_BY_ID, LIST_BOOKINGS, UPDATE_BOOKING,
    ADD_BOOKING_NOTE, LIST_BOOKING_NOTE, DELETE_BOOKING_NOTE, UPDATE_BOOKING_NOTE,
    ADD_BOOKING_TASK, BOOKING_TASK_DATA, DELETE_BOOKING_TASK,
    UPDATE_BOOKING_TASK } from '../routing/route';
import { request } from '../request/axios.request';

export async function addBookingApi(data) {
    let bookingData = data.data;
    return request({ url: ADD_BOOKING, method: 'post', data: bookingData })
}

export async function listBookingsApi(data) {
    let bookingData = data.data;
    return request({ url: LIST_BOOKINGS, method: 'post', data: bookingData })
}

export async function deleteBookingApi(data) {
    let bookingIds = data.data;
    return request({ url: DELETE_BOOKING, method: 'post', data: bookingIds })
}

export async function getBookingByIdApi(bookingData) {
    let bookingId = bookingData.data;
    return request({ url: GET_BOOKING_BY_ID, params: bookingId, method: 'post' })
}

export async function updateBookingApi(data) {
    let bookingData = data.data;
    return request({ url: UPDATE_BOOKING, method: 'post', data: bookingData })
}

export async function addBookingNoteApi(data) {
    let bookingNoteData = data.data;
    return request({ url: ADD_BOOKING_NOTE, method: 'post', data: bookingNoteData })
}

export async function listBookingNoteApi(data) {
    let bookingNoteData = data.data;
    return request({ url: LIST_BOOKING_NOTE, method: 'post', data: bookingNoteData })
}

export async function deleteBookingNoteApi(data) {
    let bookingNoteId = data.data;
    return request({ url: DELETE_BOOKING_NOTE, method: 'post', data: bookingNoteId })
}

export async function updateBookingNoteApi(data) {
    let bookingNoteData = data.data;
    return request({ url: UPDATE_BOOKING_NOTE, method: 'post', data: bookingNoteData })
}

export async function addBookingTaskApi(data) {
    let bookingTaskData = data.data;
    return request({ url: ADD_BOOKING_TASK, method: 'post', data: bookingTaskData })
}

export async function listBookingTaskApi(data) {
    let bookingTaskData = data.data;
    return request({ url: BOOKING_TASK_DATA, method: 'post', data: bookingTaskData })
}

export async function deleteBookingTaskApi(data) {
    let bookingTaskData = data.data;
    return request({ url: DELETE_BOOKING_TASK, method: 'post', data: bookingTaskData })
}

export async function updateBookingTaskApi(data) {
    let bookingTaskData = data.data;
    return request({ url: UPDATE_BOOKING_TASK, method: 'post', data: bookingTaskData })
}

// export async function getBookingListOptionValue(data) {
//     return request({ url: LIST_BOOKING, method: 'post', data })
// }