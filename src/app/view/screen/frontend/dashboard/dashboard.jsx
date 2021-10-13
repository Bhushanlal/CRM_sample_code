import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import RIGHT_ARROW from '../../../../assets/images/dashboard-right-arrow.svg'
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import { setImagePath, fieldValidator, usePrevious } from '../../../../common/custom'
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { constants, selectStyle, dashboardSelectStyle } from '../../../../common/constants';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { validateInputs } from '../../../../common/validation';
import _ from "lodash";
import { addDashboardTask, updateDashboardTask, listDashboardTask, deleteDashboardTask, getBusinessSnapshot, listDashboardNotification, deleteDashboardNotification, deleteAllNotification, markAsReadNotification } from '../../../../duck/dashboard/dashboard.action';
import { Loader } from '../../../component/frontend/loader/loader'
import ShowMoreText from 'react-show-more-text';
import Swal from 'sweetalert2'
import { ADD_LEAD, ADD_CONTACT, VIEW_CONTACT_BASE, VIEW_LEAD_BASE, VIEW_BOOKING_BASE, ADD_BASIC_QUOTE, ADD_INVOICE_BASE} from "../../../../routing/routeContants";
import { Link, withRouter } from "react-router-dom";
import { errorPopUp } from '../../../../common/notification-alert';
import { Welcome } from './welcome'
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const NewDashboard = props => {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const textAreaTwoRef = useRef();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [isCollapse, setIsCollapse] = useState('');
    const [welcomeModal, setWelcomeModal] = useState(false);
    const [businessSnapshotData, setBusinessSnapshotData] = useState({});
    const snapshotOptions = [{ value: '30', label: 'Last 30 Days' }, { value: '60', label: 'Last 60 Days' }, { value: '180', label: 'Last 180 Days' }]; 
    const [dashboardSanpSelect, setDashboardSanpSelect] = useState({value: '30', label: 'Last 30 Days'});
    const getBusinessSnapshotData = useSelector(state => state.dashboard.getBusinessSnapshotData);
    const prevGetBusinessSnapshotData = usePrevious({ getBusinessSnapshotData });

     // Set The State Value Of Task 
     const [fetchTaskList, setfetchTaskList] = useState(true);
     const taskDueTypeOption = [{ value: 'Due in 1 Day', label: 'Due in 1 Day' }, { value: 'Due in 3 Days', label: 'Due in 3 Days' }, { value: 'Due in 1 Week', label: 'Due in 1 Week' }, { value: 'Due in 1 Month', label: 'Due in 1 Month' }, { value: 'Custom', label: 'Custom' }, { value: 'No due date', label: 'No due date' }]; 
     const taskTypeOption = [{ value: 'To-do', label: 'To-do' }, { value: 'Follow up', label: 'Follow up' }]; 
     const taskViewOptions = [{ value: '', label: 'All' }, { value: 0, label: 'Open' }, { value: 1, label: 'Closed' }];
     const [taskModalShow, setTaskModalShow] = useState(false);
     const [taskFilter, setTaskFilter] = useState(0);
     const [totalTask, setTotalTask] = useState(0);
     const [taskFilterSelect, setTaskFilterSelect] = useState({ value: 0, label: 'Open' });
     const [taskServiceMessage, setTaskServiceMessage] = useState('');
     const [sortingOrder, setSortingOrder] = useState('ASC');
     const [sortingField, setSortingField] = useState('custom_date');
     const [taskState, setTaskState] = useState({
         taskName: '', taskNameCls: '', taskNameErr: '',
         taskType: 'To-do', taskTypeErr: '', taskTypeCls: '',
         taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
         customDate: new Date(), customDateErr: '', customDateCls: '',
         page: 1, limit: 10, totalTaskRecord: 0, taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
         tasksList: [], taskId: '', hasMore: true, taskTypeSelect: { value: 'To-do', label: 'To-do' },
         associateLeadSelect: '', associateLeadSelectValue: '', contact_id:'', lead_id:'', user_id:'', booking_id:''
     });
     const listDashboardTaskData = useSelector(state => state.dashboard.listDashboardTaskData);
     const prevListDashboardTaskData = usePrevious({ listDashboardTaskData });
     const addDashboardTaskData = useSelector(state => state.dashboard.addDashboardTaskData);
     const prevAddDashboardTaskData = usePrevious({ addDashboardTaskData });
     const deleteDashboardTaskData = useSelector(state => state.dashboard.deleteDashboardTaskData);
     const prevDeleteDashboardTaskData = usePrevious({ deleteDashboardTaskData });

     // Set the State Value of Notification
     const [totalNotification, setTotalNotification] = useState(0);
     const [notificationState, setNotificationState] = useState({
         page: 1, limit: 10, notificationList: [], hasMore: true,
     })
     const listDashboardNotificationData = useSelector(state => state.dashboard.listDashboardNotificationData);
     const prevListDashboardNotificationData = usePrevious({ listDashboardNotificationData });
     const deleteDashboardNotificationData = useSelector(state => state.dashboard.deleteDashboardNotificationData);
     const prevDeleteDashboardNotificationData = usePrevious({ deleteDashboardNotificationData });
     const deleteAllNotificationData = useSelector(state => state.dashboard.deleteAllNotificationData);
     const prevDeleteAllNotificationData = usePrevious({ deleteAllNotificationData });
     const markAsReadNotificationData = useSelector(state => state.dashboard.markAsReadNotificationData);
     const prevMarkAsReadNotificationData = usePrevious({ markAsReadNotificationData });


    // On Load Get Data
    useEffect(() => {
        if(userData.welcome===0){
            setWelcomeModal(true)
        }
        setLoader(true)
        dispatch(listDashboardTask({ limit: taskState.limit, page: taskState.page, status: taskFilter, sortingField, sortingOrder }))
        dispatch(listDashboardNotification({ limit: notificationState.limit, page: notificationState.page, }))
        dispatch(getBusinessSnapshot({ days: dashboardSanpSelect.value }))
        const interval = setInterval(() => {
            setNotificationState({...notificationState, notificationList: []})
            dispatch(listDashboardNotification({ limit: notificationState.limit, page: notificationState.page, }))
          }, 60000 );
        
          return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Set Mobile View
    useEffect(() => {
        const resizeListener = () => {
            // change width from the state object
            if (window.innerWidth < 991) {
                setIsCollapse('collapse')
            } else {
                setIsCollapse('')
            }
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);
        resizeListener();
        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }

    }, [])

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
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

    // set date for custom 
    const dateForCustom = (date) => {
        if (date === null) {
            setTaskState({ ...taskState, customDate: '', customDateCls: constants.wrongInput, customDateErr: 'Please select custom date' })
        } else {
            setTaskState({ ...taskState, customDate: date, customDateCls: '', customDateErr: '' })
        }
        setTaskServiceMessage('');
    }

    // List Business Snapshot Data 
    useEffect(() => {
        if (prevGetBusinessSnapshotData && prevGetBusinessSnapshotData.getBusinessSnapshotData !== getBusinessSnapshotData) {
            if (getBusinessSnapshotData && _.has(getBusinessSnapshotData, 'data') && getBusinessSnapshotData.success === true) {
                setLoader(false)
                setBusinessSnapshotData(getBusinessSnapshotData.data)
            }
            if (getBusinessSnapshotData && _.has(getBusinessSnapshotData, 'message') && getBusinessSnapshotData.success === false) {
                setLoader(false)
                setTaskModalShow(false)
                errorPopUp(listDashboardTaskData.message)
            }
        }

    }, [prevGetBusinessSnapshotData, getBusinessSnapshotData ]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Dashboard Task
    const showDashboardTaskModal = (e) => {
        e.currentTarget.blur();
        setTaskModalShow(true);
        setTaskServiceMessage('');
        setTaskState({ ...taskState, taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: 'To-do', label: 'To-do' },
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        customDate: new Date(), customDateErr: '', customDateCls: '', taskId: '', contact_id:'', lead_id:'', user_id:'', booking_id:'' })
        setTimeout(function () { textAreaTwoRef.current.focus(); }, 300);
    }

      // Save Dashboard Task 
      const saveDashboardTask = (status) => {
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
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        custom_date: moment(customDate).format('YYYY-MM-DD'),
                        id: taskState.taskId,
                        contact_id:taskState.contact_id, 
                        lead_id:taskState.lead_id, 
                        user_id:taskState.user_id, 
                        booking_id:taskState.booking_id
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateDashboardTask(taskData));

                }else{
                    dispatch(addDashboardTask({
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
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType,
                        id: taskState.taskId,
                        contact_id:taskState.contact_id, 
                        lead_id:taskState.lead_id, 
                        user_id:taskState.user_id, 
                        booking_id:taskState.booking_id
                    }
                    if(status===1){
                        taskData.status=1
                    }
                    dispatch(updateDashboardTask(taskData));

                }else{
                    dispatch(addDashboardTask({
                        detail: taskName,
                        task_due_type: taskDueType,
                        task_type: taskType
                    }));
                }
              
            }
        }
    }

     // List Task Data 
     useEffect(() => {
        if (prevListDashboardTaskData && prevListDashboardTaskData.listDashboardTaskData !== listDashboardTaskData) {
            if (listDashboardTaskData && _.has(listDashboardTaskData, 'data') && listDashboardTaskData.success === true) {
                let mergeTask = taskState.tasksList.concat(listDashboardTaskData.data)
                if(mergeTask.length === listDashboardTaskData.total){
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listDashboardTaskData.total, hasMore: false })
                }else{
                    setTaskState({ ...taskState, tasksList: mergeTask, totalTaskRecord: listDashboardTaskData.total, hasMore: true })
                }
                setTotalTask(listDashboardTaskData && listDashboardTaskData.total)
                setfetchTaskList(false);
                setLoader(false)
            }
            if (listDashboardTaskData && _.has(listDashboardTaskData, 'message') && listDashboardTaskData.success === false) {
                setTaskModalShow(false)
                setfetchTaskList(false);
                setLoader(false)
                errorPopUp(listDashboardTaskData.message)
            }
        }
        if (prevAddDashboardTaskData && prevAddDashboardTaskData.addDashboardTaskData !== addDashboardTaskData) {
            if (addDashboardTaskData && _.has(addDashboardTaskData, 'data') && addDashboardTaskData.success === true) {
                setTaskModalShow(false)
                if(addDashboardTaskData.data && addDashboardTaskData.data.id){
                    let existTaskList = taskState.tasksList;
                    if(taskFilter ===0 &&  addDashboardTaskData.data.status===1){
                        _.remove(existTaskList, function (task) {
                            return task.id === addDashboardTaskData.data.id
                        });
                    }else{
                        let index = _.findIndex(existTaskList, {id: addDashboardTaskData.data.id});
                        existTaskList.splice(index, 1, addDashboardTaskData.data);
                    }
                    setLoader(false)
                }else{
                    setTaskState({...taskState, page:1, tasksList:[]})
                    let condition;
                    if(taskFilter===0 || taskFilter===1){
                        condition = { limit: taskState.limit, page: 1, status: taskFilter, sortingField, sortingOrder }
                    }else{
                        condition = { limit: taskState.limit, page: 1, sortingField, sortingOrder }
                    }
                    setfetchTaskList(true)
                    dispatch(listDashboardTask(condition))
                }
            }
            if (addDashboardTaskData && _.has(addDashboardTaskData, 'message') && addDashboardTaskData.success === false) {
                setLoader(false)
                setTaskServiceMessage(addDashboardTaskData.message)
            }
        }

        if (prevDeleteDashboardTaskData && prevDeleteDashboardTaskData.deleteDashboardTaskData !== deleteDashboardTaskData) {
            if (deleteDashboardTaskData && _.has(deleteDashboardTaskData, 'data') && deleteDashboardTaskData.success === true) {
                let condition;
                setTaskState({...taskState, page:1, tasksList:[]})
                if(taskFilter===0 || taskFilter===1){
                    condition = { limit: taskState.limit, page: 1, status: taskFilter, sortingField, sortingOrder }
                }else{
                    condition = { limit: taskState.limit, page: 1, sortingField, sortingOrder}
                }
                setfetchTaskList(true)
                dispatch(listDashboardTask(condition))
            }
            if (deleteDashboardTaskData && _.has(deleteDashboardTaskData, 'message') && deleteDashboardTaskData.success === false) {
                setLoader(false)
            }
        }

    }, [listDashboardTaskData, prevListDashboardTaskData, prevAddDashboardTaskData, addDashboardTaskData, prevDeleteDashboardTaskData, deleteDashboardTaskData]);// eslint-disable-line react-hooks/exhaustive-deps

    // On Change Task Filter 
    const onChangeTaskFilter = (data) => {
        setTaskFilterSelect(data)
        setTaskFilter(data.value)
        setTaskState({...taskState, page:1, tasksList:[]})
        let condition;
        if(data.value===0 || data.value===1){
            condition = { limit: taskState.limit, page: 1, status: data.value, sortingField, sortingOrder }
        }else{
            condition = { limit: taskState.limit, page: 1, sortingField, sortingOrder }
        }
        setfetchTaskList(true)
        dispatch(listDashboardTask(condition))
    }

    // Check Scroll Task
    const taskScrollList = (e) => {
        const bottom = e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight;
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
            condition = { limit: taskState.limit, page: page, status: taskFilter, sortingField, sortingOrder }
        }else{
            condition = { limit: taskState.limit, page: page, sortingField, sortingOrder }
        }
        dispatch(listDashboardTask(condition))
    }

    // Show Updated Task Data 
    const showUpdateTaskData = (e, data) => {
        e.preventDefault();
        let arr = ["Due in 1 Day", "Due in 3 Days", "Due in 1 Week", "Due in 1 Month", "Custom", "No due date"];
        let contact_id=data.contact_id!==null ? data.contact_id : '', lead_id=data.lead_id!==null ? data.lead_id : '', user_id=data.user_id!==null ? data.user_id : '', booking_id=data.booking_id!==null ? data.booking_id : ''; 

        if(_.includes(arr, data.task_due_type)){
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: data.task_due_type, taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: data.task_due_type, label: data.task_due_type },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
            contact_id, lead_id, user_id, booking_id })
        }else{
            setTaskState({ ...taskState, taskName: data.detail, taskNameCls: '', taskNameErr: '',
            taskType: data.task_type, taskTypeErr: '', taskTypeCls: '', taskTypeSelect: { value: data.task_type, label: data.task_type },
            taskDueType: 'Custom', taskDueTypeErr: '', taskDueTypeCls: '', taskDueTypeSelect: { value: 'Custom', label: 'Custom' },
            customDate: data.custom_date!==null ? moment(data.custom_date).toDate() : new Date(), customDateErr: '', customDateCls: '', taskId: data.id,
            contact_id, lead_id, user_id, booking_id })
        }
        setTaskModalShow(true)
    }

    // Delete Lead Task Data 
    const deleteLeadTaskFunction = (e, data) => {
        e.preventDefault();
        let contact_id=data.contact_id!==null ? data.contact_id : '', lead_id=data.lead_id!==null ? data.lead_id : '', user_id=data.user_id!==null ? data.user_id : '', booking_id=data.booking_id!==null ? data.booking_id : ''; 
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
                dispatch(deleteDashboardTask({ id: data.id, contact_id, lead_id, booking_id, user_id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }


    // On Change Task Filter 
    const onChangeSnapFilter = (data) => {
        setDashboardSanpSelect(data)
        dispatch(getBusinessSnapshot({ days: data.value }))
    }

    // Sort The Contact List 
    const sortTheData = (e, field, orderValue) => {
        let order = orderValue === 'DESC' ? 'ASC' : (orderValue === 'ASC' ? "DESC" : 'DESC');
        e.preventDefault();
        setSortingField(field);
        setSortingOrder(order);
        setTaskState({ ...taskState, tasksList: [], page: 1, hasMore: false })
        setLoader(true)
        setfetchTaskList(true)
        if(taskFilter ===0 || taskFilter===1){
            dispatch(listDashboardTask({ limit: taskState.limit, page: 1, status: taskFilter, sortingField:field, sortingOrder:order }))
        }else{
            dispatch(listDashboardTask({ limit: taskState.limit, page: 1, sortingField:field, sortingOrder:order }))
        }
        
    }

    // Notification Data
    useEffect(() => {
        if (prevListDashboardNotificationData && prevListDashboardNotificationData.listDashboardNotificationData !== listDashboardNotificationData) {
            if (listDashboardNotificationData && _.has(listDashboardNotificationData, 'data') && listDashboardNotificationData.success === true) {
                let mergeData = notificationState.notificationList.concat(listDashboardNotificationData.data)
                if(mergeData.length === listDashboardNotificationData.total){
                    setNotificationState({ ...notificationState, notificationList: mergeData, hasMore: false, })
                }else{
                    setNotificationState({ ...notificationState, notificationList: mergeData, hasMore: true, })
                }
                setTotalNotification(listDashboardNotificationData && listDashboardNotificationData.total_unread)
                setLoader(false)
            }
            if (listDashboardNotificationData && _.has(listDashboardNotificationData, 'message') && listDashboardNotificationData.success === false) {
                setLoader(false)
                errorPopUp(listDashboardNotificationData.message)
            }
        }
        if (prevDeleteDashboardNotificationData && prevDeleteDashboardNotificationData.deleteDashboardNotificationData !== deleteDashboardNotificationData) {
            if (deleteDashboardNotificationData && _.has(deleteDashboardNotificationData, 'data') && deleteDashboardNotificationData.success === true) {
                setLoader(false);
                setNotificationState({...notificationState, page:1, notificationList:[]});
                dispatch(listDashboardNotification({ limit: notificationState.limit, page: 1 }))
            }
            if (deleteDashboardNotificationData && _.has(deleteDashboardNotificationData, 'message') && deleteDashboardNotificationData.success === false) {
                setLoader(false)
                errorPopUp(deleteDashboardNotificationData.message)
            }
        }
        if (prevDeleteAllNotificationData && prevDeleteAllNotificationData.deleteAllNotificationData !== deleteAllNotificationData) {
            if (deleteAllNotificationData && _.has(deleteAllNotificationData, 'data') && deleteAllNotificationData.success === true) {
                setLoader(false);
                setNotificationState({...notificationState, page:1, notificationList:[]});
                dispatch(listDashboardNotification({limit: notificationState.limit, page: 1 }))
            }
            if (deleteAllNotificationData && _.has(deleteAllNotificationData, 'message') && deleteAllNotificationData.success === false) {
                setLoader(false)
                errorPopUp(deleteAllNotificationData.message)
            }
        }
        if (prevMarkAsReadNotificationData && prevMarkAsReadNotificationData.markAsReadNotificationData !== markAsReadNotificationData) {
            if (markAsReadNotificationData && _.has(markAsReadNotificationData, 'data') && markAsReadNotificationData.success === true) {
                const data = markAsReadNotificationData.data;
                props.history.push(data.link);
                setLoader(false);
            }
            if (markAsReadNotificationData && _.has(markAsReadNotificationData, 'message') && markAsReadNotificationData.success === false) {
                setLoader(false)
                errorPopUp(markAsReadNotificationData.message)
            }
        }
    }, [prevListDashboardNotificationData, listDashboardNotificationData, prevDeleteDashboardNotificationData, deleteDashboardNotificationData, prevDeleteAllNotificationData, deleteAllNotificationData, prevMarkAsReadNotificationData, markAsReadNotificationData]);// eslint-disable-line react-hooks/exhaustive-deps

    const deleteNotificationFunction = (e, data) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Notification!',
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
                dispatch(deleteDashboardNotification({ id: data.id, }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Check Scroll Notification
    const notificationScrollList = (e) => {
        const bottom = e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight;
        if (bottom && notificationState.hasMore) { 
            getNotificationPageData()
        }
    }

    // Notification Data  By Pagination
    const getNotificationPageData = () => {
        let page = (notificationState.page)+1
        setNotificationState({ ...notificationState, page: page })
        dispatch(listDashboardNotification({limit: notificationState.limit, page }))
    }

    const deleteAllNotificationFunction = (e) => {
        e.currentTarget.blur();
        e.preventDefault();
        if((notificationState.notificationList).length>0){
                Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to clear all notifications?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true,
                showCloseButton: true,
                customClass:"mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
            }).then((result) => {
                if (result.value) {
                    setLoader(true)
                    dispatch(deleteAllNotification())
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }else{
            Swal.fire({
                text: "No More Notifications!",
                showConfirmButton: false,
                showCancelButton: true,
                reverseButtons: true,
                showCloseButton: true,
                customClass:"mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
                cancelButtonText: 'Ok',
            }).then((result) => {
               
            })
        }
    }

    const markAsReadFunction = (e, data) => {
        e.preventDefault();
        if(data.is_read === 0){
            setLoader(true);
            dispatch(markAsReadNotification({id: data.id}));
        }
    }

    // Create Function
    const createFunction = (e, path) =>{
        e.preventDefault()
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
            props.history.push(path)
        }
    }

    return (
        <>
        <Loader loader={loader} />
        <div className="main-site fixed--header">
            <Header getMainRoute={'dashboard'}/>
            <main className="site-body">
                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div><h2 className="title">Dashboard</h2></div>
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <div className="dropdown custom-dropdown d-none d-lg-block">
                                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Actions
                                        </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#contact" onClick={(e) =>createFunction(e,ADD_CONTACT)}>Create Contact</a>
                                        <a className="dropdown-item" href="#lead" onClick={(e) =>createFunction(e,ADD_LEAD)}>Create Lead</a>
                                        <a className="dropdown-item"href="#quote" onClick={(e) =>createFunction(e,ADD_BASIC_QUOTE)}>Create Quote</a>
                                        <a className="dropdown-item"href="#invoice" onClick={(e) =>createFunction(e,ADD_INVOICE_BASE)}>Create Invoice</a>
                                    </div>
                                </div>
                                <a href="#contact" onClick={(e) =>createFunction(e,ADD_CONTACT)} className="btn d-lg-none btn-secondary mr-15">New Contact</a>
                                <a href="#lead" onClick={(e) =>createFunction(e,ADD_LEAD)} className="btn d-lg-none btn-secondary">New Lead</a>
                                <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#contact" onClick={(e) => createFunction(e,ADD_CONTACT)}>Create Contact</a>
                                        <a className="dropdown-item" href="#lead" onClick={(e) => createFunction(e,ADD_LEAD)}>Create Lead</a>
                                        <a className="dropdown-item"href="#quote" onClick={(e) => createFunction(e,ADD_BASIC_QUOTE)}>Create Quote</a>
                                        <a className="dropdown-item"href="#invoice" onClick={(e) => createFunction(e,ADD_INVOICE_BASE)}>Create Invoice</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="middle-section">
                    <div className="container">
                        <div className="row no-gutters-mbl">
                            <div className="col-lg-8">
                                <div className="main-card">
                                    <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#TasksCollapse" aria-expanded="true" aria-controls="TasksCollapse">Tasks <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                    <div className={"card main-card--collapse show "+isCollapse} id="TasksCollapse">
                                        <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                            <h2>Tasks<span className="task-countt"> ({totalTask})</span></h2>
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
                                                <button onClick={(e) => showDashboardTaskModal(e)} data-toggle="modal" data-target="#AddNewTask" className="btn btn-secondary ml-15">Add Task</button>
                                            </div>
                                        </div>
                                        <div className="card-body pt-0">

                                            <div className="table-responsive table-vertical-scroll" onScroll={(e) => taskScrollList(e)}>
                                                <table className="table table-striped dashboard-task-table tasks--table sticky-table smart-table" >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col"><div className="table--sorting">Status<div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'custom_date' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'custom_date', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    </div></th>
                                                            <th scope="col">Type</th>
                                                            <th scope="col">Subject</th>
                                                            <th scope="col"><div className="table--sorting">Related to
                                                            <div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'related_to' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'related_to', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    </div></th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(taskState.tasksList && taskState.tasksList.length > 0) ?
                                                            _.map(taskState.tasksList, (data, k) => {
                                                                let relatedTo='-';
                                                                if(data && data.contact_id && data.contact_id!==null){
                                                                    relatedTo = <Link to={VIEW_CONTACT_BASE+data.contact.id}>{data.contact.first_name + (data.contact.last_name!==null ? ' '+data.contact.last_name :'')}</Link>
                                                                }
                                                                if(data && data.lead_id && data.lead_id!==null){
                                                                    relatedTo = <Link to={VIEW_LEAD_BASE+data.lead.id}>{data.lead.name}</Link>
                                                                }
                                                                if(data && data.booking_id && data.booking_id!==null){
                                                                    relatedTo = <Link to={VIEW_BOOKING_BASE+data.booking.id}>{data.booking.name}</Link>
                                                                }
                                                                return <tr key={k}>
                                                                {data.status===0 ?
                                                                <>
                                                                <td className="task--status"> <a href="#updateTask" className={data.task_due_type==='Overdue' ? "" : "text-link"} onClick={(e) => showUpdateTaskData(e, data)}>{data.task_due_type==='Overdue' ? <span className="text-danger">{data.task_due_type}</span> : (data.task_due_type==='Due in 1 Day' ? 'Due Tomorrow' : data.task_due_type)}</a></td>
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
                                                                <td className="task--todo related-toDo">{relatedTo}</td>
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
                                                                            <a href="#deleteTask" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => deleteLeadTaskFunction(e, data)} className="close-icn">
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
                                                                <td className="task--todo">{relatedTo}</td>
                                                                <td className="text-right table-action">
                                                                        <div className="d-flex">
                                                                            <a href="#deleteTask" onClick={(e) => deleteLeadTaskFunction(e, data)} className="close-icn">
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
                                                                    {fetchTaskList ?
                                                                        ''
                                                                    :
                                                                    <div className="no--contacts--note">
                                                                        <h5>This dashboard doesn’t have any tasks</h5>
                                                                    </div>}
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

                            <div className="col-lg-4">
                                <div className="main-card">
                                    <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#NotificationsCollapse" aria-expanded="true" aria-controls="NotificationsCollapse">Notifications <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                    <div className={"card main-card--collapse show "+isCollapse} id="NotificationsCollapse">
                                        <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                            <h2>Notifications<span className="task-countt"> ({totalNotification})</span></h2>
                                            <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                <a href="#google" onClick={(e) => deleteAllNotificationFunction(e)} className="btn btn-secondary">Clear List</a>
                                            </div>
                                        </div>
                                        <div className="card-body pt-0">
                                            <div className="table-responsive table-vertical-scroll" onScroll={(e) => notificationScrollList(e)}>
                                                <table className="table table-striped notification--table smart-table">
                                                    <tbody>
                                                        {(notificationState.notificationList && notificationState.notificationList.length > 0) ? 
                                                        _.map(notificationState.notificationList, (data, key) => {
                                                            return <tr key={key}>
                                                                { data.is_read === 0 ? 
                                                                <td><a href={data.link} className='text-secondary font-weight-bold text-decoration-none' onClick={(e) => markAsReadFunction(e, data)}>{data.message}</a></td>
                                                                :
                                                                <td><Link to={data.link} className='text-secondary font-weight-light text-decoration-none'>{data.message}</Link></td>
                                                                }
                                                                <td className="text-right">
                                                                <a href="#google" onClick={(e) => deleteNotificationFunction(e, data)} className="close-icn">
                                                                <svg width="20px" height="20px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                    viewBox="0 0 174.239 174.239" style={{"enableBackground":"new 0 0 174.239 174.239"}} xmlSpace="preserve">
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
                                                                </a></td>
                                                            </tr>
                                                        })
                                                        : 
                                                        <tr>
                                                            <td colSpan="6" className="bg-white">
                                                                <div className="no--contacts--note">
                                                                    <h5>No More Notifications!</h5>
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
                        <div className="row no-gutters-mbl mt-lg-4">
                            <div className="col-12">
                                <div className="main-card">
                                    <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#SnapshotCollapse" aria-expanded="true" aria-controls="SnapshotCollapse">Business Snapshot <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                    <div className={"dashboard-business-card card main-card--collapse show "+isCollapse} id="SnapshotCollapse">
                                        <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                            <h2>Business Snapshot</h2>
                                            <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                {/* <span className="mr-15">View</span> */}
                                                <Select
                                                    styles={dashboardSelectStyle}
                                                    isSearchable={false}
                                                    className="task-view-filter"
                                                    components={makeAnimated()}
                                                    value={dashboardSanpSelect}
                                                    defaultValue={dashboardSanpSelect}
                                                    options={snapshotOptions}
                                                    onChange={(data) => onChangeSnapFilter(data)}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-body pt-1">
                                            <div className="biz-snapshot">
                                                <div className="biz-snapshot_inner">
                                                    {_.map(businessSnapshotData, (data, key) => {
                                                        return <React.Fragment key={key}>
                                                            <div className="biz-snapshot--box">
                                                                <div className="price">${data.amount}</div>
                                                                <div className="biz--status">{key === 'Won/Lost' ? 'Completed' : key} ({data.leads})</div>
                                                            </div>
                                                            { key !== 'Won/Lost' ?
                                                            <div className="snapshot--box_divider"><img src={setImagePath(RIGHT_ARROW)} alt="" /></div>
                                                                : '' }
                                                        </React.Fragment>
                                                    })}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                                <div className="form-group col-md-4 mb-0">
                                    <div className="floating-label">
                                        {/* <AsyncSelect
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
                                        /> */}
                                        {/* <label>Associate a lead</label> */}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        {taskState.taskId ? 
                            <button type="button" className="btn btn-secondary " onClick={() => saveDashboardTask(1)}>Mark as Completed</button>
                            :    
                            <button type="button" className="btn btn-dark" onClick={() => setTaskModalShow(false)}>Cancel</button>
                        }
                        <button type="button" onClick={() => saveDashboardTask(0)} className="btn btn-primary">{taskState.taskId ? 'Save' : 'Add'}</button>
                    </Modal.Footer>
                </Modal>
            </main>
            <Footer />
            {/** Welcome Modal **/}
            <Welcome 
                loader={(data) => setLoader(data)}
                welcomeModal ={welcomeModal}
                closeWelcomeModal= {() => setWelcomeModal(false)}
            />
            {/* Subscription Modal*/}
            <SubscriptionPlan loader={(data) => setLoader(data)}
                openSubscriptionModal={subscriptionModalShow}
                closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                updatePlanDetail={(data) => { setSubscriptionModalShow(false); setLoader(false) }}
                currentPlan={currentPlan}
            />
        </div>
        </>
    );
}

export const Dashboard = withRouter(NewDashboard)