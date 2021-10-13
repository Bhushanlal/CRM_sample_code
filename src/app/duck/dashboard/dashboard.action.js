// Add Dashboard Task
export const ADD_DASHBOARD_TASK = 'ADD_DASHBOARD_TASK';
export const addDashboardTask = (data) => ({ type: ADD_DASHBOARD_TASK, data });
export const SUCCESS_ADD_DASHBOARD_TASK = 'SUCCESS_ADD_DASHBOARD_TASK';
export const ERROR_ADD_DASHBOARD_TASK = 'ERROR_ADD_DASHBOARD_TASK';
export const addDashboardTaskResponse = (type, data) => ({ type, data });

// List Dashboard Task
export const LIST_DASHBOARD_TASK = 'LIST_DASHBOARD_TASK';
export const listDashboardTask = (data) => ({ type: LIST_DASHBOARD_TASK, data });
export const SUCCESS_LIST_DASHBOARD_TASK = 'SUCCESS_LIST_DASHBOARD_TASK';
export const ERROR_LIST_DASHBOARD_TASK = 'ERROR_LIST_DASHBOARD_TASK';
export const listDashboardTaskResponse = (type, data) => ({ type, data });

//Delete Dashboard Task Data 
export const DELETE_DASHBOARD_TASK = 'DELETE_DASHBOARD_TASK';
export const deleteDashboardTask = (data) => ({ type: DELETE_DASHBOARD_TASK, data });
export const SUCCESS_DELETE_DASHBOARD_TASK = 'SUCCESS_DELETE_DASHBOARD_TASK';
export const ERROR_DELETE_DASHBOARD_TASK = 'ERROR_DELETE_DASHBOARD_TASK';
export const deleteDashboardTaskResponse = (type, data) => ({ type, data });

// Update Dashboard Task Data 
export const UPDATE_DASHBOARD_TASK = 'UPDATE_DASHBOARD_TASK';
export const updateDashboardTask = (data) => ({ type: UPDATE_DASHBOARD_TASK, data });
export const SUCCESS_UPDATE_DASHBOARD_TASK = 'SUCCESS_UPDATE_DASHBOARD_TASK';
export const ERROR_UPDATE_DASHBOARD_TASK = 'ERROR_UPDATE_DASHBOARD_TASK';
export const updateDashboardTaskResponse = (type, data) => ({ type, data });

// Get Business Snapshot
export const GET_BUSINESS_SNAPSHOT = 'GET_BUSINESS_SNAPSHOT';
export const getBusinessSnapshot = (data) => ({ type: GET_BUSINESS_SNAPSHOT, data });
export const SUCCESS_GET_BUSINESS_SNAPSHOT = 'SUCCESS_GET_BUSINESS_SNAPSHOT';
export const ERROR_GET_BUSINESS_SNAPSHOT = 'ERROR_GET_BUSINESS_SNAPSHOT';
export const getBusinessSnapshotResponse = (type, data) => ({ type, data });

// List Dashboard Notification
export const LIST_DASHBOARD_NOTIFICATION = 'LIST_DASHBOARD_NOTIFICATION';
export const listDashboardNotification = (data) => ({ type: LIST_DASHBOARD_NOTIFICATION, data });
export const SUCCESS_LIST_DASHBOARD_NOTIFICATION = 'SUCCESS_LIST_DASHBOARD_NOTIFICATION';
export const ERROR_LIST_DASHBOARD_NOTIFICATION = 'ERROR_LIST_DASHBOARD_NOTIFICATION';
export const listDashboardNotificationResponse = (type, data) => ({ type, data });

//Delete Dashboard Notification Data 
export const DELETE_DASHBOARD_NOTIFICATION = 'DELETE_DASHBOARD_NOTIFICATION';
export const deleteDashboardNotification = (data) => ({ type: DELETE_DASHBOARD_NOTIFICATION, data });
export const SUCCESS_DELETE_DASHBOARD_NOTIFICATION = 'SUCCESS_DELETE_DASHBOARD_NOTIFICATION';
export const ERROR_DELETE_DASHBOARD_NOTIFICATION = 'ERROR_DELETE_DASHBOARD_NOTIFICATION';
export const deleteDashboardNotificationResponse = (type, data) => ({ type, data });

// Delete All Notification
export const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';
export const deleteAllNotification = (data) => ({ type: DELETE_ALL_NOTIFICATION, data });
export const SUCCESS_DELETE_ALL_NOTIFICATION = 'SUCCESS_DELETE_ALL_NOTIFICATION';
export const ERROR_DELETE_ALL_NOTIFICATION = 'ERROR_DELETE_ALL_NOTIFICATION';
export const deleteAllNotificationResponse = (type, data) => ({ type, data });

// Mark as Read Notification
export const MARK_AS_READ_NOTIFICATION = 'MARK_AS_READ_NOTIFICATION';
export const markAsReadNotification = (data) => ({ type: MARK_AS_READ_NOTIFICATION, data });
export const SUCCESS_MARK_AS_READ_NOTIFICATION = 'SUCCESS_MARK_AS_READ_NOTIFICATION';
export const ERROR_MARK_AS_READ_NOTIFICATION = 'ERROR_MARK_AS_READ_NOTIFICATION';
export const markAsReadNotificationResponse = (type, data) => ({ type, data });

// Check user login status
export const USER_LOGIN_STATUS = 'USER_LOGIN_STATUS';
export const userLoginStatus = (data) => ({ type: USER_LOGIN_STATUS, data });
export const SUCCESS_USER_LOGIN_STATUS = 'SUCCESS_USER_LOGIN_STATUS';
export const ERROR_USER_LOGIN_STATUS = 'ERROR_USER_LOGIN_STATUS';
export const userLoginStatusResponse = (type, data) => ({ type, data });