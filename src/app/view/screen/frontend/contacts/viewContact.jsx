import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious, fieldValidator, capFirst } from '../../../../common/custom';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Link, withRouter } from "react-router-dom";
import ShowMoreText from 'react-show-more-text';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'
import Modal from "react-bootstrap/Modal";
import moment from 'moment';
import _ from 'lodash';
import { Loader } from '../../../component/frontend/loader/loader'
import { validateInputs } from '../../../../common/validation';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import ORANGE_ARROW from '../../../../assets/images/orange-arrow-left.svg'
import { constants, selectStyle } from '../../../../common/constants';
import { setImagePath } from '../../../../common/custom'
import { LIST_CONTACTS, EDIT_CONTACT_BASE, VIEW_CONTACT_BASE, VIEW_LEAD_BASE, ADD_LEAD } from "../../../../routing/routeContants";
import { getContactById, deleteContact, addContactNote, listContactNote, deleteContactNote, updateContactNote,
    listContactTask, addContactTask, deleteContactTask, updateContactTask } from '../../../../duck/contact/contact.action';
import { SubscriptionPlan } from "../profile/subscriptionPlans"
import { getUserDetails } from '../../../../storage/user';

export const NewViewContact = props => {
    let contactId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        contactId = props.match.params.id
    }
    const textAreaRef = useRef();
    const [serviceMessage, setServiceMessage] = useState('');
    const textAreaTwoRef = useRef();
    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const getContactByIdData = useSelector(state => state.contact.getContactByIdData);
    const prevGetContactByIdData = usePrevious({ getContactByIdData });
    const deleteContactData = useSelector(state => state.contact.deleteContactData);
    const prevDeleteContactData = usePrevious({ deleteContactData });

    // Set initial State Value For View Detail
    const [state, setState] = useState({
        email: '', organization: '', phone: '', refferBy: '', firstName: '', lastName: '',
        correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT,
        firstNameInformation: '', allLeads: [], title: ''
    });

    // Set The State Value Of Contact Note 
    const [noteModalShow, setNoteModalShow] = useState(false);
    const [noteServiceMessage, setNoteServiceMessage] = useState('');
    const [noteState, setNoteState] = useState({
        note: '', noteCls: '', noteErr: '', page: 1, limit: 10, totalNoteRecord: 0,
        notesList: [], noteId: '', hasMore: true
    });
    const addContactNoteData = useSelector(state => state.contact.addContactNoteData);
    const prevAddContactNoteData = usePrevious({ addContactNoteData });
    const listContactNoteData = useSelector(state => state.contact.listContactNoteData);
    const prevListContactNoteData = usePrevious({ listContactNoteData });
    const deleteContactNoteData = useSelector(state => state.contact.deleteContactNoteData);
    const prevDeleteContactNoteData = usePrevious({ deleteContactNoteData });

    // Set The State Value Of Task 
    const taskDueTypeOption = [{ value: 'Due in 1 Day', label: 'Due in 1 Day' }, { value: 'Due in 3 Days', label: 'Due in 3 Days' }, { value: 'Due in 1 Week', label: 'Due in 1 Week' }, { value: 'Due in 1 Month', label: 'Due in 1 Month' }, { value: 'Custom', label: 'Custom' }, { value: 'No due date', label: 'No due date' }]; 
    const taskTypeOption = [{ value: 'To-do', label: 'To-do' }, { value: 'Follow up', label: 'Follow up' }]; 
    const taskViewOptions = [{ value: '', label: 'All' }, { value: 0, label: 'Open' }, { value: 1, label: 'Closed' }];
    const [taskModalShow, setTaskModalShow] = useState(false);
    const [taskFilter, setTaskFilter] = useState(0);
    const [taskFilterSelect, setTaskFilterSelect] = useState({ value: 0, label: 'Open' });
    const [taskServiceMessage, setTaskServiceMessage] = useState('');
    const [taskState, setTaskState] = useState({
        taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '',
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
        customDate: new Date(), customDateErr: '', customDateCls: '',
        page: 1, limit: 10, totalTaskRecord: 0, taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        tasksList: [], taskId: '', hasMore: true, taskTypeSelect: { value: 'To-do', label: 'To-do' },
        associateLeadSelect: '', associateLeadSelectValue: ''
    });
    const listContactTaskData = useSelector(state => state.contact.listContactTaskData);
    const prevListContactTaskData = usePrevious({ listContactTaskData });
    const addContactTaskData = useSelector(state => state.contact.addContactTaskData);
    const prevAddContactTaskData = usePrevious({ addContactTaskData });
    const deleteContactTaskData = useSelector(state => state.contact.deleteContactTaskData);
    const prevDeleteContactTaskData = usePrevious({ deleteContactTaskData });


    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength, fieldType)
    }

    // Set The Note Input Values
    const setNoteValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setNoteState({ ...noteState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setNoteServiceMessage('');
    }

    // Set The Task Input Values
    const setTaskValue = (e, type, maxLength, minLength, fieldType) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength, fieldType)
        if (e.target.name === 'taskDueType') {
            setTaskState({ ...taskState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName,
                 customDate: '', customDateErr: '', customDateCls: '' });
        } else {
            setTaskState({ ...taskState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        }
        setTaskServiceMessage('');
    }

    // On Load Get Contact
    useEffect(() => {
        setLoader(true)
        dispatch(getContactById({ id: contactId }))
        dispatch(listContactNote({ contact_id: contactId, limit: noteState.limit, page: noteState.page }))
        dispatch(listContactTask({ contact_id: contactId, limit: taskState.limit, page: taskState.page, status: taskFilter }))
    }, [contactId]); // eslint-disable-line react-hooks/exhaustive-deps

    // List Contact Data and Note Data 
    useEffect(() => {
        if (prevGetContactByIdData && prevGetContactByIdData.getContactByIdData !== getContactByIdData) {
            if (getContactByIdData && _.has(getContactByIdData, 'data') && getContactByIdData.success === true) {
                setLoader(false)
                if (getContactByIdData.data && getContactByIdData.data.id) {
                    setState({
                        ...state, email: getContactByIdData.data.email, phone: getContactByIdData.data.phone, organization: getContactByIdData.data.organization,
                        title: getContactByIdData.data.title !==null ? getContactByIdData.data.title : '',
                        firstName: getContactByIdData.data.first_name, lastName: getContactByIdData.data.last_name,
                        refferBy: (getContactByIdData.data && getContactByIdData.data.referred_by !== null ? { value: getContactByIdData.data.referred_by.id, label: getContactByIdData.data.referred_by.first_name + ' ' + (getContactByIdData.data.referred_by && getContactByIdData.data.referred_by.last_name ? getContactByIdData.data.referred_by.last_name : '') } : ''),
                        firstNameInformation: getContactByIdData.data.first_name_information,
                        allLeads: getContactByIdData.data.leads,
                    })
                } else {
                    props.history.push(LIST_CONTACTS)
                }
            }
            if (getContactByIdData && _.has(getContactByIdData, 'message') && getContactByIdData.success === false) {
                setLoader(false)
            }
        }
        if (prevListContactNoteData && prevListContactNoteData.listContactNoteData !== listContactNoteData) {
            if (listContactNoteData && _.has(listContactNoteData, 'data') && listContactNoteData.success === true) {
                setLoader(false)
                let mergeNote = noteState.notesList.concat(listContactNoteData.data)
                if(mergeNote.length === listContactNoteData.total){
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listContactNoteData.total, hasMore: false })
                }else{
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listContactNoteData.total, hasMore: true })
                }
            }
            if (listContactNoteData && _.has(listContactNoteData, 'message') && listContactNoteData.success === false) {
                setLoader(false)
                setNoteModalShow(false)
            }
        }
        if (prevListContactTaskData && prevListContactTaskData.listContactTaskData !== listContactTaskData) {
            if (listContactTaskData && _.has(listContactTaskData, 'data') && listContactTaskData.success === true) {
                setLoader(false)
                let mergeTask = taskState.tasksList.concat(listContactTaskData.data)
                if(mergeTask.length === listContactTaskData.total){
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listContactTaskData.total, hasMore: false })
                }else{
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listContactTaskData.total, hasMore: true })
                }

            }
            if (listContactTaskData && _.has(listContactTaskData, 'message') && listContactTaskData.success === false) {
                setLoader(false)
                setTaskModalShow(false)
            }
        }
    }, [getContactByIdData, prevGetContactByIdData, listContactNoteData, prevListContactNoteData, prevListContactTaskData, listContactTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Delete Contact Data 
    const deleteContactFunction = (e) => {
        e.preventDefault();
        setServiceMessage('');
        Swal.fire({
            title: 'Are you sure?',
            text: 'If you delete the contact, all associated Notes, Tasks and references will be lost. Are you sure you want to delete the contact?',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass:"mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteContact({ contact_id: contactId }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Data Props
    useEffect(() => {
        if (prevDeleteContactData && prevDeleteContactData.deleteContactData !== deleteContactData) {
            if (deleteContactData && _.has(deleteContactData, 'data') && deleteContactData.success === true) {
                setLoader(false)
                props.history.push(LIST_CONTACTS)
            }
            if (deleteContactData && _.has(deleteContactData, 'message') && deleteContactData.success === false) {
                setLoader(false)
                setServiceMessage(deleteContactData.message)
            }
        }
    }, [deleteContactData, prevDeleteContactData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Add Contact Note
    const showContactNoteModal = (e) => {
        e.currentTarget.blur();
        setServiceMessage('');
        setNoteModalShow(true);
        setNoteServiceMessage('');
        setTimeout(function () { textAreaRef.current.focus(); }, 300);
        setNoteState({ ...noteState, noteCls: '', note: '', noteErr: '', noteId: '' })
    }

    // Save Contact Note 
    const saveContactNote = () => {
        let success = '';
        let error = state.wrongInput;
        let note = noteState.note, noteErr = '', noteCls = success, getError = false;

        if (validateInputs('required', note) === 'empty') {
            noteErr = 'Please enter note.';
            noteCls = error
            getError = true;
        }

        setNoteState({
            ...noteState, noteCls, noteErr
        })

        if (getError === false && noteErr === '') {
            setLoader(true)
            if (noteState.noteId) {
                dispatch(updateContactNote({ contact_id: contactId, detail: note, id: noteState.noteId }));
            } else {
                dispatch(addContactNote({ contact_id: contactId, detail: note }));
            }
        }
    }

    // After Add Contact Note Data
    useEffect(() => {
        if (prevAddContactNoteData && prevAddContactNoteData.addContactNoteData !== addContactNoteData) {
            if (addContactNoteData && _.has(addContactNoteData, 'data') && addContactNoteData.success === true) {
                setNoteModalShow(false)
                if(addContactNoteData.data && addContactNoteData.data.id){
                    let existNoteList = noteState.notesList;
                    let index = _.findIndex(existNoteList, {id: addContactNoteData.data.id});
                    existNoteList.splice(index, 1, addContactNoteData.data);
                    setLoader(false)
                }else{
                    setNoteState({...noteState, page:1, notesList:[]})
                    dispatch(listContactNote({ contact_id: contactId, limit: noteState.limit, page: 1 }))
                }
            }
            if (addContactNoteData && _.has(addContactNoteData, 'message') && addContactNoteData.success === false) {
                setLoader(false)
                setNoteServiceMessage(addContactNoteData.message)
            }
        }
    }, [addContactNoteData, prevAddContactNoteData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Note Data  By Pagination
    const getNotePageData = () => {
        let page = (noteState.page)+1
        setNoteState({ ...noteState, page: page })
        dispatch(listContactNote({ contact_id: contactId, limit: noteState.limit, page: page }))
    }

    // Delete Contact Note Data 
    const deleteContactNoteFunction = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this note!',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass:"mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteContactNote({ contact_id: contactId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Note Data Props
    useEffect(() => {
        if (prevDeleteContactNoteData && prevDeleteContactNoteData.deleteContactNoteData !== deleteContactNoteData) {
            if (deleteContactNoteData && _.has(deleteContactNoteData, 'data') && deleteContactNoteData.success === true) {
                setNoteState({...noteState, page:1, notesList:[]})
                dispatch(listContactNote({ contact_id: contactId, limit: noteState.limit, page: 1 }))
            }
            if (deleteContactNoteData && _.has(deleteContactNoteData, 'message') && deleteContactNoteData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteContactNoteData, prevDeleteContactNoteData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Updated Note Data 
    const showUpdateNoteData = (e, id, detail) => {
        e.preventDefault();
        setNoteState({ ...noteState, noteId: id, note: detail })
        setNoteModalShow(true)
    }

    // Show Contact Task
    const showContactTaskModal = (e) => {
        e.currentTarget.blur();
        setServiceMessage('');
        setTaskModalShow(true);
        setTaskServiceMessage('');
        setTaskState({ ...taskState, taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: 'To-do', label: 'To-do' },
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        customDate: new Date(), customDateErr: '', customDateCls: '', taskId: '', associateLeadSelect: '', associateLeadSelectValue: '' })
        setTimeout(function () { textAreaTwoRef.current.focus(); }, 300);
    }

    // set date for custom 
    const dateForCustom = (date) => {
        if (date === null) {
            setTaskState({ ...taskState, customDate: '', customDateCls: state.wrongInput, customDateErr: 'Please select custom date' })
        } else {
            setTaskState({ ...taskState, customDate: date, customDateCls: '', customDateErr: '' })
        }
        setTaskServiceMessage('');
    }


    // Save Contact Task 
    const saveContactTask = (status) => {
        let success = '';
        let error = state.wrongInput;
        let taskName = taskState.taskName, taskNameErr = '', taskNameCls = success,
            taskDueType = taskState.taskDueType, taskDueTypeErr = '', taskDueTypeCls = success,
            taskType = taskState.taskType, taskTypeErr = '', taskTypeCls = success,
            customDate = taskState.customDate, customDateErr = '', customDateCls = success,
            getError = false;

        if (validateInputs('required', taskName) === 'empty') {
            taskNameErr = 'Please enter task name';
            taskNameCls = error
            getError = true;
        }

        if (validateInputs('required', taskDueType) === 'empty') {
            taskDueTypeErr = 'Please select task due type';
            taskDueTypeCls = error
            getError = true;
        }

        if (validateInputs('required', taskType) === 'empty') {
            taskTypeErr = 'Please select task type';
            taskTypeCls = error
            getError = true;
        }

        if (taskDueType === 'Custom') {
            if (validateInputs('required', (customDate !== '' ? (customDate.getDate() + ' ' + customDate.getMonth()) : '')) === 'empty') {
                customDateErr = 'Please select custom date.';
                customDateCls = error
                getError = true;
            }
            setTaskState({
                ...taskState, taskNameErr, taskNameCls, taskTypeCls, taskTypeErr, taskDueTypeCls, taskDueTypeErr,
                customDateCls, customDateErr
            })
        } else {
            setTaskState({
                ...taskState, taskNameErr, taskNameCls, taskTypeCls, taskTypeErr, taskDueTypeCls, taskDueTypeErr
            })
        }

        setTaskServiceMessage('')

        if (taskDueType === 'Custom') {
            if (getError === false && taskNameErr === '' && taskTypeErr === '' && taskDueTypeErr === '' && customDateErr === '') {
                setLoader(true)
                if(taskState.taskId){
                    let taskData = {
                        contact_id: contactId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                        id: taskState.taskId
                    }
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateContactTask(taskData));

                }else{
                    let taskData = {
                        contact_id: contactId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                    };
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    dispatch(addContactTask(taskData));
                }
                
            }
        } else {
            if (getError === false && taskNameErr === '' && taskTypeErr === '' && taskDueTypeErr === '') {
                setLoader(true)
                if(taskState.taskId){
                    let taskData ={
                        contact_id: contactId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        id: taskState.taskId
                    }
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateContactTask(taskData));

                }else{
                    let taskData = {
                        contact_id: contactId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType
                    };
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    dispatch(addContactTask(taskData));
                }
              
            }
        }
        //
    }

    // After Add Contact Task Data
    useEffect(() => {
        if (prevAddContactTaskData && prevAddContactTaskData.addContactTaskData !== addContactTaskData) {
            if (addContactTaskData && _.has(addContactTaskData, 'data') && addContactTaskData.success === true) {
                setTaskModalShow(false)
                if(addContactTaskData.data && addContactTaskData.data.id){
                    let existTaskList = taskState.tasksList;
                    if(taskFilter ===0 &&  addContactTaskData.data.status===1){
                        _.remove(existTaskList, function (task) {
                            return task.id === addContactTaskData.data.id
                        });
                    }else{
                        let index = _.findIndex(existTaskList, {id: addContactTaskData.data.id});
                        existTaskList.splice(index, 1, addContactTaskData.data);
                    }
                    setLoader(false)
                }else{
                    setTaskState({...taskState, page:1, tasksList:[]})
                    let condition;
                    if(taskFilter===0 || taskFilter===1){
                        condition = { contact_id: contactId, limit: taskState.limit, page: 1, status: taskFilter }
                    }else{
                        condition = { contact_id: contactId, limit: taskState.limit, page: 1 }
                    }
                    dispatch(listContactTask(condition))
                }
            }
            if (addContactTaskData && _.has(addContactTaskData, 'message') && addContactTaskData.success === false) {
                setLoader(false)
                setTaskServiceMessage(addContactTaskData.message)
            }
        }
    }, [addContactTaskData, prevAddContactTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Task Data  By Pagination
    const getTaskPageData = () => {
        let page = (taskState.page)+1
        setTaskState({ ...taskState, page: page })
        let condition;
        if(taskFilter===0 || taskFilter===1){
            condition = { contact_id: contactId, limit: taskState.limit, page: page, status: taskFilter }
        }else{
            condition = { contact_id: contactId, limit: taskState.limit, page: page }
        }
        dispatch(listContactTask(condition))
    }

    // Delete Contact Task Data 
    const deleteContactTaskFunction = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this task!',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass:"mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteContactTask({ contact_id: contactId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Task Data Props
    useEffect(() => {
        if (prevDeleteContactTaskData && prevDeleteContactTaskData.deleteContactTaskData !== deleteContactTaskData) {
            if (deleteContactTaskData && _.has(deleteContactTaskData, 'data') && deleteContactTaskData.success === true) {
                let condition;
                setTaskState({...taskState, page:1, tasksList:[]})
                if((taskFilter===0 || taskFilter===1)){
                    condition = { contact_id: contactId, limit: taskState.limit, page: 1, status: taskFilter }
                }else{
                    condition = { contact_id: contactId, limit: taskState.limit, page: 1}
                }
                dispatch(listContactTask(condition))
            }
            if (deleteContactTaskData && _.has(deleteContactTaskData, 'message') && deleteContactTaskData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteContactTaskData, prevDeleteContactTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Updated Task Data 
    const showUpdateTaskData = (e, data) => {
        e.preventDefault();
        let arr = ["Due in 1 Day", "Due in 3 Days", "Due in 1 Week", "Due in 1 Month", "Custom", "No due date"];
        if(_.includes(arr, data.task_due_type)){
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: data.task_due_type, taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: data.task_due_type, label: data.task_due_type },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
            associateLeadSelectValue: (data && data.refer_to !== null ? data.refer_to : '') })
        }else{
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: 'Custom', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Custom', label: 'Custom' },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
            associateLeadSelectValue: (data && data.refer_to !== null ? data.refer_to : '')  })
        }
        setTaskModalShow(true)
    }

    // On Change Task Filter 
    const onChangeTaskFilter = (data) => {
        setTaskFilterSelect(data)
        setTaskFilter(data.value)
        setTaskState({...taskState, page:1, tasksList:[]})
        let condition;
        if(data.value===0 || data.value===1){
            condition = { contact_id: contactId, limit: taskState.limit, page: 1, status: data.value }
        }else{
            condition = { contact_id: contactId, limit: taskState.limit, page: 1 }
        }
        dispatch(listContactTask(condition))
    }

    // Check Due Task
    /* const checkDueTask = (data) => {
        if(data.task_due_type==='Due in 3 Days'){
            return moment().isBefore(moment(data.created_at).add(3, 'days'))
        } else if(data.task_due_type==='Due in 1 Day'){
            return moment().isBefore(moment(data.created_at).add(1, 'days'))
        } else if(data.task_due_type==='Due in 1 Week'){
            return moment().isBefore(moment(data.created_at).add(1, 'week'))
        } else if(data.task_due_type==='Due in 1 Month'){
            return moment().isBefore(moment(data.created_at).add(1, 'months'))
        } else if(data.task_due_type==='No due date'){
            return true
        }else if(data.task_due_type==='Custom'){
            return moment().isBefore(moment(data.custom_date))
        }
    } */

    // Check Scroll Note
    const noteScrollList = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && noteState.hasMore) { 
            getNotePageData()
        }
    }
    
    // Check Scroll Task
    const taskScrollList = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && taskState.hasMore) { 
            getTaskPageData()
        }
    }

   /*  // handle input change event
     const handleInputChange = value => {
        setTaskState({ ...taskState, associateLeadSelect: value })
    };

    // handle selection
    const handleChange = value => {
        setTaskState({ ...taskState, associateLeadSelectValue: value })
    }

    // load options using API call
    const loadOptions = async () => {
        let data = [];
        let listOption = await getAssociateLeadListOptionValue({fields: 'id,name,potential_revenue', filter: taskState.associateLeadSelect })
        if (listOption && listOption.data && _.has(listOption.data, 'data') && listOption.success === true) {
            data = listOption.data.data;

        }
        return data;
    }; */

    // Create lead by contact 
    const createLeadByContact = (e) => {
        e.currentTarget.blur()
        if(currentPlan && currentPlan.plan_is_active === 0){
            let buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
            let warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
            let  msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
            Swal.fire({
                title: warMsg,
                html: msg,
                showCancelButton: true,
                confirmButtonText: buttonMsg,
                cancelButtonText: 'Close',
                reverseButtons: true,
                showCloseButton: true,
                customClass: "mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
            }).then((result) => {
                if (result.value) {
                    setSubscriptionModalShow(true)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }else{
            props.history.push({ 
                pathname: ADD_LEAD,
                 state:{contactDataState : {id: contactId, first_name:state.firstName, last_name: state.lastName, organization: state.organization, phone:state.phone, email: state.email}}
            })
        }
    }

    return (
        <>
        <Loader loader={loader} />
        <div className="main-site fixed--header">
            <Header getMainRoute={'contacts'}/>
            <main className="site-body">
                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb d-none d-lg-flex">
                                        <li className="breadcrumb-item"><Link to={LIST_CONTACTS}>Contacts</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">{capFirst(capFirst(state.firstName)) + ' ' + (state && state.lastName !== null ? capFirst(state.lastName) : '')}</li>
                                    </ol>
                                    <h2 className="title"><Link to={LIST_CONTACTS} className="d-lg-none mr-2"><img src={setImagePath(ORANGE_ARROW)} alt="" /></Link> {capFirst(capFirst(state.firstName)) + ' ' + (state && state.lastName !== null ? capFirst(state.lastName) : '')}</h2>
                                </div>
                                {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <Link to={ADD_CONTACT} className="dropdown-item" >Create Contact</Link>
                                        <Link to={ADD_LEAD} className="dropdown-item">Create Lead</Link>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                    </div>
                                </div> */}
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <button onClick={(e) => createLeadByContact(e)} className="btn btn-secondary mr-15 d-none d-lg-block">Create Lead </button>
                                <button type="button" disabled={currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0) ? true : false} onClick={(e) => deleteContactFunction(e)} className="btn btn-danger mr-15">Delete</button>
                                <Link to={LIST_CONTACTS} className="btn btn-primary d-none d-lg-block">Close</Link>
                                <Link to={EDIT_CONTACT_BASE + contactId} className="btn btn-secondary d-lg-none">Edit</Link>
                                {/* <div className="dropdown custom-dropdown d-none d-lg-block mr-15">
                                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Actions
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <Link to={ADD_CONTACT}  className="dropdown-item">Create Contact</Link>
                                        <Link to={ADD_LEAD} className="dropdown-item">Create Lead</Link>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                    </div>
                                </div> */}
                                {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <Link to={ADD_CONTACT}  className="dropdown-item">Create Contact</Link>
                                        <Link to={ADD_LEAD} className="dropdown-item">Create Lead</Link>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                        <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="middle-section">
                    <div className="container">
                        {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                        <div className="row no-gutters-mbl mb-lg-4">
                            <div className="col-12">
                                <div className="main-card">
                                    <div className="card">
                                        <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                            <h2>Contact Details</h2>
                                            <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                <Link to={EDIT_CONTACT_BASE + contactId} className="btn btn-secondary d-none d-lg-block">Edit</Link>
                                            </div>
                                        </div>
                                        <div className="card-body pt-1">
                                            <div className="contact-detail--wrap">
                                                <div className="row no-gutters-mbl">
                                                    <div className="col-xl-3 col-lg-4">
                                                        <div className="form-group">
                                                            <label>Email Address</label>
                                                            <div className="field-text">{state.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4">
                                                        <div className="form-group">
                                                            <label>Phone Number</label>
                                                            <div className="field-text">{state.phone || '-'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4">
                                                        <div className="form-group">
                                                            <label>Organization</label>
                                                            <div className="field-text">{state.organization || '-'} 
                                                                {state.title!=='' ? <><br />({state.title})</> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4">
                                                        <div className="form-group">
                                                            <label>Referred By</label>
                                                            <div className="field-text">
                                                                {state.refferBy && state.refferBy.label ?
                                                                    <Link to={VIEW_CONTACT_BASE + state.refferBy.value}>{state.refferBy.label}</Link>
                                                                    :
                                                                    <a href="#reffer" onClick={(e) => e.preventDefault()}>-</a>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-8">
                                                        <div className="form-group">
                                                            <label>Lead(s)</label>
                                                            <div className="field-text">
                                                                {(state.allLeads).length>0 ?
                                                                    _.map(state.allLeads, (data,k) =>{
                                                                        return <React.Fragment key={k}><Link to={VIEW_LEAD_BASE+data.id} >{data.name} </Link>{(state.allLeads).length===k+1 ? ''  : <br />}</React.Fragment>
                                                                    })
                                                                :
                                                                    <p>No Leads Available</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-9 col-lg">
                                                        <div className="form-group">
                                                            <label>More information about {capFirst(state.firstName) + ' ' + (state && state.lastName !== null ? capFirst(state.lastName) : '')}</label>
                                                            <div className="field-text">
                                                                <ShowMoreText
                                                                    lines={4}
                                                                    more='Show More'
                                                                    less='Show Less'
                                                                    keepNewLines={true}
                                                                >
                                                                {state.firstNameInformation || '-'}
                                                                </ShowMoreText>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row no-gutters-mbl">
                            <nav className="col-12 d-lg-none">
                                <div className="nav nav-tabs notes-tasks_nav" id="nav-tab" role="tablist">
                                    <a className="nav-link active" id="nav-Notes-tab" data-toggle="tab" href="#nav-Notes" role="tab" aria-controls="nav-Notes" aria-selected="true">Notes</a>
                                    <a className="nav-link" id="nav-Tasks-tab" data-toggle="tab" href="#nav-Tasks" role="tab" aria-controls="nav-Tasks" aria-selected="false">Tasks</a>
                                </div>
                            </nav>
                            <div className="col-12">
                                <div className="row no-gutters-mbl tab-content" id="nav-tabContent">
                                    <div className="mbl-tabbing tab-pane col-lg-6 fade show active" id="nav-Notes" role="tabpanel" aria-labelledby="nav-Notes-tab">
                                        <div className="main-card">
                                            <div className="card ">
                                                <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                    <h2>Notes</h2>
                                                    <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                        <button type="button" onClick={(e) => showContactNoteModal(e)} className="btn btn-secondary" >Add Note</button>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-0">

                                                    <div className="table-responsive table-vertical-scroll" onScroll={(e) => noteScrollList(e)}>
                                                        <table className="table table-striped notes--table smart-table">
                                                            <tbody>
                                                                {(noteState.notesList && noteState.notesList.length > 0) ?
                                                                    _.map(noteState.notesList, (data) => {
                                                                        return <tr key={"note" + data.id}>
                                                                            <td><a href="#updateNote" onClick={(e) => showUpdateNoteData(e, data.id, data.detail)}>{moment(data.created_at).format("ll")}</a></td>
                                                                            <td>
                                                                                <ShowMoreText
                                                                                    lines={4}
                                                                                    more='Show More'
                                                                                    less='Show Less'
                                                                                    keepNewLines={true}
                                                                                >
                                                                                {data.detail}
                                                                                </ShowMoreText>
                                                                            </td>
                                                                            <td className="text-right table-action">
                                                                                <div className="d-flex">
                                                                                    {/* <a href="#updateNote" data-toggle="tooltip" data-placement="top" title="Edit" onClick={(e) => showUpdateNoteData(e, data.id, data.detail)} className="edit-icn mr-3">
                                                                                        <svg version="1.1" fill="#817F80" width="17px" height="17px" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                            viewBox="0 0 477.873 477.873" style={{ "enableBackground": "new 0 0 477.873 477.873" }} xmlSpace="preserve">
                                                                                            <g>
                                                                                                <g>
                                                                                                    <path d="M392.533,238.937c-9.426,0-17.067,7.641-17.067,17.067V426.67c0,9.426-7.641,17.067-17.067,17.067H51.2
                                                                                                    c-9.426,0-17.067-7.641-17.067-17.067V85.337c0-9.426,7.641-17.067,17.067-17.067H256c9.426,0,17.067-7.641,17.067-17.067
                                                                                                    S265.426,34.137,256,34.137H51.2C22.923,34.137,0,57.06,0,85.337V426.67c0,28.277,22.923,51.2,51.2,51.2h307.2
                                                                                                    c28.277,0,51.2-22.923,51.2-51.2V256.003C409.6,246.578,401.959,238.937,392.533,238.937z"/>
                                                                                                </g>
                                                                                            </g>
                                                                                            <g>
                                                                                                <g>
                                                                                                    <path d="M458.742,19.142c-12.254-12.256-28.875-19.14-46.206-19.138c-17.341-0.05-33.979,6.846-46.199,19.149L141.534,243.937
                                                                                                    c-1.865,1.879-3.272,4.163-4.113,6.673l-34.133,102.4c-2.979,8.943,1.856,18.607,10.799,21.585
                                                                                                    c1.735,0.578,3.552,0.873,5.38,0.875c1.832-0.003,3.653-0.297,5.393-0.87l102.4-34.133c2.515-0.84,4.8-2.254,6.673-4.13
                                                                                                    l224.802-224.802C484.25,86.023,484.253,44.657,458.742,19.142z"/>
                                                                                                </g>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a> */}
                                                                                    <a href="#deleteNote" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => deleteContactNoteFunction(e, data.id)} className="close-icn">
                                                                                        <svg width="17px" height="17px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                            viewBox="0 0 174.239 174.239" style={{ "enableBackground": "new 0 0 174.239 174.239" }} xmlSpace="preserve">
                                                                                            <g>
                                                                                                <path d="M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305
                                                                                            c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z"
                                                                                                />
                                                                                                <path d="M120.83,53.414c-2.917-2.917-7.647-2.917-10.559,0L87.12,76.568L63.969,53.414c-2.917-2.917-7.642-2.917-10.559,0
                                                                                            s-2.917,7.642,0,10.559l23.151,23.153L53.409,110.28c-2.917,2.917-2.917,7.642,0,10.559c1.458,1.458,3.369,2.188,5.28,2.188
                                                                                            c1.911,0,3.824-0.729,5.28-2.188L87.12,97.686l23.151,23.153c1.458,1.458,3.369,2.188,5.28,2.188c1.911,0,3.821-0.729,5.28-2.188
                                                                                            c2.917-2.917,2.917-7.642,0-10.559L97.679,87.127l23.151-23.153C123.747,61.057,123.747,56.331,120.83,53.414z"/>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    })
                                                                    :
                                                                    <tr>
                                                                        <td colSpan="6" className="bg-white">
                                                                            <div className="no--contacts--note">
                                                                                <h5>This contact doesn’t have any notes</h5>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mbl-tabbing" id="nav-Tasks" role="tabpanel" aria-labelledby="nav-Tasks-tab">
                                        <div className="main-card">
                                            <div className="card">
                                                <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                    <h2>Tasks</h2>
                                                    <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                        {/* <span className="mr-15">View</span> */}
                                                        <Select
                                                            styles={selectStyle}
                                                            isSearchable={false}
                                                            className="task-view-filter"
                                                            components={makeAnimated()}
                                                            value={taskFilterSelect}
                                                            defaultValue={taskFilterSelect}
                                                            options={taskViewOptions}
                                                            onChange={(data) => onChangeTaskFilter(data)}
                                                        />
                                                        {/* <select className="form-control form-control-lg" value={taskFilter} onChange={(e) => onChangeTaskFilter(e)} >
                                                            <option value="">All</option>
                                                            <option value="0">Open</option>
                                                            <option value="1">Closed</option>
                                                        </select> */}
                                                        {/* <div className="dropdown custom-dropdown">
                                                            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                Open
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                                <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Open</a>
                                                                <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Close</a>
                                                                <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>---</a>
                                                            </div>
                                                        </div> */}
                                                        <button type="button" onClick={(e) => showContactTaskModal(e)} className="btn btn-secondary ml-15">Add Task </button>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-0">

                                                    <div className="table-responsive table-vertical-scroll" onScroll={(e) => taskScrollList(e)}>
                                                        <table className="table table-striped tasks--table smart-table" >
                                                            <tbody>
                                                                {/* <tr>
                                                                    <td className="task--status"><s>Completed</s></td>
                                                                    <td className="task--todo"><s>To Do</s></td>
                                                                    <td className="task--subject"><s>Lorem ipsum dolor sit amet, consectetur adipiscing</s></td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="task--status error">Overdue</td>
                                                                    <td className="task--todo">Reminder</td>
                                                                    <td className="task--subject">Lorem ipsum dolor sit amet, consectetur adipiscing</td>
                                                                </tr> */}
                                                                 {(taskState.tasksList && taskState.tasksList.length > 0) ?
                                                                    _.map(taskState.tasksList, (data) => {
                                                                        return <tr key={data.id}>
                                                                        {data.status===0 ?
                                                                        <>
                                                                        {/* <td className="task--status">{checkDueTask(data) ? data.task_due_type : <span className="text-danger">Overdue</span>}</td> */}
                                                                        <td className="task--status"><a href="#updateTask" onClick={(e) => showUpdateTaskData(e, data)}>{data.task_due_type==='Overdue' ? <span className="text-danger">{data.task_due_type}</span> : (data.task_due_type==='Due in 1 Day' ? 'Due Tomorrow' : data.task_due_type)}</a></td>
                                                                        <td className="task--todo">{data.task_type}</td>
                                                                        <td className="task--subject">
                                                                            <ShowMoreText
                                                                                lines={4}
                                                                                more='Show More'
                                                                                less='Show Less'
                                                                                keepNewLines={true}
                                                                            >
                                                                            {data.detail}
                                                                            </ShowMoreText>
                                                                        </td>
                                                                        <td className="text-right table-action">
                                                                                <div className="d-flex">
                                                                                    {/* <a href="#updateTask" data-toggle="tooltip" data-placement="top" title="Edit" onClick={(e) => showUpdateTaskData(e, data)} className="edit-icn mr-3">
                                                                                        <svg version="1.1" fill="#817F80" width="17px" height="17px" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                            viewBox="0 0 477.873 477.873" style={{ "enableBackground": "new 0 0 477.873 477.873" }} xmlSpace="preserve">
                                                                                            <g>
                                                                                                <g>
                                                                                                    <path d="M392.533,238.937c-9.426,0-17.067,7.641-17.067,17.067V426.67c0,9.426-7.641,17.067-17.067,17.067H51.2
                                                                                                    c-9.426,0-17.067-7.641-17.067-17.067V85.337c0-9.426,7.641-17.067,17.067-17.067H256c9.426,0,17.067-7.641,17.067-17.067
                                                                                                    S265.426,34.137,256,34.137H51.2C22.923,34.137,0,57.06,0,85.337V426.67c0,28.277,22.923,51.2,51.2,51.2h307.2
                                                                                                    c28.277,0,51.2-22.923,51.2-51.2V256.003C409.6,246.578,401.959,238.937,392.533,238.937z"/>
                                                                                                </g>
                                                                                            </g>
                                                                                            <g>
                                                                                                <g>
                                                                                                    <path d="M458.742,19.142c-12.254-12.256-28.875-19.14-46.206-19.138c-17.341-0.05-33.979,6.846-46.199,19.149L141.534,243.937
                                                                                                    c-1.865,1.879-3.272,4.163-4.113,6.673l-34.133,102.4c-2.979,8.943,1.856,18.607,10.799,21.585
                                                                                                    c1.735,0.578,3.552,0.873,5.38,0.875c1.832-0.003,3.653-0.297,5.393-0.87l102.4-34.133c2.515-0.84,4.8-2.254,6.673-4.13
                                                                                                    l224.802-224.802C484.25,86.023,484.253,44.657,458.742,19.142z"/>
                                                                                                </g>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a> */}
                                                                                    <a href="#deleteTask" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => deleteContactTaskFunction(e, data.id)} className="close-icn">
                                                                                        <svg width="17px" height="17px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                            viewBox="0 0 174.239 174.239" style={{ "enableBackground": "new 0 0 174.239 174.239" }} xmlSpace="preserve">
                                                                                            <g>
                                                                                                <path d="M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305
                                                                                            c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z"
                                                                                                />
                                                                                                <path d="M120.83,53.414c-2.917-2.917-7.647-2.917-10.559,0L87.12,76.568L63.969,53.414c-2.917-2.917-7.642-2.917-10.559,0
                                                                                            s-2.917,7.642,0,10.559l23.151,23.153L53.409,110.28c-2.917,2.917-2.917,7.642,0,10.559c1.458,1.458,3.369,2.188,5.28,2.188
                                                                                            c1.911,0,3.824-0.729,5.28-2.188L87.12,97.686l23.151,23.153c1.458,1.458,3.369,2.188,5.28,2.188c1.911,0,3.821-0.729,5.28-2.188
                                                                                            c2.917-2.917,2.917-7.642,0-10.559L97.679,87.127l23.151-23.153C123.747,61.057,123.747,56.331,120.83,53.414z"/>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </td>
                                                                            </>
                                                                        :
                                                                        <>
                                                                        <td className="task--status"><s>{data.task_due_type}</s></td>
                                                                        <td className="task--todo"><s>{data.task_type}</s></td>
                                                                        <td className="task--subject"><s>{data.detail}</s></td>
                                                                        <td className="text-right table-action">
                                                                                <div className="d-flex">
                                                                                    <a href="#deleteTask" onClick={(e) => deleteContactTaskFunction(e, data.id)} className="close-icn">
                                                                                        <svg width="17px" height="17px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                            viewBox="0 0 174.239 174.239" style={{ "enableBackground": "new 0 0 174.239 174.239" }} xmlSpace="preserve">
                                                                                            <g>
                                                                                                <path d="M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305
                                                                                            c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z"
                                                                                                />
                                                                                                <path d="M120.83,53.414c-2.917-2.917-7.647-2.917-10.559,0L87.12,76.568L63.969,53.414c-2.917-2.917-7.642-2.917-10.559,0
                                                                                            s-2.917,7.642,0,10.559l23.151,23.153L53.409,110.28c-2.917,2.917-2.917,7.642,0,10.559c1.458,1.458,3.369,2.188,5.28,2.188
                                                                                            c1.911,0,3.824-0.729,5.28-2.188L87.12,97.686l23.151,23.153c1.458,1.458,3.369,2.188,5.28,2.188c1.911,0,3.821-0.729,5.28-2.188
                                                                                            c2.917-2.917,2.917-7.642,0-10.559L97.679,87.127l23.151-23.153C123.747,61.057,123.747,56.331,120.83,53.414z"/>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </td>
                                                                        </>
                                                                    }
                                                                    </tr>
                                                                    })
                                                                    :
                                                                    <tr>
                                                                        <td colSpan="6" className="bg-white">
                                                                            <div className="no--contacts--note">
                                                                                <h5>This contact doesn’t have any tasks</h5>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* Note Modal*/}
                <Modal show={noteModalShow} onHide={() => setNoteModalShow(false)} size="lg" className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {noteState.noteId ? 'Update' : 'Add New'} Note
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {noteServiceMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{noteServiceMessage}</div> : ''}
                        <form>
                            <div className={"floating-label " + noteState.noteCls}>
                                <textarea ref={textAreaRef} className="floating-input floating-textarea" name="note" value={noteState.note || ''} onChange={(e) => setNoteValue(e, 'required', null, null)} placeholder="Type your notes here…" rows="5"></textarea>
                                <label>Type your notes here…</label>
                                {noteState.noteErr ? <span className="errorValidationMessage"> {noteState.noteErr}</span> : ''}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={() => setNoteModalShow(false)}>Cancel</button>
                        <button type="button" onClick={() => saveContactNote()} className="btn btn-primary">{noteState.noteId ? 'Update' : 'Add'}</button>
                    </Modal.Footer>
                </Modal>

                {/* Task Modal*/}
                <Modal show={taskModalShow} onHide={() => setTaskModalShow(false)} size="lg" className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {taskState.taskId ? 'Task Details' : 'Add New Task'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {taskServiceMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{taskServiceMessage}</div> : ''}
                        <form>
                            <div className={"floating-label " + taskState.taskNameCls}>
                                <textarea
                                    ref={textAreaTwoRef}
                                    className="floating-input floating-textarea"
                                    name="taskName"
                                    value={taskState.taskName || ''}
                                    onChange={(e) => setTaskValue(e, 'required', null, null)}
                                    placeholder="Task Name" rows="5"></textarea>
                                <label>Task Name</label>
                                {taskState.taskNameErr ? <span className="errorValidationMessage"> {taskState.taskNameErr}</span> : ''}
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4 mb-0">
                                    <div className={"floating-label " + taskState.taskDueTypeCls}>
                                        <Select
                                            styles={selectStyle}
                                            className="floating-select"
                                            components={makeAnimated()}
                                            isSearchable={false}
                                            value={taskState.taskDueTypeSelect}
                                            defaultValue={taskState.taskDueTypeSelect}
                                            options={taskDueTypeOption}
                                            placeholder="Select"
                                            onChange={data =>  setTaskState({ ...taskState, taskDueType: data.value, taskDueTypeSelect: data })}
                                        />
                                        {taskState.taskDueTypeErr ? <span className="errorValidationMessage"> {taskState.taskDueTypeErr}</span> : ''}
                                    </div>
                                </div>
                                {taskState.taskDueType === "Custom" ? <div className="form-group col-md-4 mb-0">
                                    <div className={"floating-label " + taskState.customDateCls}>
                                            <DatePicker
                                                type="text"
                                                name="customDate"
                                                className={taskState.customDateCls ? "floating-input " + taskState.customDateCls : "floating-input"}
                                                placeholder="" selected={taskState.customDate}
                                                onChange={(date) => dateForCustom(date)}
                                                minDate={moment().toDate()}
                                                placeholderText="Select a date"
                                            />
                                        {/* <label>Select a date</label> */}
                                        {taskState.customDateErr ? <span className="errorValidationMessage"> {taskState.customDateErr}</span> : ''}
                                    </div>
                                </div> : ''}
                                <div className="form-group col-md-4 mb-0">
                                    <div className={"floating-label " + taskState.taskTypeCls}>
                                        <Select
                                            styles={selectStyle}
                                            className="floating-select"
                                            components={makeAnimated()}
                                            isSearchable={false}
                                            value={taskState.taskTypeSelect}
                                            defaultValue={taskState.taskTypeSelect}
                                            options={taskTypeOption}
                                            onChange={data =>  setTaskState({ ...taskState, taskType: data.value, taskTypeSelect: data })}
                                        />
                                        {taskState.taskTypeErr ? <span className="errorValidationMessage"> {taskState.taskTypeErr}</span> : ''}
                                    </div>
                                </div>
                                {/* <div className="form-group col-md-4 mb-0">
                                    <div className="floating-label">
                                        <AsyncSelect
                                            styles={selectStyle}
                                            onFocus={e => {
                                                if (e.target.autocomplete) {
                                                    e.target.autocomplete = "nope";
                                                }
                                            }}
                                            isClearable
                                            placeholder="Associate a lead"
                                            value={taskState.associateLeadSelectValue}
                                            getOptionLabel={e => e.name}
                                            getOptionValue={e => e.id}
                                            loadOptions={(e) => loadOptions(e)}
                                            onInputChange={(e) => handleInputChange(e)}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        {taskState.taskId ? 
                            <button type="button" className="btn btn-secondary " onClick={() => saveContactTask(1)}>Mark as Completed</button>
                            :    
                            <button type="button" className="btn btn-dark" onClick={() => setTaskModalShow(false)}>Cancel</button>
                        }
                        <button type="button" onClick={() => saveContactTask(0)} className="btn btn-primary">{taskState.taskId ? 'Save' : 'Add'}</button>
                    </Modal.Footer>
                </Modal>


            </main>
            <Footer />
        </div>
        {/* Subscription Modal*/}
        <SubscriptionPlan loader={(data) => setLoader(data)}
                openSubscriptionModal={subscriptionModalShow}
                closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                updatePlanDetail={(data) => { setSubscriptionModalShow(false); setLoader(false) }}
                currentPlan={currentPlan}
            />
        </>
    );
}

export const ViewContact = withRouter(NewViewContact)