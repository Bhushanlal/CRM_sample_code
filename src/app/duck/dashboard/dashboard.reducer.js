import {
  SUCCESS_ADD_DASHBOARD_TASK, ERROR_ADD_DASHBOARD_TASK,
  SUCCESS_LIST_DASHBOARD_TASK, ERROR_LIST_DASHBOARD_TASK,
  SUCCESS_DELETE_DASHBOARD_TASK, ERROR_DELETE_DASHBOARD_TASK,
  SUCCESS_UPDATE_DASHBOARD_TASK, ERROR_UPDATE_DASHBOARD_TASK,
  SUCCESS_GET_BUSINESS_SNAPSHOT, ERROR_GET_BUSINESS_SNAPSHOT,
  SUCCESS_LIST_DASHBOARD_NOTIFICATION, ERROR_LIST_DASHBOARD_NOTIFICATION,
  SUCCESS_DELETE_DASHBOARD_NOTIFICATION, ERROR_DELETE_DASHBOARD_NOTIFICATION,
  SUCCESS_DELETE_ALL_NOTIFICATION, ERROR_DELETE_ALL_NOTIFICATION,
  SUCCESS_MARK_AS_READ_NOTIFICATION, ERROR_MARK_AS_READ_NOTIFICATION,
  SUCCESS_USER_LOGIN_STATUS, ERROR_USER_LOGIN_STATUS
} from './dashboard.action';
import {
  DEFAULT_STATE
} from "./dashboard.state";

export const dashboardReducer = (state = DEFAULT_STATE, action = {
  type: {},
  data: {}
}) => {
  switch (action.type) {
    case SUCCESS_ADD_DASHBOARD_TASK:
      const addDashboardTaskData = action.data;
      return { ...state, addDashboardTaskData }
    case ERROR_ADD_DASHBOARD_TASK:
      const errorAddDashboardTaskData = action.data;
      return { ...state, addDashboardTaskData: errorAddDashboardTaskData }
    case SUCCESS_LIST_DASHBOARD_TASK:
      const listDashboardTaskData = action.data;
      return { ...state, listDashboardTaskData }
    case ERROR_LIST_DASHBOARD_TASK:
      const errorDashboardListTaskData = action.data;
      return { ...state, listDashboardTaskData: errorDashboardListTaskData }
    case SUCCESS_DELETE_DASHBOARD_TASK:
      const deleteDashboardTaskData = action.data;
      return { ...state, deleteDashboardTaskData }
    case ERROR_DELETE_DASHBOARD_TASK:
      const errorDeleteDashboardTaskData = action.data;
      return { ...state, deleteDashboardTaskData: errorDeleteDashboardTaskData }
    case SUCCESS_UPDATE_DASHBOARD_TASK:
      const updateDashboardTaskData = action.data;
      return { ...state, addDashboardTaskData: updateDashboardTaskData }
    case ERROR_UPDATE_DASHBOARD_TASK:
      const errorUpdateDashboardTaskData = action.data;
      return { ...state, addDashboardTaskData: errorUpdateDashboardTaskData }
    case SUCCESS_GET_BUSINESS_SNAPSHOT:
      const getBusinessSnapshotData = action.data;
      return { ...state, getBusinessSnapshotData }
    case ERROR_GET_BUSINESS_SNAPSHOT:
      const errorGetBusinessSnapshotData = action.data;
      return { ...state, getBusinessSnapshotData: errorGetBusinessSnapshotData }
    case SUCCESS_LIST_DASHBOARD_NOTIFICATION:
      const listDashboardNotificationData = action.data;
      return { ...state, listDashboardNotificationData }
    case ERROR_LIST_DASHBOARD_NOTIFICATION:
      const errorListDashboardNotificationData = action.data;
      return { ...state, listDashboardNotificationData: errorListDashboardNotificationData }
    case SUCCESS_DELETE_DASHBOARD_NOTIFICATION:
      const deleteDashboardNotificationData = action.data;
      return { ...state, deleteDashboardNotificationData }
    case ERROR_DELETE_DASHBOARD_NOTIFICATION:
      const errorDeleteDashboardNotificationData = action.data;
      return { ...state, deleteDashboardNotificationData: errorDeleteDashboardNotificationData }
    case SUCCESS_DELETE_ALL_NOTIFICATION:
      const deleteAllNotificationData = action.data;
      return { ...state, deleteAllNotificationData }
    case ERROR_DELETE_ALL_NOTIFICATION:
      const errorDeleteAllNotificationData = action.data;
      return { ...state, deleteAllNotificationData: errorDeleteAllNotificationData }
    case SUCCESS_MARK_AS_READ_NOTIFICATION:
      const markAsReadNotificationData = action.data;
      return { ...state, markAsReadNotificationData }
    case ERROR_MARK_AS_READ_NOTIFICATION:
      const errorMarkAsReadNotificationData = action.data;
      return { ...state, markAsReadNotificationData: errorMarkAsReadNotificationData }
    case SUCCESS_USER_LOGIN_STATUS:
      const loginStatusData = action.data;
      return { ...state, loginStatusData }
    case ERROR_USER_LOGIN_STATUS:
      const errorLoginStatusData = action.data;
      return { ...state, loginStatusData: errorLoginStatusData }
    default:
      return state;
  }
};