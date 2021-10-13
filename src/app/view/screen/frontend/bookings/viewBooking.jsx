import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious, fieldValidator } from '../../../../common/custom';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import {
    getBookingById, deleteBooking, addBookingNote, listBookingNote, deleteBookingNote, updateBookingNote,
    listBookingTask, addBookingTask, deleteBookingTask, updateBookingTask
} from '../../../../duck/booking/booking.action';
import { Link, withRouter } from "react-router-dom";
import { LIST_BOOKINGS, EDIT_BOOKING_BASE, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import _ from 'lodash';
import ORANGE_ARROW from '../../../../assets/images/orange-arrow-left.svg'
import Swal from 'sweetalert2'
import Modal from "react-bootstrap/Modal";
import { validateInputs } from '../../../../common/validation';
import { constants, selectStyle } from '../../../../common/constants';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Loader } from '../../../component/frontend/loader/loader'
import ShowMoreText from 'react-show-more-text';
import { setImagePath } from '../../../../common/custom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export const NewViewBooking = props => {
    let bookingId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        bookingId = props.match.params.id
    }
    const textAreaRef = useRef();
    const textAreaTwoRef = useRef();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const getBookingByIdData = useSelector(state => state.booking.getBookingByIdData);
    const prevGetBookingByIdData = usePrevious({ getBookingByIdData });
    const deleteBookingData = useSelector(state => state.booking.deleteBookingData);
    const prevDeleteBookingData = usePrevious({ deleteBookingData });

    // Set initial State Value For View Detail
    const [leadSource, setLeadSource] = useState('-')
    const [state, setState] = useState({
        email: '', organization: '', phone: '', refferBy: '', firstName: '', lastName: '',
        correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT, duration: '',
        firstNameInformation: '', location: '', detail: '', start_Date: '', event_type: '', service_type: '',
        latLngUrl: '', name: '', contactId: '', virtualEvent: false, meetingId: '', passcode : ''
    });

    // Set The State Value Of Contact Note 
    const [noteModalShow, setNoteModalShow] = useState(false);
    const [noteServiceMessage, setNoteServiceMessage] = useState('');
    const [noteState, setNoteState] = useState({
        note: '', noteCls: '', noteErr: '', page: 1, limit: 10, totalNoteRecord: 0,
        notesList: [], noteId: '', hasMore: true
    });
    const addBookingNoteData = useSelector(state => state.booking.addBookingNoteData);
    const prevAddBookingNoteData = usePrevious({ addBookingNoteData });
    const listBookingNoteData = useSelector(state => state.booking.listBookingNoteData);
    const prevListBookingNoteData = usePrevious({ listBookingNoteData });
    const deleteBookingNoteData = useSelector(state => state.booking.deleteBookingNoteData);
    const prevDeleteBookingNoteData = usePrevious({ deleteBookingNoteData });

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
        tasksList: [], taskId: '', hasMore: true, taskTypeSelect: { value: 'To-do', label: 'To-do' }, associateLeadSelect: '', associateLeadSelectValue: ''
    });

    const listBookingTaskData = useSelector(state => state.booking.listBookingTaskData);
    const prevListBookingTaskData = usePrevious({ listBookingTaskData });
    const addBookingTaskData = useSelector(state => state.booking.addBookingTaskData);
    const prevAddBookingTaskData = usePrevious({ addBookingTaskData });
    const deleteBookingTaskData = useSelector(state => state.booking.deleteBookingTaskData);
    const prevDeleteBookingTaskData = usePrevious({ deleteBookingTaskData });


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
            setTaskState({
                ...taskState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName,
                customDate: '', customDateErr: '', customDateCls: ''
            });
        } else {
            setTaskState({ ...taskState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        }
        setTaskServiceMessage('');
    }

    // On Load Get Contact
    useEffect(() => {
        setLoader(true)
        dispatch(getBookingById({ id: bookingId }))
        dispatch(listBookingNote({ booking_id: bookingId, limit: noteState.limit, page: noteState.page }))
        dispatch(listBookingTask({ booking_id: bookingId, limit: taskState.limit, page: taskState.page, status: taskFilter }))
    }, [bookingId]); // eslint-disable-line react-hooks/exhaustive-deps

    // List Contact Data and Note Data 
    useEffect(() => {
        if (prevGetBookingByIdData && prevGetBookingByIdData.getBookingByIdData !== getBookingByIdData) {
            if (getBookingByIdData && _.has(getBookingByIdData, 'data') && getBookingByIdData.success === true) {
                setLoader(false)
                if (getBookingByIdData.data && getBookingByIdData.data.id) {
                    let leadSource = '-';
                    if (getBookingByIdData.data && getBookingByIdData.data.website !== null) {
                        leadSource = getBookingByIdData.data.website
                    }
                    if (getBookingByIdData.data && getBookingByIdData.data.source_type && getBookingByIdData.data.source_type.id) {
                        leadSource = getBookingByIdData.data.source_type.name
                    }
                    if (getBookingByIdData.data && getBookingByIdData.data.referred_by && getBookingByIdData.data.referred_by.id) {
                        leadSource = getBookingByIdData.data.referred_by.first_name + ' ' + (getBookingByIdData.data.referred_by && getBookingByIdData.data.referred_by.last_name !== null ? getBookingByIdData.data.referred_by.last_name : '')
                    }
                    setLeadSource(leadSource)
                    let latLngUrl = '';
                    if (getBookingByIdData.data.lat_long && getBookingByIdData.data.lat_long !== null) {
                        let placeData = JSON.parse(getBookingByIdData.data.lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setState({
                        ...state, email: getBookingByIdData.data.contact.email ? getBookingByIdData.data.contact.email : '', organization: getBookingByIdData.data.organization,
                        name: getBookingByIdData.data.name ? getBookingByIdData.data.name : '',
                        firstName: getBookingByIdData.data.contact.first_name ? getBookingByIdData.data.contact.first_name : '', lastName: getBookingByIdData.data.contact.last_name ? getBookingByIdData.data.contact.last_name : '',
                        latLngUrl: latLngUrl,
                        refferBy: (getBookingByIdData.data && getBookingByIdData.data.referred_by !== null ? { value: getBookingByIdData.data.referred_by.id, label: getBookingByIdData.data.referred_by.first_name + ' ' + (getBookingByIdData.data.referred_by && getBookingByIdData.data.referred_by.last_name ? getBookingByIdData.data.referred_by.last_name : '') } : ''),
                        firstNameInformation: getBookingByIdData.data.first_name_information, location: getBookingByIdData.data.location ? getBookingByIdData.data.location : '', detail: getBookingByIdData.data.detail ? getBookingByIdData.data.detail : '',
                        phone: getBookingByIdData.data.contact.phone ? getBookingByIdData.data.contact.phone : '', 
                        start_Date: getBookingByIdData.data && getBookingByIdData.data.start_date ? getBookingByIdData.data.start_date : '', amount: getBookingByIdData.data.amount ? getBookingByIdData.data.amount : '', received_amount: getBookingByIdData.data.received_amount ? getBookingByIdData.data.received_amount : '', event_type: getBookingByIdData.data.event_type,
                        virtualEvent: getBookingByIdData.data.virtual_event === 0 ? false : true,
                        meetingId: getBookingByIdData.data.meeting_id !== null ? getBookingByIdData.data.meeting_id : '',
                        passcode: getBookingByIdData.data.passcode !== null ? getBookingByIdData.data.passcode : '',
                        service_type: getBookingByIdData.data && getBookingByIdData.data.service_type && getBookingByIdData.data.service_type.id ? getBookingByIdData.data.service_type.name : '', duration: getBookingByIdData.data ? getBookingByIdData.data.duration : '', contactId: getBookingByIdData.data.contact.id ? getBookingByIdData.data.contact.id : '',
                    })
                } else {
                    props.history.push(LIST_BOOKINGS)
                }
            }
            if (getBookingByIdData && _.has(getBookingByIdData, 'message') && getBookingByIdData.success === false) {
                setLoader(false)
            }
        }
        if (prevListBookingNoteData && prevListBookingNoteData.listBookingNoteData !== listBookingNoteData) {
            if (listBookingNoteData && _.has(listBookingNoteData, 'data') && listBookingNoteData.success === true) {
                setLoader(false)
                let mergeNote = noteState.notesList.concat(listBookingNoteData.data)
                if (mergeNote.length === listBookingNoteData.total) {
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listBookingNoteData.total, hasMore: false })
                } else {
                    setNoteState({ ...noteState, notesList: mergeNote, totalNoteRecord: listBookingNoteData.total, hasMore: true })
                }
            }
            if (listBookingNoteData && _.has(listBookingNoteData, 'message') && listBookingNoteData.success === false) {
                setLoader(false)
                setNoteModalShow(false)
            }
        }
        if (prevListBookingTaskData && prevListBookingTaskData.listBookingTaskData !== listBookingTaskData) {
            if (listBookingTaskData && _.has(listBookingTaskData, 'data') && listBookingTaskData.success === true) {
                setLoader(false)
                let mergeTask = taskState.tasksList.concat(listBookingTaskData.data)
                if (mergeTask.length === listBookingTaskData.total) {
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listBookingTaskData.total, hasMore: false })
                } else {
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listBookingTaskData.total, hasMore: true })
                }

            }
            if (listBookingTaskData && _.has(listBookingTaskData, 'message') && listBookingTaskData.success === false) {
                setLoader(false)
                setTaskModalShow(false)
            }
        }
    }, [getBookingByIdData, prevGetBookingByIdData, listBookingNoteData, prevListBookingNoteData, prevListBookingTaskData, listBookingTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Delete Contact Data 
    const deleteContactFunction = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'If you delete the booking, all associated Notes, Tasks and references will be lost. Are you sure you want to delete the booking?',
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
                dispatch(deleteBooking({ booking_id: bookingId }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Data Props
    useEffect(() => {
        if (prevDeleteBookingData && prevDeleteBookingData.deleteBookingData !== deleteBookingData) {
            if (deleteBookingData && _.has(deleteBookingData, 'data') && deleteBookingData.success === true) {
                setLoader(false)
                props.history.push(LIST_BOOKINGS)
            }
            if (deleteBookingData && _.has(deleteBookingData, 'message') && deleteBookingData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteBookingData, prevDeleteBookingData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Add Contact Note
    const showContactNoteModal = (e) => {
        e.currentTarget.blur();
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
                dispatch(updateBookingNote({ booking_id: bookingId, detail: note, id: noteState.noteId }));
            } else {
                dispatch(addBookingNote({ booking_id: bookingId, detail: note }));
            }
        }
    }

    // After Add Contact Note Data
    useEffect(() => {
        if (prevAddBookingNoteData && prevAddBookingNoteData.addBookingNoteData !== addBookingNoteData) {
            if (addBookingNoteData && _.has(addBookingNoteData, 'data') && addBookingNoteData.success === true) {
                setNoteModalShow(false)
                setLoader(false)
                if (addBookingNoteData.data && addBookingNoteData.data.id) {
                    let existNoteList = noteState.notesList;
                    let index = _.findIndex(existNoteList, { id: addBookingNoteData.data.id });
                    existNoteList.splice(index, 1, addBookingNoteData.data);

                } else {
                    setNoteState({ ...noteState, page: 1, notesList: [] })
                    dispatch(listBookingNote({ booking_id: bookingId, limit: noteState.limit, page: 1 }))
                }
            }
            if (addBookingNoteData && _.has(addBookingNoteData, 'message') && addBookingNoteData.success === false) {
                setLoader(false)
                setNoteServiceMessage(addBookingNoteData.message)
            }
        }
    }, [addBookingNoteData, prevAddBookingNoteData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Note Data  By Pagination
    const getNotePageData = () => {
        let page = (noteState.page) + 1
        setNoteState({ ...noteState, page: page })
        dispatch(listBookingNote({ booking_id: bookingId, limit: noteState.limit, page: page }))
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
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteBookingNote({ booking_id: bookingId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Note Data Props
    useEffect(() => {
        if (prevDeleteBookingNoteData && prevDeleteBookingNoteData.deleteBookingNoteData !== deleteBookingNoteData) {
            if (deleteBookingNoteData && _.has(deleteBookingNoteData, 'data') && deleteBookingNoteData.success === true) {
                setNoteState({ ...noteState, page: 1, notesList: [] })
                dispatch(listBookingNote({ booking_id: bookingId, limit: noteState.limit, page: 1 }))
            }
            if (deleteBookingNoteData && _.has(deleteBookingNoteData, 'message') && deleteBookingNoteData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteBookingNoteData, prevDeleteBookingNoteData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Updated Note Data 
    const showUpdateNoteData = (e, id, detail) => {
        e.preventDefault();
        setNoteState({ ...noteState, noteId: id, note: detail })
        setNoteModalShow(true)
    }

    // Show Contact Task
    const showContactTaskModal = (e) => {
        e.currentTarget.blur();
        setTaskModalShow(true);
        setTaskServiceMessage('');
        setTaskState({
            ...taskState, taskName: '', taskNameCls: '', taskNameErr: '',
            taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: 'To-do', label: 'To-do' },
            taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
            customDate: new Date(), customDateErr: '', customDateCls: '', taskId: '', associateLeadSelect: '', associateLeadSelectValue: ''
        })
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
                if (taskState.taskId) {
                    let taskData = {
                        booking_id: bookingId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                        id: taskState.taskId
                    }
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    if (status === 1) {
                        taskData.status = 1
                    }
                    dispatch(updateBookingTask(taskData));

                } else {
                    let taskData = {
                        booking_id: bookingId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                    };
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    dispatch(addBookingTask(taskData));
                }

            }
        } else {
            if (getError === false && taskNameErr === '' && taskTypeErr === '' && taskDueTypeErr === '') {
                setLoader(true)
                if (taskState.taskId) {
                    let taskData = {
                        booking_id: bookingId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        id: taskState.taskId
                    }
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    if (status === 1) {
                        taskData.status = 1
                    }
                    dispatch(updateBookingTask(taskData));

                } else {
                    let taskData = {
                        booking_id: bookingId,
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType
                    };
                    if (taskState.associateLeadSelectValue && taskState.associateLeadSelectValue.id) {
                        taskData.refer_to = taskState.associateLeadSelectValue.id
                    }
                    dispatch(addBookingTask(taskData));
                }

            }
        }
        //
    }

    // After Add Contact Task Data
    useEffect(() => {
        if (prevAddBookingTaskData && prevAddBookingTaskData.addBookingTaskData !== addBookingTaskData) {
            if (addBookingTaskData && _.has(addBookingTaskData, 'data') && addBookingTaskData.success === true) {
                setTaskModalShow(false)
                if (taskState.taskId !== '') {

                    let existTaskList = taskState.tasksList;
                    if (taskFilter === 0 && addBookingTaskData.data.status === 1) {
                        _.remove(existTaskList, function (task) {
                            return task.id === addBookingTaskData.data.id
                        });
                    } else {
                        let index = _.findIndex(existTaskList, { id: addBookingTaskData.data.id });
                        existTaskList.splice(index, 1, addBookingTaskData.data);
                    }
                    setLoader(false)
                } else {
                    setTaskState({ ...taskState, page: 1, tasksList: [] })
                    let condition;
                    if (taskFilter === 0 || taskFilter === 1) {
                        condition = { booking_id: bookingId, limit: taskState.limit, page: 1, status: taskFilter }
                    } else {
                        condition = { booking_id: bookingId, limit: taskState.limit, page: 1 }
                    }
                    dispatch(listBookingTask(condition))
                }
            }
            if (addBookingTaskData && _.has(addBookingTaskData, 'message') && addBookingTaskData.success === false) {
                setLoader(false)
                setTaskServiceMessage(addBookingTaskData.message)
            }
        }
    }, [addBookingTaskData, prevAddBookingTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Task Data  By Pagination
    const getTaskPageData = () => {
        let page = (taskState.page) + 1
        setTaskState({ ...taskState, page: page })
        let condition;
        if (taskFilter) {
            condition = { booking_id: bookingId, limit: taskState.limit, page: page, status: taskFilter }
        } else {
            condition = { booking_id: bookingId, limit: taskState.limit, page: page }
        }
        dispatch(listBookingTask(condition))
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
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deleteBookingTask({ booking_id: bookingId, id: id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Get Delete Contact Task Data Props
    useEffect(() => {
        if (prevDeleteBookingTaskData && prevDeleteBookingTaskData.deleteBookingTaskData !== deleteBookingTaskData) {
            if (deleteBookingTaskData && _.has(deleteBookingTaskData, 'data') && deleteBookingTaskData.success === true) {
                let condition;
                setTaskState({ ...taskState, page: 1, tasksList: [] })
                if (taskFilter) {
                    condition = { booking_id: bookingId, limit: taskState.limit, page: 1, status: taskFilter }
                } else {
                    condition = { booking_id: bookingId, limit: taskState.limit, page: 1 }
                }
                dispatch(listBookingTask(condition))
            }
            if (deleteBookingTaskData && _.has(deleteBookingTaskData, 'message') && deleteBookingTaskData.success === false) {
                setLoader(false)
            }
        }
    }, [deleteBookingTaskData, prevDeleteBookingTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Updated Task Data 
    const showUpdateTaskData = (e, data) => {
        e.preventDefault();
        let arr = ["Due in 1 Day", "Due in 3 Days", "Due in 1 Week", "Due in 1 Month", "Custom", "No due date"];
        if (_.includes(arr, data.task_due_type)) {
            setTaskState({
                ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
                taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
                taskDueType: data.task_due_type, taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: data.task_due_type, label: data.task_due_type },
                customDate: data.custom_date !== null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
                associateLeadSelectValue: (data && data.refer_to !== null ? data.refer_to : '')
            })
        } else {
            setTaskState({
                ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
                taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
                taskDueType: 'Custom', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Custom', label: 'Custom' },
                customDate: data.custom_date !== null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
                associateLeadSelectValue: (data && data.refer_to !== null ? data.refer_to : '')
            })
        }
        setTaskModalShow(true)
    }

    // On Change Task Filter 
    const onChangeTaskFilter = (data) => {
        setTaskFilterSelect(data)
        setTaskFilter(data.value)
        setTaskState({ ...taskState, page: 1, tasksList: [] })
        let condition;
        if (data.value) {
            condition = { booking_id: bookingId, limit: taskState.limit, page: 1, status: data.value }
        } else {
            condition = { booking_id: bookingId, limit: taskState.limit, page: 1 }
        }
        dispatch(listBookingTask(condition))
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

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header">
                <Header getMainRoute={"bookings"} />
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"><Link to={LIST_BOOKINGS}>Bookings</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">{state.name}</li>
                                        </ol>
                                        {/* <h2 className="title"><Link to={LIST_BOOKINGS} className="d-lg-none mr-2"><img src={setImagePath(ORANGE_ARROW)} alt="" /></Link> {state.service_type}</h2><div>{"(" + state.event_type + ")"}</div> */}
                                        <h2 className="title"><Link to={LIST_BOOKINGS} className="d-lg-none mr-2" ><img src={setImagePath(ORANGE_ARROW)} alt="" /></Link><span className="title--text"> {state.name}</span> <small className="font-small">{"(" + state.event_type + ")"}</small></h2>
                                    </div>
                                    {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                        <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={setImagePath(MENU_DOTTED)} alt="" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                            <Link to={ADD_BOOKING} className="dropdown-item" >Create Booking</Link>
                                            <Link to={ADD_LEAD} className="dropdown-item" >Create Lead</Link>
                                            <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                            <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button type="button" onClick={(e) => deleteContactFunction(e)} className="btn btn-danger mr-15">Delete</button>
                                    <Link to={EDIT_BOOKING_BASE + bookingId} className="btn btn-secondary d-lg-none">Edit</Link>
                                    {/* <div className="dropdown custom-dropdown d-none d-lg-block mr-15">
                                        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Actions
                                    </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                            <Link to={ADD_BOOKING} className="dropdown-item">Create Booking</Link>
                                            <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Lead</a>
                                            <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Quote</a>
                                            <a className="dropdown-item" href="#google" onClick={(e) => e.preventDefault()}>Create Invoice</a>
                                        </div>
                                    </div> */}
                                    {/* <Link to={ADD_BOOKING} className="btn btn-secondary mr-15 d-none d-lg-block">Create Booking </Link> */}
                                    <Link to={LIST_BOOKINGS} className="btn btn-primary d-none d-lg-block">Back</Link>
                                    {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                        <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={setImagePath(MENU_DOTTED)} alt="" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                            <Link to={ADD_BOOKING} className="dropdown-item">Create Booking</Link>
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
                        {state.start_Date!=='' && (moment().diff(state.start_Date, 'days') > 0) ?
                            <div className="row no-gutters-mbl">
                                <div className="col-12"> 
                                    <div className="notify-completed d-inline-block w-100">Completed</div>
                                </div>
                            </div>
                        : ''}

                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <div className="card">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Booking Details</h2>
                                                <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                    <Link to={EDIT_BOOKING_BASE + bookingId} className="btn btn-secondary d-none d-lg-block">Edit</Link>
                                                </div>
                                            </div>
                                            <div className="card-body pt-1">
                                                <div className="contact-detail--wrap">
                                                    <div className="row no-gutters-mbl">
                                                        <div className="col-xl-3 col-lg-4">
                                                            <div className="form-group">
                                                                <label>Customer</label>
                                                                <div className="field-text">
                                                                    {state.firstName + ' ' + state.lastName}</div>
                                                                <div className="field-text">
                                                                    {state.phone}</div>
                                                                {/* <div className="field-text">
                                                                    {state.email}</div> */}
                                                                <div className="field-text">{bookingId ? <Link to={VIEW_CONTACT_BASE + state.contactId}>{state.email}</Link> : ''}</div>
                                                            </div>

                                                        </div>
                                                        <div className="col-xl-9 col-lg-8">
                                                            <div className="row no-gutters-mbl">
                                                                <div className="col-xl-4 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>Date</label>
                                                                        {/* <div className="field-text">{moment(state.start_date).format('ddd, MMM DD YYYY')} </div> */}
                                                                        <div className="field-text">{moment(state.start_Date).format('ddd, MMM DD YYYY')}  </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>Start Time (Duration)</label>
                                                                        <div ><strong>{moment(state.start_Date).format('HH:mm') !== '00:00' ?moment(state.start_Date).format("LT") + ' PST' : 'TBD'}</strong>{' '}{"(" + state.duration ?  'state.duration' : 'TBD'+ ")"} </div>
                                                                    </div>
                                                                </div> 
                                                                <div className="col-xl-4 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>Total (Advance)</label>
                                                                        <div  ><strong>{state.amount !== "" ? "$" + state.amount : ''}</strong>{' '}<span >{state.received_amount !== "" ? "($" + state.received_amount + ")" : ''}</span> </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-xl-4 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>Location</label>
                                                                        {state.virtualEvent ?
                                                                            <div className="field-text">
                                                                            <a href={/^https?:\/\//.test(state.location) ? `${state.location}` : `//${state.location}`} rel="noopener noreferrer" target="_blank" className="text-link">{state.location}</a>
                                                                            <p> {state.meetingId!==null ? state.meetingId : 'N/A'} <span className="font-weight-normal">(Meeting Id)</span> <br /> {state.passcode!==null ? state.passcode : 'N/A'} <span className="font-weight-normal">(Passcode)</span></p>
                                                                            </div>
                                                                        :
                                                                            <div className="field-text">{state.location || 'TBD'}
                                                                                {state.latLngUrl !== '' ?
                                                                                    <a href={"https://www.google.com/maps/search/?api=1&query=" + state.latLngUrl} rel="noopener noreferrer" target="_blank" className="text-link ml-1">(Map)</a>

                                                                                    : ''}
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-8 col-lg-6">
                                                                    <div className="form-group">
                                                                        <label>More information about {state.name}</label>
                                                                        <div className="field-text">{state.detail || '-'} </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="leader--source">
                                                    Lead Source {leadSource === '-' ? '-' : (state.refferBy && state.refferBy.value ? <Link to={VIEW_CONTACT_BASE + state.refferBy.value}>{leadSource}</Link> : <a href="#leadSource" onClick={(e) => e.preventDefault()}>{leadSource}</a>)}
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
                                                                                <td><a href="#updateNote" onClick={(e) => showUpdateNoteData(e, data.id, data.detail)} >{moment(data.created_at).format("ll")}</a></td>
                                                                                <td>
                                                                                    <ShowMoreText
                                                                                        lines={4}
                                                                                        more='Show More'
                                                                                        less='Show Less'
                                                                                        anchorClass=''
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
                                                                                    <h5>This booking doesn’t have any notes</h5>
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
                                                                                {data.status === 0 ?
                                                                                    <>
                                                                                        {/* <td className="task--status">{checkDueTask(data) ? data.task_due_type : <span className="text-danger">Overdue</span>}</td> */}
                                                                                        <td className="task--status"><a href="#updateTask" onClick={(e) => showUpdateTaskData(e, data)} >{data.task_due_type === 'Overdue' ? <span className="text-danger">{data.task_due_type}</span> : (data.task_due_type === 'Due in 1 Day' ? 'Due Tomorrow' : data.task_due_type)}</a></td>
                                                                                        <td className="task--todo">{data.task_type}</td>
                                                                                        <td className="task--subject">
                                                                                            <ShowMoreText
                                                                                                lines={4}
                                                                                                more='Show More'
                                                                                                less='Show Less'
                                                                                                anchorClass=''
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
                                                                                    <h5>This booking doesn’t have any tasks</h5>
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
                                                onChange={data => setTaskState({ ...taskState, taskDueType: data.value, taskDueTypeSelect: data })}
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
                                                onChange={data => setTaskState({ ...taskState, taskType: data.value, taskTypeSelect: data })}
                                            />
                                            {taskState.taskTypeErr ? <span className="errorValidationMessage"> {taskState.taskTypeErr}</span> : ''}
                                        </div>
                                    </div>
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
        </>
    );
}

export const ViewBooking = withRouter(NewViewBooking)