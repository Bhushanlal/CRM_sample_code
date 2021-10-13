import {
  SUCCESS_ADD_SERVICE, ERROR_ADD_SERVICE,
  SUCCESS_LIST_SERVICE_WITH_SOURCE, ERROR_LIST_SERVICE_WITH_SOURCE,
  SUCCESS_ADD_SOURCE, ERROR_ADD_SOURCE,
  SUCCESS_LIST_LEAD_STATUS, ERROR_LIST_LEAD_STATUS,
  SUCCESS_ADD_LEAD, ERROR_ADD_LEAD,
  SUCCESS_GET_LEAD_BY_ID, ERROR_GET_LEAD_BY_ID,
  SUCCESS_DELETE_LEAD, ERROR_DELETE_LEAD,
  SUCCESS_UPDATE_LEAD, ERROR_UPDATE_LEAD,
  SUCCESS_ADD_LEAD_NOTE, ERROR_ADD_LEAD_NOTE,
  SUCCESS_LIST_LEAD_NOTE, ERROR_LIST_LEAD_NOTE,
  SUCCESS_DELETE_LEAD_NOTE, ERROR_DELETE_LEAD_NOTE,
  SUCCESS_UPDATE_LEAD_NOTE, ERROR_UPDATE_LEAD_NOTE,
  SUCCESS_LIST_LEAD, ERROR_LIST_LEAD,
  SUCCESS_ADD_LEAD_TASK, ERROR_ADD_LEAD_TASK,
  SUCCESS_LIST_LEAD_TASK, ERROR_LIST_LEAD_TASK,
  SUCCESS_DELETE_LEAD_TASK, ERROR_DELETE_LEAD_TASK,
  SUCCESS_UPDATE_LEAD_TASK, ERROR_UPDATE_LEAD_TASK,
  SUCCESS_UPDATE_LEAD_STATUS, ERROR_UPDATE_LEAD_STATUS,
  SUCCESS_LIST_LEAD_WITH_POSITION, ERROR_LIST_LEAD_WITH_POSITION,
  SUCCESS_LIST_LOST_REASON, ERROR_LIST_LOST_REASON,
  SUCCESS_ADD_LOST_REASON, ERROR_ADD_LOST_REASON,
  SUCCESS_MARK_LEAD_STATUS, ERROR_MARK_LEAD_STATUS,
  SUCCESS_GET_ALL_COMPLETED_LEADS, ERROR_GET_ALL_COMPLETED_LEADS,
  SUCCESS_CUSTOMIZE_LEAD_STAGE, ERROR_CUSTOMIZE_LEAD_STAGE
} from './lead.action';
import {
  DEFAULT_STATE
} from "./lead.state";

