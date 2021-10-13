import {
  SUCCESS_ADD_CONTACT, ERROR_ADD_CONTACT,
  SUCCESS_LIST_CONTACT, ERROR_LIST_CONTACT,
  SUCCESS_DELETE_CONTACT, ERROR_DELETE_CONTACT,
  SUCCESS_GET_CONTACT_BY_ID, ERROR_GET_CONTACT_BY_ID,
  SUCCESS_UPDATE_CONTACT, ERROR_UPDATE_CONTACT,
  SUCCESS_ADD_CONTACT_NOTE, ERROR_ADD_CONTACT_NOTE,
  SUCCESS_LIST_CONTACT_NOTE, ERROR_LIST_CONTACT_NOTE,
  SUCCESS_DELETE_CONTACT_NOTE, ERROR_DELETE_CONTACT_NOTE,
  SUCCESS_UPDATE_CONTACT_NOTE, ERROR_UPDATE_CONTACT_NOTE,
  SUCCESS_ADD_CONTACT_TASK, ERROR_ADD_CONTACT_TASK,
  SUCCESS_CONTACT_IMPORT, ERROR_CONTACT_IMPORT,
  SUCCESS_LIST_CONTACT_TASK, ERROR_LIST_CONTACT_TASK,
  SUCCESS_DELETE_CONTACT_TASK, ERROR_DELETE_CONTACT_TASK,
  SUCCESS_UPDATE_CONTACT_TASK, ERROR_UPDATE_CONTACT_TASK
} from './contact.action';
import {
  DEFAULT_STATE
} from "./contact.state";

export const contactReducer = (state = DEFAULT_STATE, action = {
  type: {},
  data: {}
}) => {
  switch (action.type) {
    case SUCCESS_ADD_CONTACT:
      const addContactData = action.data;
      return { ...state, addContactData }
    case ERROR_ADD_CONTACT:
      const errorAddContactData = action.data;
      return { ...state, addContactData: errorAddContactData }
    case SUCCESS_LIST_CONTACT:
      const listContactData = action.data;
      return { ...state, listContactData }
    case ERROR_LIST_CONTACT:
      const errorListContactData = action.data;
      return { ...state, listContactData: errorListContactData }
    case SUCCESS_DELETE_CONTACT:
      const deleteContactData = action.data;
      return { ...state, deleteContactData }
    case ERROR_DELETE_CONTACT:
      const errorDeleteContactData = action.data;
      return { ...state, deleteContactData: errorDeleteContactData }
    case SUCCESS_GET_CONTACT_BY_ID:
      const getContactByIdData = action.data;
      return { ...state, getContactByIdData }
    case ERROR_GET_CONTACT_BY_ID:
      const errorGetContactByIdData = action.data;
      return { ...state, getContactByIdData: errorGetContactByIdData }
    case SUCCESS_UPDATE_CONTACT:
      const updateContactData = action.data;
      return { ...state, addContactData: updateContactData }
    case ERROR_UPDATE_CONTACT:
      const errorUpdateContactData = action.data;
      return { ...state, addContactData: errorUpdateContactData }
    case SUCCESS_ADD_CONTACT_NOTE:
      const addContactNoteData = action.data;
      return { ...state, addContactNoteData }
    case ERROR_ADD_CONTACT_NOTE:
      const errorAddContactNoteData = action.data;
      return { ...state, addContactNoteData: errorAddContactNoteData }
    case SUCCESS_LIST_CONTACT_NOTE:
      const listContactNoteData = action.data;
      return { ...state, listContactNoteData }
    case ERROR_LIST_CONTACT_NOTE:
      const errorListContactNoteData = action.data;
      return { ...state, listContactNoteData: errorListContactNoteData }
    case SUCCESS_DELETE_CONTACT_NOTE:
      const deleteContactNoteData = action.data;
      return { ...state, deleteContactNoteData }
    case ERROR_DELETE_CONTACT_NOTE:
      const errorDeleteContactNoteData = action.data;
      return { ...state, deleteContactNoteData: errorDeleteContactNoteData }
    case SUCCESS_UPDATE_CONTACT_NOTE:
      const updateContactNoteData = action.data;
      return { ...state, addContactNoteData: updateContactNoteData }
    case ERROR_UPDATE_CONTACT_NOTE:
      const errorUpdateContactNoteData = action.data;
      return { ...state, addContactNoteData: errorUpdateContactNoteData }
    case SUCCESS_ADD_CONTACT_TASK:
      const addContactTaskData = action.data;
      return { ...state, addContactTaskData }
    case ERROR_ADD_CONTACT_TASK:
      const errorAddContactTaskData = action.data;
      return { ...state, addContactTaskData: errorAddContactTaskData }
    case SUCCESS_CONTACT_IMPORT:
      const contactImportData = action.data;
      return { ...state, contactImportData }
    case ERROR_CONTACT_IMPORT:
      const errorContactImportData = action.data;
      return { ...state, contactImportData: errorContactImportData }
    case SUCCESS_LIST_CONTACT_TASK:
      const listContactTaskData = action.data;
      return { ...state, listContactTaskData }
    case ERROR_LIST_CONTACT_TASK:
      const errorContactListTaskData = action.data;
      return { ...state, listContactTaskData: errorContactListTaskData }
    case SUCCESS_DELETE_CONTACT_TASK:
      const deleteContactTaskData = action.data;
      return { ...state, deleteContactTaskData }
    case ERROR_DELETE_CONTACT_TASK:
      const errorDeleteContactTaskData = action.data;
      return { ...state, deleteContactTaskData: errorDeleteContactTaskData }
    case SUCCESS_UPDATE_CONTACT_TASK:
      const updateContactTaskData = action.data;
      return { ...state, addContactTaskData: updateContactTaskData }
    case ERROR_UPDATE_CONTACT_TASK:
      const errorUpdateContactTaskData = action.data;
      return { ...state, addContactTaskData: errorUpdateContactTaskData }
    default:
      return state;
  }
};