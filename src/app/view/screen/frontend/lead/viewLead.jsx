import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { withRouter, Link } from "react-router-dom";
import ORANGE_ARROW_LEFT from '../../../../assets/images/orange-arrow-left.svg'
import { setImagePath, usePrevious, fieldValidator } from '../../../../common/custom'
import { getLeadById, listLeadStatus, deleteLead, addLeadNote, listLeadNote, deleteLeadNote, updateLeadNote,
    addLeadTask, updateLeadTask, deleteLeadTask, listLeadTask, updateLeadStatus, listLeadWithPosition, addLostReason,
    markLeadStatus, listLostReason } from '../../../../duck/lead/lead.action';
import _ from 'lodash';
import { LIST_LEADS, EDIT_LEAD_BASE, VIEW_CONTACT_BASE, VIEW_QUOTE_BASE, VIEW_QUOTE_DETAIL_BASE, ADD_BASIC_QUOTE } from "../../../../routing/routeContants";
import Swal from 'sweetalert2'
import Modal from "react-bootstrap/Modal";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { constants, selectStyle } from '../../../../common/constants';
import { validateInputs } from '../../../../common/validation';
import ShowMoreText from 'react-show-more-text';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Loader } from '../../../component/frontend/loader/loader'
import {QuoteAdd} from './addQuote'
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const ViewLeadPage = props => {
    let leadId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        leadId = props.match.params.id
    }

    const dispatch = useDispatch();
    const textAreaRef = useRef();
    const textAreaTwoRef = useRef();
    const [loader, setLoader] = useState(false);
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [isCompleted, setIsCompleted] = useState(false)
    const [allLeadData, setAllLeadData] = useState([])
    const [leadSource, setLeadSource] = useState('-')
    const getLeadByIdData = useSelector(state => state.lead.getLeadByIdData);
    const prevGetLeadByIdData = usePrevious({ getLeadByIdData });
    const deleteLeadData = useSelector(state => state.lead.deleteLeadData);
    const prevDeleteLeadData = usePrevious({ deleteLeadData });
    const updateLeadStatusData = useSelector(state => state.lead.updateLeadStatusData);
    const prevUpdateLeadStatusData = usePrevious({ updateLeadStatusData });
    const [addQuoteShow, setAddQuoteModalShow] = useState(false);

    // Add Completed Modal State And Props
    const [completedModalShow, setCompletedModalShow] = useState(false);
    const [state, setState] = useState({
        type: "1", followTask: false, taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', amount: '', amountCls: '', amountErr: '',
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
        customDate: new Date(), customDateErr: '', customDateCls: '',
        taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        taskTypeSelect: { value: 'To-do', label: 'To-do' }, selectReason: '',
        selectReasonErr: '', selectReasonCls: '', leadId: '', setPosition: '',
    });
    const [completedModalServiceMessage, setCompletedModalServiceMessage] = useState('');
    const markLeadStatusData = useSelector(state => state.lead.markLeadStatusData);
    const prevMarkLeadStatusData = usePrevious({ markLeadStatusData });

    // Add Reason State And Props
    const [reasonModalShow, setReasonModalShow] = useState(false);
    const [reasonOptionMessage, setReasonOptionMessage] = useState('');
    const [reasonState, setReasonState] = useState({
        reason: '', reasonCls: '', reasonErr: '', reasonListOptions: [],
    });
    const addLostReasonData = useSelector(state => state.lead.addLostReasonData);
    const prevAddLostReasonData = usePrevious({ addLostReasonData });
    const listLostReasonData = useSelector(state => state.lead.listLostReasonData);
    const prevListLostReasonData = usePrevious({ listLostReasonData });

    // Get Selector Data For Lead Status
    const [leadStage, setLeadStage] = useState([])
    const [activeLeadStatus, setActiveLeadStatus] = useState(0)
    const listLeadStatusData = useSelector(state => state.lead.listLeadStatusData);
    const prevListLeadStatusData = usePrevious({ listLeadStatusData });

    // Set The State Value Of Contact Note 
    const [noteModalShow, setNoteModalShow] = useState(false);
    const [noteServiceMessage, setNoteServiceMessage] = useState('');
    const [noteState, setNoteState] = useState({
        note: '', noteCls: '', noteErr: '', page: 1, limit: 10, totalNoteRecord: 0,
        notesList: [], noteId: '', hasMore: true
    });
    const addLeadNoteData = useSelector(state => state.lead.addLeadNoteData);
    const prevAddLeadNoteData = usePrevious({ addLeadNoteData });
    const listLeadNoteData = useSelector(state => state.lead.listLeadNoteData);
    const prevListLeadNoteData = usePrevious({ listLeadNoteData });
    const deleteLeadNoteData = useSelector(state => state.lead.deleteLeadNoteData);
    const prevDeleteLeadNoteData = usePrevious({ deleteLeadNoteData });

    // Set The State Value Of Task 
    const taskDueTypeOption = [{ value: 'Due in 1 Day', label: 'Due in 1 Day' }, { value: 'Due in 3 Days', label: 'Due in 3 Days' }, { value: 'Due in 1 Week', label: 'Due in 1 Week' }, { value: 'Due in 1 Month', label: 'Due in 1 Month' }, { value: 'Custom', label: 'Custom' }, { value: 'No due date', label: 'No due date' }]; 
    const taskTypeOption = [{ value: 'To-do', label: 'To-do' }, { value: 'Follow up', label: 'Follow up' }]; 
    const taskViewOptions = [{ value: '', label: 'All' }, { value: 0, label: 'Open' }, { value:1, label: 'Closed' }];
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
        tasksList: [], taskId: '', hasMore: true, taskTypeSelect: { value: 'To-do', label: 'To-do' }
    });
    const listLeadTaskData = useSelector(state => state.lead.listLeadTaskData);
    const prevListLeadTaskData = usePrevious({ listLeadTaskData });
    const addLeadTaskData = useSelector(state => state.lead.addLeadTaskData);
    const prevAddLeadTaskData = usePrevious({ addLeadTaskData });
    const deleteLeadTaskData = useSelector(state => state.lead.deleteLeadTaskData);
    const prevDeleteLeadTaskData = usePrevious({ deleteLeadTaskData });

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(listLeadStatus())
        dispatch(listLeadNote({ lead_id: leadId, limit: noteState.limit, page: noteState.page }))
        dispatch(getLeadById({ id: leadId }))
        dispatch(listLostReason())
        dispatch(listLeadTask({ lead_id: leadId, limit: taskState.limit, page: taskState.page, status: taskFilter }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
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
    

    // List Lead Note And Task Data 
    useEffect(() => {
        if (prevListLeadNoteData && prevListLeadNoteData.listLeadNoteData !== listLeadNoteData) {
            if (listLeadNoteData && _.has(listLeadNoteData, 'data') && listLeadNoteData.success === true) {
                setLoader(false)
                let mergeNote = noteState.notesList.concat(listLeadNoteData.data)
                if (mergeNote.length === listLeadNoteData.total) {
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listLeadNoteData.total, hasMore: false })
                } else {
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listLeadNoteData.total, hasMore: true })
                }
            }
            if (listLeadNoteData && _.has(listLeadNoteData, 'message') && listLeadNoteData.success === false) {
                setLoader(false)
                setNoteModalShow(false)
            }
        }

        if (prevListLeadTaskData && prevListLeadTaskData.listLeadTaskData !== listLeadTaskData) {
            if (listLeadTaskData && _.has(listLeadTaskData, 'data') && listLeadTaskData.success === true) {
                setLoader(false)
                let mergeTask = taskState.tasksList.concat(listLeadTaskData.data)
                if(mergeTask.length === listLeadTaskData.total){
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listLeadTaskData.total, hasMore: false })
                }else{
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listLeadTaskData.total, hasMore: true })
                }

            }
            if (listLeadTaskData && _.has(listLeadTaskData, 'message') && listLeadTaskData.success === false) {
                setLoader(false)
                setTaskModalShow(false)
            }
        }

    }, [listLeadNoteData, prevListLeadNoteData, listLeadTaskData, prevListLeadTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Add Lead Note
    const showLeadNoteModal = (e) => {
        e.currentTarget.blur();
        setNoteModalShow(true);
        setNoteServiceMessage('');
        setTimeout(function () { textAreaRef.current.focus(); }, 300);
        setNoteState({ ...noteState, noteCls: '', note: '', noteErr: '', noteId: '' })
    }

    // Save Lead Note 
    const saveLeadNote = () => {
        let success = '';
        let error = constants.WRONG_INPUT;
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
                dispatch(updateLeadNote({ lead_id: leadId, detail: note, id: noteState.noteId }));
            } else {
                dispatch(addLeadNote({ lead_id: leadId, detail: note }));
            }
        }
    }

    // Show Updated Note Data 
    const showUpdateNoteData = (e, id, detail) => {
        e.preventDefault();
        setNoteState({ ...noteState, noteId: id, note: detail })
        setNoteModalShow(true)
    }

    // Check Scroll Note
    const noteScrollList = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && noteState.hasMore) {
            getNotePageData()
        }
    }

    // Note Data  By Pagination
    const getNotePageData = () => {
        let page = (noteState.page) + 1
        setNoteState({ ...noteState, page: page })
        dispatch(listLeadNote({ lead_id: leadId, limit: noteState.limit, page: page }))
    }

    // Delete Lead Note Data 
    const deleteLeadNoteFunction = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this note!',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteLeadNote({ lead_id: leadId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete lead Note And Task Data Props
    useEffect(() => {
        if (prevDeleteLeadNoteData && prevDeleteLeadNoteData.deleteLeadNoteData !== deleteLeadNoteData) {
            if (deleteLeadNoteData && _.has(deleteLeadNoteData, 'data') && deleteLeadNoteData.success === true) {
                setNoteState({ ...noteState, page: 1, notesList: [] })
                dispatch(listLeadNote({ lead_id: leadId, limit: noteState.limit, page: 1 }))
            }
            if (deleteLeadNoteData && _.has(deleteLeadNoteData, 'message') && deleteLeadNoteData.success === false) {
                setLoader(false)
            }
        }
        if (prevDeleteLeadTaskData && prevDeleteLeadTaskData.deleteLeadTaskData !== deleteLeadTaskData) {
            if (deleteLeadTaskData && _.has(deleteLeadTaskData, 'data') && deleteLeadTaskData.success === true) {
                let condition;
                setTaskState({...taskState, page:1, tasksList:[]})
                if(taskFilter===0 || taskFilter===1){
                    condition = { lead_id: leadId, limit: taskState.limit, page: 1, status: taskFilter }
                }else{
                    condition = { lead_id: leadId, limit: taskState.limit, page: 1}
                }
                dispatch(listLeadTask(condition))
            }
            if (deleteLeadTaskData && _.has(deleteLeadTaskData, 'message') && deleteLeadTaskData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteLeadNoteData, prevDeleteLeadNoteData, prevDeleteLeadTaskData, deleteLeadTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // After Add Lead Note And Task Data
    useEffect(() => {
        if (prevAddLeadNoteData && prevAddLeadNoteData.addLeadNoteData !== addLeadNoteData) {
            if (addLeadNoteData && _.has(addLeadNoteData, 'data') && addLeadNoteData.success === true) {
                setNoteModalShow(false)
                if (addLeadNoteData.data && addLeadNoteData.data.id) {
                    let existNoteList = noteState.notesList;
                    let index = _.findIndex(existNoteList, { id: addLeadNoteData.data.id });
                    existNoteList.splice(index, 1, addLeadNoteData.data);
                    setLoader(false)
                } else {
                    setNoteState({ ...noteState, page: 1, notesList: [] })
                    dispatch(listLeadNote({ lead_id: leadId, limit: noteState.limit, page: 1 }))
                }
            }
            if (addLeadNoteData && _.has(addLeadNoteData, 'message') && addLeadNoteData.success === false) {
                setLoader(false)
                setNoteServiceMessage(addLeadNoteData.message)
            }
        }
        if (prevAddLeadTaskData && prevAddLeadTaskData.addLeadTaskData !== addLeadTaskData) {
            if (addLeadTaskData && _.has(addLeadTaskData, 'data') && addLeadTaskData.success === true) {
                setTaskModalShow(false)
                if(addLeadTaskData.data && addLeadTaskData.data.id){
                    let existTaskList = taskState.tasksList;
                    if(taskFilter ===0 &&  addLeadTaskData.data.status===1){
                        _.remove(existTaskList, function (task) {
                            return task.id === addLeadTaskData.data.id
                        });
                    }else{
                        let index = _.findIndex(existTaskList, {id: addLeadTaskData.data.id});
                        existTaskList.splice(index, 1, addLeadTaskData.data);
                    }
                    setLoader(false)
                }else{
                    setTaskState({...taskState, page:1, tasksList:[]})
                    let condition;
                    if(taskFilter===0 || taskFilter===1){
                        condition = { lead_id: leadId, limit: taskState.limit, page: 1, status: taskFilter }
                    }else{
                        condition = { lead_id: leadId, limit: taskState.limit, page: 1 }
                    }
                    dispatch(listLeadTask(condition))
                }
            }
            if (addLeadTaskData && _.has(addLeadTaskData, 'message') && addLeadTaskData.success === false) {
                setLoader(false)
                setTaskServiceMessage(addLeadTaskData.message)
            }
        }
    }, [addLeadNoteData, prevAddLeadNoteData, addLeadTaskData, prevAddLeadTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // List Lead Status Data And Get Lead Data
    useEffect(() => {
        if (prevListLeadStatusData && prevListLeadStatusData.listLeadStatusData !== listLeadStatusData) {
            if (listLeadStatusData && _.has(listLeadStatusData, 'data') && listLeadStatusData.success === true) {
                let getLastStage = _.last(listLeadStatusData.data);
                let lastId =  getLastStage && getLastStage.id;
                if(lastId=== (allLeadData && allLeadData.lead_status_types_id)){
                    setIsCompleted(true)
                }
                setLeadStage(listLeadStatusData.data)

            }
            if (listLeadStatusData && _.has(listLeadStatusData, 'message') && listLeadStatusData.success === false) {
                setLoader(false)
                setServiceMessage(listLeadStatusData.message)
            }
        }
        if (prevGetLeadByIdData && prevGetLeadByIdData.getLeadByIdData !== getLeadByIdData) {
            if (getLeadByIdData && _.has(getLeadByIdData, 'data') && getLeadByIdData.success === true) {
                if (getLeadByIdData.data && getLeadByIdData.data.id) {
                    let getLastStage = _.last(leadStage);
                    let lastId =  getLastStage && getLastStage.id;
                    if(lastId===getLeadByIdData.data.lead_status_types_id){
                        setIsCompleted(true)
                    }
                    let leadSource= '-';
                    if(getLeadByIdData.data && getLeadByIdData.data.website!==null){
                        leadSource = getLeadByIdData.data.website
                    }
                    if(getLeadByIdData.data && getLeadByIdData.data.source_type && getLeadByIdData.data.source_type.id ){
                        leadSource = getLeadByIdData.data.source_type.name
                    }
                    if(getLeadByIdData.data && getLeadByIdData.data.referred_by && getLeadByIdData.data.referred_by.id ){
                        leadSource = getLeadByIdData.data.referred_by.first_name + ' '+ (getLeadByIdData.data.referred_by && getLeadByIdData.data.referred_by.last_name!==null ? getLeadByIdData.data.referred_by.last_name : '')
                    }
                    setLeadSource(leadSource)
                    setAllLeadData(getLeadByIdData.data)
                    setActiveLeadStatus(getLeadByIdData.data.lead_status_types_id)
                    setCompletedModalShow(false)
                } else {
                    props.history.push(LIST_LEADS)
                }
                setLoader(false)
            }
            if (getLeadByIdData && _.has(getLeadByIdData, 'message') && getLeadByIdData.success === false) {
                setLoader(false)
                setServiceMessage(getLeadByIdData.message)
            }
        }
        if (prevDeleteLeadData && prevDeleteLeadData.deleteLeadData !== deleteLeadData) {
            if (deleteLeadData && _.has(deleteLeadData, 'data') && deleteLeadData.success === true) {
                setLoader(false)
                props.history.push(LIST_LEADS)
            }
            if (deleteLeadData && _.has(deleteLeadData, 'message') && deleteLeadData.success === false) {
                setLoader(false)
                setServiceMessage(deleteLeadData.message)
            }
        }
        if (prevUpdateLeadStatusData && prevUpdateLeadStatusData.updateLeadStatusData !== updateLeadStatusData) {
            if (updateLeadStatusData && _.has(updateLeadStatusData, 'data') && updateLeadStatusData.success === true) {
                if (updateLeadStatusData.data && updateLeadStatusData.data.id) {
                    setActiveLeadStatus(updateLeadStatusData.data.lead_status_types_id)
                } 
                setLoader(false)
            }
            if (updateLeadStatusData && _.has(updateLeadStatusData, 'message') && updateLeadStatusData.success === false) {
                setLoader(false)
                setServiceMessage(updateLeadStatusData.message)
            }
        }

    }, [listLeadStatusData, prevListLeadStatusData, getLeadByIdData, prevGetLeadByIdData, prevDeleteLeadData, deleteLeadData, prevUpdateLeadStatusData, updateLeadStatusData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Delete lead Data 
    const deleteLeadFunction = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'If you delete the lead, all associated Notes, Tasks and references will be lost. Are you sure you want to delete the lead?',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteLead({ lead_id: leadId }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

     // Save Lead Task 
     const saveleadTask = (status) => {
        let success = '';
        let error = constants.WRONG_INPUT;
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
                        lead_id: leadId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                        id: taskState.taskId
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateLeadTask(taskData));

                }else{
                    dispatch(addLeadTask({
                        lead_id: leadId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                    }));
                }
                
            }
        } else {
            if (getError === false && taskNameErr === '' && taskTypeErr === '' && taskDueTypeErr === '') {
                setLoader(true)
                if(taskState.taskId){
                    let taskData ={
                        lead_id: leadId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        id: taskState.taskId
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateLeadTask(taskData));

                }else{
                    dispatch(addLeadTask({
                        lead_id: leadId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType
                    }));
                }
              
            }
        }
    }

    // set date for custom 
    const dateForCustom = (date) => {
        if (date === null) {
            setTaskState({ ...taskState, customDate: '', customDateCls: constants.WRONG_INPUT, customDateErr: 'Please select custom date' })
        } else {
            setTaskState({ ...taskState, customDate: date, customDateCls: '', customDateErr: '' })
        }
        setTaskServiceMessage('');
    }

    // Show Contact Task
    const showContactTaskModal = (e) => {
        e.currentTarget.blur();
        setTaskModalShow(true);
        setTaskServiceMessage('');
        setTaskState({ ...taskState, taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: 'To-do', label: 'To-do' },
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        customDate: new Date(), customDateErr: '', customDateCls: '', taskId: '' })
        setTimeout(function () { textAreaTwoRef.current.focus(); }, 300);
    }

      // Delete Lead Task Data 
      const deleteLeadTaskFunction = (e, id) => {
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
                dispatch(deleteLeadTask({ lead_id: leadId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Check Scroll Task
    const taskScrollList = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && taskState.hasMore) { 
            getTaskPageData()
        }
    }
    
    // Task Data  By Pagination
    const getTaskPageData = () => {
        let page = (taskState.page)+1
        setTaskState({ ...taskState, page: page })
        let condition;
        if(taskFilter===0 || taskFilter===1){
            condition = { lead_id: leadId, limit: taskState.limit, page: page, status: taskFilter }
        }else{
            condition = { lead_id: leadId, limit: taskState.limit, page: page }
        }
        dispatch(listLeadTask(condition))
    }


    // Show Updated Task Data 
    const showUpdateTaskData = (e, data) => {
        e.preventDefault();
        let arr = ["Due in 1 Day", "Due in 3 Days", "Due in 1 Week", "Due in 1 Month", "Custom", "No due date"];
        if(_.includes(arr, data.task_due_type)){
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: data.task_due_type, taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: data.task_due_type, label: data.task_due_type },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id })
        }else{
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: 'Custom', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Custom', label: 'Custom' },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id })
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
            condition = { lead_id: leadId, limit: taskState.limit, page: 1, status: data.value }
        }else{
            condition = { lead_id: leadId, limit: taskState.limit, page: 1 }
        }
        dispatch(listLeadTask(condition))
    }

    // On Click Set Lead Stage 
    const onClickSetLeadStage = (stageId, stage) => {
        if(stage){
            setCompletedModalShow(true)
            setState({
                ...state, leadId, type: "1", followTask: false, taskName: '', taskNameCls: '', taskNameErr: '',
                taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', amount: '', amountCls: '', amountErr: '',
                taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
                customDate: new Date(), customDateErr: '', customDateCls: '',
                taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
                taskTypeSelect: { value: 'To-do', label: 'To-do' }, selectReason: '',
                selectReasonErr: '', selectReasonCls: '',
            })
        }else{
            setLoader(true)
            dispatch(updateLeadStatus({id: leadId, lead_status_types_id: stageId}))
        }
    }

    //Custom Date Function
    const dateForCustomLostLead = (date) => {
        if (date === null) {
            setState({ ...state, customDate: '', customDateCls: constants.WRONG_INPUT, customDateErr: 'Please select custom date' })
        } else {
            setState({ ...state, customDate: date, customDateCls: '', customDateErr: '' })
        }
        setCompletedModalServiceMessage('');
    }

    // Mark As Completed or Lost 
    const markAsCompletedLost = () => {
        let success = '';
        let error = constants.WRONG_INPUT;
        let taskName = state.taskName, taskNameErr = '', taskNameCls = success,
            taskDueType = state.taskDueType, taskDueTypeErr = '', taskDueTypeCls = success,
            taskType = state.taskType, taskTypeErr = '', taskTypeCls = success,
            customDate = state.customDate, customDateErr = '', customDateCls = success,
            amount = state.amount, amountErr = '', amountCls = '', type = state.type, followTask = state.followTask, getError = false,
            selectReason = state.selectReason, selectReasonErr = '', selectReasonCls = '';

        if (followTask) {
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
            }
        }

        if (type === '1') {
            if (validateInputs('positiveNumberWithDecimals', amount) === 'empty') {
                amountErr = 'Please enter amount.';
                amountCls = error
                getError = true;
            } else if (validateInputs('positiveNumberWithDecimals', amount) === false) {
                amountErr = 'Please enter valid amount.';
                amountCls = error
                getError = true;
            } else if (amount && amount.length > 1 && amount.length > 11) {
                amountErr = 'Please enter maximum 10 digits.';
                amountCls = error
                getError = true;
            }
        } else {
            if (!(selectReason && selectReason.value)) {
                selectReasonErr = 'Please select reason.';
                selectReasonCls = error
                getError = true;
            }
        }

        setState({
            ...state, taskNameErr, taskNameCls, taskTypeCls, taskTypeErr, taskDueTypeCls, taskDueTypeErr,
            customDateCls, customDateErr, amountCls, amountErr, selectReasonErr, selectReasonCls
        })

        if (getError === false && selectReasonErr === '' && amountErr === '' && taskNameErr === '' && taskTypeErr === '' && taskDueTypeErr === '' && customDateErr === '') {
            const saveData = { lead_id: state.leadId };
            saveData.create_task = followTask ? 1 : 0;
            if (type === '1') {
                saveData.completed = 1;
                saveData.amount = amount;
            } else {
                saveData.completed = 0;
                saveData.lead_lost_reason_id = selectReason && selectReason.value;
            }
            if (followTask) {
                saveData.detail = taskName;
                saveData.task_due_type = taskDueType;
                saveData.task_type = taskType;
                if (taskDueType === 'Custom') {
                    saveData.custom_date = moment(customDate).format('YYYY-MM-DD');
                }
            }
            setLoader(true)
            dispatch(markLeadStatus(saveData));
        }
    }

    const addExtraReason = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    type="button"
                    className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => showReasonModal()}
                >Add New Lost Reason</button>
            </div>
        ) : null;

    // Show Service 
    const showReasonModal = () => {
        setReasonModalShow(true);
        setReasonOptionMessage('');
        setReasonState({ ...reasonState, reason: '', reasonCls: '', reasonErr: '' })
    }

    //Close Completed Modal
    const closeCompletedModal = () => {
        dispatch(listLeadWithPosition())
        setCompletedModalShow(false)
    }

    // Add Reason Data 
    const addReasonData = () => {
        let success = '';
        let error = constants.WRONG_INPUT;
        let reason = reasonState.reason, reasonErr = '', reasonCls = success, getError = false;

        if (validateInputs('required', reason) === 'empty') {
            reasonErr = 'Please enter reason.';
            reasonCls = error
            getError = true;
        }

        setReasonState({
            ...reasonState, reasonCls, reasonErr
        })

        if (getError === false && reasonErr === '') {
            setLoader(true)
            dispatch(addLostReason({ name: reason }))
        }
    }

    // For Completed and lost Lead And Add Reason Or List Reason
    useEffect(() => {
        if (prevListLostReasonData && prevListLostReasonData.listLostReasonData !== listLostReasonData) {
            if (listLostReasonData && _.has(listLostReasonData, 'data') && listLostReasonData.success === true) {
                setLoader(false)
                let reasonOption = _.map(listLostReasonData.data, (data) => { return { value: data.id, label: data.name } })
                setReasonState({ ...reasonState, reasonListOptions: reasonOption })
            }
            if (listLostReasonData && _.has(listLostReasonData, 'message') && listLostReasonData.success === false) {
                setLoader(false)
            }
        }
        if (prevAddLostReasonData && prevAddLostReasonData.addLostReasonData !== addLostReasonData) {
            if (addLostReasonData && _.has(addLostReasonData, 'data') && addLostReasonData.success === true) {
                if (addLostReasonData.data && addLostReasonData.data.id) {
                    let allOption = reasonState.reasonListOptions;
                    let data = { value: addLostReasonData.data.id, label: addLostReasonData.data.name }
                    allOption = [data, ...allOption];
                    setReasonState({ ...reasonState, reasonListOptions: allOption })
                    setState({ ...state, selectReason: data })
                }
                setLoader(false)
                setReasonModalShow(false)
            }
            if (addLostReasonData && _.has(addLostReasonData, 'message') && addLostReasonData.success === false) {
                setLoader(false)
                setReasonOptionMessage(addLostReasonData.message)
            }
        }
        if (prevMarkLeadStatusData && prevMarkLeadStatusData.markLeadStatusData !== markLeadStatusData) {
            if (markLeadStatusData && _.has(markLeadStatusData, 'data') && markLeadStatusData.success === true) {
                dispatch(getLeadById({ id: leadId }))
            }
            if (markLeadStatusData && _.has(markLeadStatusData, 'message') && markLeadStatusData.success === false) {
                setLoader(false)
                setCompletedModalServiceMessage(markLeadStatusData.message)
            }
        }
    }, [prevListLostReasonData, listLostReasonData, prevAddLostReasonData, addLostReasonData, prevMarkLeadStatusData, markLeadStatusData]);// eslint-disable-line react-hooks/exhaustive-deps
    
    // Create quote by lead 
    const createQuoteByLead = (e) => {
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
                pathname: ADD_BASIC_QUOTE, 
                state:{quoteLeadData : allLeadData}
            })
        }
    }
    
    return (
        <>
        <Loader loader={loader} />
        <div className="main-site fixed--header">
            <Header getMainRoute={'leads'} />
            <main className="site-body">

                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb d-none d-lg-flex">
                                        <li className="breadcrumb-item"><Link to={LIST_LEADS}>Leads</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">{allLeadData && allLeadData.name} </li>
                                    </ol>
                                    <h2 className="title"><Link to={LIST_LEADS} className="d-lg-none mr-2" ><img src={setImagePath(ORANGE_ARROW_LEFT)} alt="" /></Link><span className="title--text"> {allLeadData && allLeadData.name}</span> <small className="font-small">{allLeadData && allLeadData.event_type!==null ? ('('+allLeadData.event_type+ ')') : ''}</small></h2>
                                </div>
                               {/*  <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <Link to={ADD_CONTACT} className="dropdown-item">Create Contact</Link>
                                        <Link to={ADD_LEAD} className="dropdown-item">Create Lead</Link>
                                        <a className="dropdown-item" href="#phone" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                        <a className="dropdown-item" href="#phone" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                    </div>
                                </div> */}
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                {allLeadData && allLeadData.quote && allLeadData.quote.id ?
                                    <div class="quote-details">
                                        <Link to={(allLeadData.quote.quote_status_type_id===1 ? VIEW_QUOTE_BASE : VIEW_QUOTE_DETAIL_BASE)+allLeadData.quote.id} class="quote-id">Quote ID: {allLeadData.quote.quote_serial_no}</Link>
                                        {allLeadData.quote.quote_status_type_id === 5 ?
                                            allLeadData.quote.reject_reason===null || allLeadData.quote.reject_reason==='' ? <div class="quote-time">Accepted On: {moment(allLeadData.quote.timeline.signed_at).format('ll')}</div>  :  <div class="quote-time">Rejected On: {moment(allLeadData.quote.timeline.reject_at).format('ll')}</div>
                                            :
                                            allLeadData.quote.quote_status_type_id === 2 ?
                                             <div class="quote-time">Sent at: {moment(allLeadData.quote.timeline.sent_at).format('ll')}</div>
                                            :
                                            allLeadData.quote.quote_status_type_id === 3 ?
                                                <div class="quote-time">Viewed at: {moment(allLeadData.quote.timeline.viewed_at).format('ll')}</div>
                                                :
                                                <div class="quote-time">Last Updated: {moment(allLeadData.quote.updated_at).format('ll')}</div>
                                        }
                                    </div>   
                                    :
                                    <button onClick={(e) => createQuoteByLead(e)} className="btn btn-secondary mr-15">Create Quote </button>
                                }
                                <button type="button" disabled={currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0) ? true : false} onClick={(e) => deleteLeadFunction(e)} className="btn btn-danger mr-15">Delete</button>
                                <Link to={LIST_LEADS} className="btn btn-primary d-none d-lg-block">Close</Link>
                                <Link to={EDIT_LEAD_BASE + leadId} className="btn btn-secondary d-lg-none">Edit</Link>
                                {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <Link to={ADD_CONTACT} className="dropdown-item" >Create Contact</Link>
                                        <Link to={ADD_LEAD} className="dropdown-item" >Create Lead</Link>
                                        <a className="dropdown-item" href="#phone" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                        <a className="dropdown-item" href="#phone" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="middle-section">
                    <div className="container">
                    {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                    {isCompleted ?
                        allLeadData && allLeadData.lead_lost_reason_id===null
                        ?
                        <div className="row no-gutters-mbl">
                            <div className="col-12"> 
                                <div className="notify-completed d-inline-block w-100">Completed</div>
                            </div>
                        </div>
                        :
                        <div className="row no-gutters-mbl">
                            <div className="col-12"> 
                                <div className="notify-lost d-inline-block w-100">Lost</div>
                            </div>
                        </div>
                    :''}
                    {isCompleted ===false ?
                        <div className="row no-gutters-mbl mb-lg-4">
                            <div className="col-12">
                                <div className="main-card">
                                    <div className="card w-100">
                                        <div className="card-body p-0">
                                            <div className="new-lead-timeline">

                                                <div className="timeline_row">
                                                    {_.map(leadStage, (data, key) => {
                                                        return <div key={key} data-toggle="tooltip" data-placement="bottom" data-container="body" title="Click to change lead stage" onClick={(e) => (leadStage.length === key + 1 ? onClickSetLeadStage(data.id,true) : onClickSetLeadStage(data.id,false))} className={"timeline-cols pointer-cursor " + (activeLeadStatus === data.id ? 'active' : '')}><h5><em className="d-none d-lg-flex">{data.name}</em> <i className="d-lg-none">{key + 1}</i></h5><span></span></div>
                                                    })}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ''}

                        <div className="row no-gutters-mbl mb-lg-4">
                            <div className="col-12">
                                <div className="main-card">
                                    <div className="card">
                                        <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                            <h2>Lead Details</h2>
                                            {isCompleted===false ? 
                                                <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                    <Link to={EDIT_LEAD_BASE + leadId} className="btn btn-secondary d-none d-lg-block">Edit</Link>
                                                </div>
                                            :
                                            allLeadData && allLeadData.lead_lost_reason_id===null
                                            ?
                                                <div className="card-header_content d-flex justify-content-end align-items-center">
                                                    <h4 className="d-lg-block">Revenue: ${allLeadData && allLeadData.amount}</h4>
                                                </div>
                                                :
                                                <div className="card-header_content d-flex justify-content-end align-items-center">
                                                    <h4 className="d-lg-block">Reason: {allLeadData && allLeadData.lost_reason && allLeadData.lost_reason.id ? allLeadData.lost_reason.name : '-'}</h4>
                                                </div>
                                            }
                                        </div>
                                        <div className="card-body pt-1">
                                            <div className="contact-detail--wrap">
                                                <div className="row no-gutters-mbl">
                                                    <div className="col-lg-4">
                                                        <div className="form-group">
                                                            <label>Contact Information</label>
                                                            <div className="field-text">{allLeadData && allLeadData.contact && allLeadData.contact.id ? (allLeadData.contact.first_name + ' ' + (allLeadData.contact.last_name !== null ? allLeadData.contact.last_name : '')) : ''}</div>
                                                            <div className="field-text">{allLeadData && allLeadData.contact && allLeadData.contact.id ? allLeadData.contact.phone : ''}</div>
                                                            <div className="field-text">{allLeadData && allLeadData.contact && allLeadData.contact.id ? <Link to={VIEW_CONTACT_BASE+allLeadData.contact.id}>{allLeadData.contact.email}</Link> : ''}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="form-group">
                                                            <label>Event Information</label>
                                                            <div className="field-text">{allLeadData && allLeadData.service_type && allLeadData.service_type.id ? allLeadData.service_type.name : ''}</div>
                                                            <div className="field-text">{allLeadData && allLeadData.when !== null ? allLeadData.when : ' TBD '}</div>
                                                            <div className="field-text">Location {allLeadData && allLeadData.location !== null ? allLeadData.location : ' TBD '}</div>
                                                            <div className="field-text">${allLeadData && allLeadData.potential_revenue !== null ? allLeadData.potential_revenue : ' - '} ({allLeadData.interest_level||'-'})</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="form-group">
                                                            <label>More information about {allLeadData && allLeadData.name} </label>
                                                            <div className="field-text">
                                                                <ShowMoreText
                                                                    lines={4}
                                                                    more='Show More'
                                                                    less='Show Less'
                                                                    keepNewLines={true}
                                                                >
                                                                {allLeadData.detail || '-'}
                                                                </ShowMoreText>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="leader--source">
                                                    Lead Source {leadSource==='-' ? '-' : (allLeadData.referred_by && allLeadData.referred_by.id ? <Link to={VIEW_CONTACT_BASE+allLeadData.referred_by.id}>{leadSource}</Link> : <a href="#leadSource" onClick={(e) => e.preventDefault()}>{leadSource}</a> ) }
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
                                                        <button type="button" onClick={(e) => showLeadNoteModal(e)} className="btn btn-secondary" data-toggle="modal" data-target="#addNewNote">Add Note</button>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-0">

                                                    <div className="table-responsive table-vertical-scroll" onScroll={(e) => noteScrollList(e)}>
                                                        <table className="table table-striped notes--table smart-table" >
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
                                                                                <a href="#deleteNote" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => deleteLeadNoteFunction(e, data.id)} className="close-icn">
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
                                                                                <h5>This lead doesn’t have any notes</h5>
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
                                                        <button type="button" onClick={(e) => showContactTaskModal(e)} className="btn btn-secondary ml-15">Add Task </button>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-0">

                                                    <div className="table-responsive table-vertical-scroll" onScroll={(e) => taskScrollList(e)}>
                                                            <table className="table table-striped tasks--table smart-table" >
                                                                <tbody>
                                                                    {(taskState.tasksList && taskState.tasksList.length > 0) ?
                                                                        _.map(taskState.tasksList, (data) => {
                                                                            return <tr key={data.id}>
                                                                            {data.status===0 ?
                                                                            <>
                                                                            {/* <td className="task--status">{checkDueTask(data) ? data.task_due_type : <span className="text-danger">Overdue</span>}</td> */}
                                                                            <td className="task--status"> <a href="#updateTask" onClick={(e) => showUpdateTaskData(e, data)}>{data.task_due_type==='Overdue' ? <span className="text-danger">{data.task_due_type}</span> : (data.task_due_type==='Due in 1 Day' ? 'Due Tomorrow' : data.task_due_type)}</a></td>
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
                                                                                        <a href="#deleteTask" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => deleteLeadTaskFunction(e, data.id)} className="close-icn">
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
                                                                                        <a href="#deleteTask" onClick={(e) => deleteLeadTaskFunction(e, data.id)} className="close-icn">
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
                                                                                    <h5>This lead doesn’t have any tasks</h5>
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
                        <button type="button" onClick={() => saveLeadNote()} className="btn btn-primary">{noteState.noteId ? 'Update' : 'Add'}</button>
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
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        {taskState.taskId ? 
                            <button type="button" className="btn btn-secondary " onClick={() => saveleadTask(1)}>Mark as Completed</button>
                            :    
                            <button type="button" className="btn btn-dark" onClick={() => setTaskModalShow(false)}>Cancel</button>
                        }
                        <button type="button" onClick={() => saveleadTask(0)} className="btn btn-primary">{taskState.taskId ? 'Save' : 'Add'}</button>
                    </Modal.Footer>
                </Modal>

                {/* Add Completed/Lost Modal*/}
                <Modal className="modal-medium" show={completedModalShow} onHide={() => closeCompletedModal()} centered backdrop="static" keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Won/Lost
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {completedModalServiceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{completedModalServiceMessage}</div> : ''}
                            <form>
                                <div className="row mb-3">
                                    <div className="form-group col-md-12">
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline3" onChange={() => setState({ ...state, type: '1' })} checked={state.type === '1' ? true : false} name="type" className="custom-control-input" value="1" />
                                            <label className="custom-control-label" htmlFor="customRadioInline3">Won</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline4" onChange={() => setState({ ...state, type: '0' })} checked={state.type === '0' ? true : false} name="type" className="custom-control-input" value="0" />
                                            <label className="custom-control-label" htmlFor="customRadioInline4">Lost</label>
                                        </div>
                                    </div>
                                </div>
                                {state.type === '1'
                                    ?
                                    <div className="form-inline mb-3">
                                        <div className={"d-flex form-group mb-2 " + state.amountCls}>
                                            <label htmlFor="inputPassword6" className="text-bold">Enter Amount*</label>
                                            <div className="cstinputusd">
                                                <input type="text" onChange={(e) => setState({ ...state, amount: e.target.value, amountErr: '', amountCls: '' })} value={state.amount} id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline" />
                                                {state.amountErr ? <span className="errorValidationMessage cstinputusdg-msg"> {state.amountErr}</span> : ''}
                                            </div>
                                            <strong>USD</strong>
                                        </div>
                                    </div>
                                    :
                                    <div className="form-group col-md-6">
                                        <div className={"floating-label " + state.selectReasonCls}>
                                            <Select
                                                styles={selectStyle}
                                                className="floating-select"
                                                placeholder="Lost Reason"
                                                components={{ MenuList: addExtraReason, NoOptionsMessage: () => null }}
                                                options={reasonState.reasonListOptions}
                                                value={state.selectReason}
                                                /* menuIsOpen={true} */
                                                onChange={(data) => setState({ ...state, selectReason: data, selectReasonCls: '', selectReasonErr: '' })}
                                            />
                                            {state.selectReasonErr ? <span className="errorValidationMessage"> {state.selectReasonErr}</span> : ''}
                                        </div>
                                    </div>
                                }
                                <div className="custom-control custom-checkbox mb-3">
                                    <input type="checkbox" className="custom-control-input" checked={state.followTask} onChange={(e) => setState({ ...state, followTask: e.target.checked })} id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Create a follow up task </label>
                                </div>
                                {state.followTask
                                    ?
                                    <>
                                        <div className={"floating-label " + state.taskNameCls}>
                                            <textarea
                                                className="floating-input floating-textarea"
                                                name="taskName"
                                                value={state.taskName || ''}
                                                onChange={(e) => setState({ ...state, taskName: e.target.value, taskNameCls: '', taskNameErr: '' })}
                                                placeholder="Task Name" rows="5"></textarea>
                                            <label>Task Name</label>
                                            {state.taskNameErr ? <span className="errorValidationMessage"> {state.taskNameErr}</span> : ''}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <div className={"floating-label " + state.taskDueTypeCls}>
                                                    <Select
                                                        styles={selectStyle}
                                                        className="floating-select"
                                                        components={makeAnimated()}
                                                        isSearchable={false}
                                                        value={state.taskDueTypeSelect}
                                                        defaultValue={state.taskDueTypeSelect}
                                                        options={taskDueTypeOption}
                                                        placeholder="Select"
                                                        onChange={data => setState({ ...state, taskDueType: data.value, taskDueTypeSelect: data })}
                                                    />
                                                    {state.taskDueTypeErr ? <span className="errorValidationMessage"> {state.taskDueTypeErr}</span> : ''}
                                                </div>
                                            </div>
                                            {state.taskDueType === "Custom" ? <div className="form-group col-md-4">
                                                <div className={"floating-label " + state.customDateCls}>
                                                    <DatePicker
                                                        type="text"
                                                        name="customDate"
                                                        className={state.customDateCls ? "floating-input " + state.customDateCls : "floating-input"}
                                                        placeholder="" selected={state.customDate}
                                                        onChange={(date) => dateForCustomLostLead(date)}
                                                        minDate={moment().toDate()}
                                                        placeholderText="Select a date"
                                                    />
                                                    {/* <label>Select a date</label> */}
                                                    {state.customDateErr ? <span className="errorValidationMessage"> {state.customDateErr}</span> : ''}
                                                </div>
                                            </div> : ''}
                                            <div className="form-group col-md-4">
                                                <div className={"floating-label " + state.taskTypeCls}>
                                                    <Select
                                                        styles={selectStyle}
                                                        className="floating-select"
                                                        components={makeAnimated()}
                                                        isSearchable={false}
                                                        value={state.taskTypeSelect}
                                                        defaultValue={state.taskTypeSelect}
                                                        options={taskTypeOption}
                                                        onChange={data => setState({ ...state, taskType: data.value, taskTypeSelect: data })}
                                                    />
                                                    {state.taskTypeErr ? <span className="errorValidationMessage"> {state.taskTypeErr}</span> : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    : ''
                                }
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => closeCompletedModal()}>Cancel</button>
                            <button type="button" onClick={() => markAsCompletedLost()} className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>

                    {/* Add Reason Modal*/}
                    <Modal show={reasonModalShow} onHide={() => setReasonModalShow(false)} className="" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Add Lost Reason
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {reasonOptionMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{reasonOptionMessage}</div> : ''}
                            <p className="p-small"><strong>Note:</strong> This lost reason will automatically be saved for future use. </p>
                            <form>
                                <div className={"floating-label " + reasonState.reasonCls}>
                                    <textarea className="floating-input floating-textarea" name="reason" value={reasonState.reason || ''} onChange={(e) => setReasonState({ ...reasonState, reason: e.target.value, reasonErr: '', reasonCls: '' })} placeholder="Type lost reason here"></textarea>
                                    <label>Lost Reason</label>
                                    {reasonState.reasonErr ? <span className="errorValidationMessage"> {reasonState.reasonErr}</span> : ''}
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setReasonModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => addReasonData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>
                    
                    {/* Add Quote Modal*/}
                    <QuoteAdd loader={(data) => setLoader(data)}  
                            openAddQuoteModal={addQuoteShow} 
                            leadId={leadId}
                            service_type_id = {allLeadData && allLeadData.service_type_id!==null ? allLeadData.service_type_id : ''}
                            leadName = {allLeadData && allLeadData.name ? allLeadData.name :''}
                            contactId= {allLeadData && allLeadData.contact && allLeadData.contact.id ? allLeadData.contact.id : ''}
                            closeAddQuoteModal={() =>setAddQuoteModalShow(false)}
                        />
            </main>
            <Footer />
        </div >
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

export const ViewLead = withRouter(ViewLeadPage)