export const leadReducer = (state = DEFAULT_STATE, action = {
  type: {},
  data: {}
}) => {
  switch (action.type) {
    case SUCCESS_ADD_SERVICE:
      const addServiceData = action.data;
      return { ...state, addServiceData }
    case ERROR_ADD_SERVICE:
      const errorAddServiceData = action.data;
      return { ...state, addServiceData: errorAddServiceData }
    case SUCCESS_LIST_SERVICE_WITH_SOURCE:
      const listServiceWithSourceData = action.data;
      return { ...state, listServiceWithSourceData }
    case ERROR_LIST_SERVICE_WITH_SOURCE:
      const errorListServiceWithSourceData = action.data;
      return { ...state, listServiceWithSourceData: errorListServiceWithSourceData }
    case SUCCESS_ADD_SOURCE:
      const addSourceData = action.data;
      return { ...state, addSourceData }
    case ERROR_ADD_SOURCE:
      const errorAddSourceData = action.data;
      return { ...state, addSourceData: errorAddSourceData }
    case SUCCESS_LIST_LEAD_STATUS:
      const listLeadStatusData = action.data;
      return { ...state, listLeadStatusData }
    case ERROR_LIST_LEAD_STATUS:
      const errorListLeadStatusData = action.data;
      return { ...state, listLeadStatusData: errorListLeadStatusData }
    case SUCCESS_ADD_LEAD:
      const addLeadData = action.data;
      return { ...state, addLeadData }
    case ERROR_ADD_LEAD:
      const errorAddLeadData = action.data;
      return { ...state, addLeadData: errorAddLeadData }
    case SUCCESS_GET_LEAD_BY_ID:
      const getLeadByIdData = action.data;
      return { ...state, getLeadByIdData }
    case ERROR_GET_LEAD_BY_ID:
      const errorgetLeadByIdData = action.data;
      return { ...state, getLeadByIdData: errorgetLeadByIdData }
    case SUCCESS_DELETE_LEAD:
      const deleteLeadData = action.data;
      return { ...state, deleteLeadData }
    case ERROR_DELETE_LEAD:
      const errorDeleteLeadData = action.data;
      return { ...state, deleteLeadData: errorDeleteLeadData }
    case SUCCESS_UPDATE_LEAD:
      const updateLeadData = action.data;
      return { ...state, addLeadData: updateLeadData }
    case ERROR_UPDATE_LEAD:
      const errorupdateLeadData = action.data;
      return { ...state, addLeadData: errorupdateLeadData }
    case SUCCESS_ADD_LEAD_NOTE:
      const addLeadNoteData = action.data;
      return { ...state, addLeadNoteData }
    case ERROR_ADD_LEAD_NOTE:
      const errorAddLeadNoteData = action.data;
      return { ...state, addLeadNoteData: errorAddLeadNoteData }
    case SUCCESS_LIST_LEAD_NOTE:
      const listLeadNoteData = action.data;
      return { ...state, listLeadNoteData }
    case ERROR_LIST_LEAD_NOTE:
      const errorListLeadNoteData = action.data;
      return { ...state, listLeadNoteData: errorListLeadNoteData }
    case SUCCESS_DELETE_LEAD_NOTE:
      const deleteLeadNoteData = action.data;
      return { ...state, deleteLeadNoteData }
    case ERROR_DELETE_LEAD_NOTE:
      const errorDeleteLeadNoteData = action.data;
      return { ...state, deleteLeadNoteData: errorDeleteLeadNoteData }
    case SUCCESS_UPDATE_LEAD_NOTE:
      const updateContactNoteData = action.data;
      return { ...state, addLeadNoteData: updateContactNoteData }
    case ERROR_UPDATE_LEAD_NOTE:
      const errorUpdateContactNoteData = action.data;
      return { ...state, addLeadNoteData: errorUpdateContactNoteData }
    case SUCCESS_LIST_LEAD:
      const listLeadData = action.data;
      return { ...state, listLeadData }
    case ERROR_LIST_LEAD:
      const errorlistLeadData = action.data;
      return { ...state, listLeadData: errorlistLeadData }
    case SUCCESS_ADD_LEAD_TASK:
      const addLeadTaskData = action.data;
      return { ...state, addLeadTaskData }
    case ERROR_ADD_LEAD_TASK:
      const errorAddLeadTaskData = action.data;
      return { ...state, addLeadTaskData: errorAddLeadTaskData }
    case SUCCESS_LIST_LEAD_TASK:
      const listLeadTaskData = action.data;
      return { ...state, listLeadTaskData }
    case ERROR_LIST_LEAD_TASK:
      const errorContactListTaskData = action.data;
      return { ...state, listLeadTaskData: errorContactListTaskData }
    case SUCCESS_DELETE_LEAD_TASK:
      const deleteLeadTaskData = action.data;
      return { ...state, deleteLeadTaskData }
    case ERROR_DELETE_LEAD_TASK:
      const errorDeleteLeadTaskData = action.data;
      return { ...state, deleteLeadTaskData: errorDeleteLeadTaskData }
    case SUCCESS_UPDATE_LEAD_TASK:
      const updateLeadTaskData = action.data;
      return { ...state, addLeadTaskData: updateLeadTaskData }
    case ERROR_UPDATE_LEAD_TASK:
      const errorUpdateLeadTaskData = action.data;
      return { ...state, addLeadTaskData: errorUpdateLeadTaskData }
    case SUCCESS_UPDATE_LEAD_STATUS:
      const updateLeadStatusData = action.data;
      return { ...state, updateLeadStatusData }
    case ERROR_UPDATE_LEAD_STATUS:
      const errorUpdateLeadStatusData = action.data;
      return { ...state, updateLeadStatusData: errorUpdateLeadStatusData }
    case SUCCESS_LIST_LEAD_WITH_POSITION:
      const listLeadWithPositionData = action.data;
      return { ...state, listLeadWithPositionData }
    case ERROR_LIST_LEAD_WITH_POSITION:
      const errorListLeadWithPositionData = action.data;
      return { ...state, listLeadWithPositionData: errorListLeadWithPositionData }
    case SUCCESS_LIST_LOST_REASON:
      const listLostReasonData = action.data;
      return { ...state, listLostReasonData }
    case ERROR_LIST_LOST_REASON:
      const errorListLostReasonData = action.data;
      return { ...state, listLostReasonData: errorListLostReasonData }
    case SUCCESS_ADD_LOST_REASON:
      const addLostReasonData = action.data;
      return { ...state, addLostReasonData }
    case ERROR_ADD_LOST_REASON:
      const erroraddLostReasonData = action.data;
      return { ...state, addLostReasonData: erroraddLostReasonData }
    case SUCCESS_MARK_LEAD_STATUS:
      const markLeadStatusData = action.data;
      return { ...state, markLeadStatusData }
    case ERROR_MARK_LEAD_STATUS:
      const errorMarkLeadStatusData = action.data;
      return { ...state, markLeadStatusData: errorMarkLeadStatusData }
    case SUCCESS_GET_ALL_COMPLETED_LEADS:
      const getAllCompletedLeadData = action.data;
      return { ...state, getAllCompletedLeadData }
    case ERROR_GET_ALL_COMPLETED_LEADS:
      const errorGetAllCompletedLeadData = action.data;
      return { ...state, getAllCompletedLeadData: errorGetAllCompletedLeadData }
    case SUCCESS_CUSTOMIZE_LEAD_STAGE:
      const customizeLeadStageData = action.data;
      return { ...state, customizeLeadStageData }
    case ERROR_CUSTOMIZE_LEAD_STAGE:
      const errorCustomizeLeadStage = action.data;
      return { ...state, customizeLeadStageData: errorCustomizeLeadStage }
    default:
      return state;
  }
};