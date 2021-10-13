import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ARROW_RIGHT from '../../../../assets/images/arrow-rgt-teal.svg'
import STAR_ICON from '../../../../assets/images/star.svg'
import { Link, withRouter } from "react-router-dom";
import { ADD_LEAD, LIST_CLOSE_LEADS, VIEW_PROFILE } from "../../../../routing/routeContants";
import { setImagePath, usePrevious } from '../../../../common/custom'
import { listLeadWithPosition, updateLeadStatus, markLeadStatus, listLostReason, addLostReason } from '../../../../duck/lead/lead.action';
import { VIEW_LEAD_BASE, CUSTOMIZE_STAGE } from "../../../../routing/routeContants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from 'lodash';
import Modal from "react-bootstrap/Modal";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { selectStyle, constants } from '../../../../common/constants';
import { validateInputs } from '../../../../common/validation';
import { Loader } from '../../../component/frontend/loader/loader'
import { errorPopUp } from '../../../../common/notification-alert';
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"
import Swal from 'sweetalert2'

export const ListLeadPage = props => {

    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [fetchList, setfetchList] = useState(true);
    const [isCollapse, setIsCollapse] = useState('');

    // Get Selector Data For Lead Status and Lead List
    const [onDragWait, setOnDragWait] = useState(false)
    const [scrollHeight, setScrollHeight] = useState(400)
    const [leadStage, setLeadStage] = useState([])
    const [allLeads, setAllLeads] = useState([])
    const [lastArr, setLastArr] = useState([])
    const [totalLead, setTotalLead] = useState(0)
    const listLeadWithPositionData = useSelector(state => state.lead.listLeadWithPositionData);
    const prevListLeadWithPositionData = usePrevious({ listLeadWithPositionData });
    const updateLeadStatusData = useSelector(state => state.lead.updateLeadStatusData);
    const prevUpdateLeadStatusData = usePrevious({ updateLeadStatusData });

    // Add Completed Modal State And Props
    const taskDueTypeOption = [{ value: 'Due in 1 Day', label: 'Due in 1 Day' }, { value: 'Due in 3 Days', label: 'Due in 3 Days' }, { value: 'Due in 1 Week', label: 'Due in 1 Week' }, { value: 'Due in 1 Month', label: 'Due in 1 Month' }, { value: 'Custom', label: 'Custom' }, { value: 'No due date', label: 'No due date' }];
    const taskTypeOption = [{ value: 'To-do', label: 'To-do' }, { value: 'Follow up', label: 'Follow up' }];
    const [completedModalShow, setCompletedModalShow] = useState(false);
    const [state, setState] = useState({
        type: "1", followTask: false, taskName: '', taskNameCls: '', taskNameErr: '',
        taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', amount: '', amountCls: '', amountErr: '',
        taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
        customDate: new Date(), customDateErr: '', customDateCls: '',
        taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
        taskTypeSelect: { value: 'To-do', label: 'To-do' }, selectReason: '',
        selectReasonErr: '', selectReasonCls: '', leadId: '', setPosition: ''
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

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(listLeadWithPosition())
        dispatch(listLostReason())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Lost Reason Data And Add  Data
    useEffect(() => {
        if (prevListLostReasonData && prevListLostReasonData.listLostReasonData !== listLostReasonData) {
            if (listLostReasonData && _.has(listLostReasonData, 'data') && listLostReasonData.success === true) {
                setLoader(false)
                let reasonOption = _.map(listLostReasonData.data, (data) => { return { value: data.id, label: data.name } })
                setReasonState({ ...reasonState, reasonListOptions: reasonOption })
            }
            if (listLostReasonData && _.has(listLostReasonData, 'message') && listLostReasonData.success === false) {
                setLoader(false)
                errorPopUp(listLostReasonData.message)
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
                setLoader(false)
                dispatch(listLeadWithPosition())
            }
            if (markLeadStatusData && _.has(markLeadStatusData, 'message') && markLeadStatusData.success === false) {
                setLoader(false)
                setCompletedModalServiceMessage(markLeadStatusData.message)
            }
        }
    }, [prevListLostReasonData, listLostReasonData, prevAddLostReasonData, addLostReasonData, prevMarkLeadStatusData, markLeadStatusData]);// eslint-disable-line react-hooks/exhaustive-deps

    // List Lead Status Data And Get Lead Data
    useEffect(() => {
        if (prevListLeadWithPositionData && prevListLeadWithPositionData.listLeadWithPositionData !== listLeadWithPositionData) {
            if (listLeadWithPositionData && _.has(listLeadWithPositionData, 'data') && listLeadWithPositionData.success === true) {
                let newAllLeads = {}
                let totalLead = 0;
                _.map(listLeadWithPositionData.data, (val, ind) => {
                    newAllLeads[val.id] = newAllLeads[val.id] ? newAllLeads[val.id] : [];
                    totalLead = totalLead + val.count
                    _.map(val.leads, (sub) => {
                        newAllLeads[val.id].push(sub)
                    })
                })
                setLastArr(_.last(listLeadWithPositionData.data))
                setAllLeads(newAllLeads)
                setTotalLead(totalLead)
                setLeadStage(listLeadWithPositionData.data)
                setCompletedModalShow(false)
                setOnDragWait(false)
                setLoader(false)
                setfetchList(false);
            }
            if (listLeadWithPositionData && _.has(listLeadWithPositionData, 'message') && listLeadWithPositionData.success === false) {
                setLoader(false)
                setOnDragWait(false)
                setfetchList(false);
                errorPopUp(listLeadWithPositionData.message)
            }
        }
        if (prevUpdateLeadStatusData && prevUpdateLeadStatusData.updateLeadStatusData !== updateLeadStatusData) {
            if (updateLeadStatusData && _.has(updateLeadStatusData, 'data') && updateLeadStatusData.success === true) {
                setLoader(false)
                dispatch(listLeadWithPosition())
            }
            if (updateLeadStatusData && _.has(updateLeadStatusData, 'message') && updateLeadStatusData.success === false) {
                setLoader(false)
                dispatch(listLeadWithPosition())
                errorPopUp(updateLeadStatusData.message)
            }
        }
    }, [listLeadWithPositionData, prevListLeadWithPositionData, prevUpdateLeadStatusData, updateLeadStatusData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Function To Reorder Leads
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    // Function to Set Order After Drag and Drop Task
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination || onDragWait) {
            return;
        }
        let sourceId = result.source.droppableId;
        sourceId = sourceId.split('-');
        sourceId = sourceId[1];
        let destinationId = result.destination.droppableId;
        destinationId = destinationId.split('-');
        destinationId = destinationId[1];
        let dragId = result.draggableId;
        dragId = dragId.split('-');
        dragId = dragId[1];

        const allNewLeads = allLeads;
        if (sourceId !== destinationId) {
            if (allNewLeads[destinationId].length === 0) {
                allNewLeads[destinationId].push(allNewLeads[sourceId][result.source.index])
            } else {
                allNewLeads[destinationId].splice(result.destination.index, 0, allNewLeads[sourceId][result.source.index]);
            }
            allNewLeads[sourceId].splice(result.source.index, 1)
            setAllLeads(allNewLeads)
            let allIds = _.map(allNewLeads[destinationId], 'id');
            if (lastArr.id === parseInt(destinationId)) {
                setCompletedModalShow(true)
                setState({
                    ...state, leadId: dragId, type: "1", followTask: false, taskName: '', taskNameCls: '', taskNameErr: '',
                    taskType: 'To-do', taskTypeErr: '', taskTypeCls: '', amount: '', amountCls: '', amountErr: '',
                    taskDueType: 'Due in 1 Day', taskDueTypeErr: '', taskDueTypeCls: '',
                    customDate: new Date(), customDateErr: '', customDateCls: '',
                    taskDueTypeSelect: { value: 'Due in 1 Day', label: 'Due in 1 Day' },
                    taskTypeSelect: { value: 'To-do', label: 'To-do' }, selectReason: '',
                    selectReasonErr: '', selectReasonCls: '', setPosition: allIds.join(',')
                })
            } else {
                setOnDragWait(true)
                dispatch(updateLeadStatus({ position: allIds.join(','), id: dragId, lead_status_types_id: destinationId }))
            }
        } else {
            const allNewLeadsChanges = reorder(
                allNewLeads[destinationId],
                result.source.index,
                result.destination.index
            );
            allNewLeads[destinationId] = allNewLeadsChanges
            setAllLeads(allNewLeads)
            let allIds = _.map(allNewLeads[destinationId], 'id');
            setOnDragWait(true)
            dispatch(updateLeadStatus({ position: allIds.join(','), id: dragId, lead_status_types_id: destinationId }))
        }

    }

    //Custom Date Function
    const dateForCustom = (date) => {
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
            selectReason = state.selectReason, selectReasonErr = '', selectReasonCls = '',
            setPosition = state.setPosition;

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
            const saveData = { lead_id: state.leadId, position: setPosition };
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

    // Check Scroll 
    const getScrollHeight = (e) => {
        console.log(e.target.scrollHeight, e.target.scrollTop)
        console.log(e.target.clientHeight)
        setScrollHeight(e.target.scrollHeight + 'px')
    }

    // Create lead 
    const createLead = (e) => {
        e.preventDefault()
        if (currentPlan && currentPlan.plan_is_active === 0) {
            let buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
            let warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
            let msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
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
        } else {
            props.history.push(ADD_LEAD)
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
                                        <h2 className="title">Leads ({totalLead})</h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <Link to={CUSTOMIZE_STAGE} className="btn text-link mr-15">Customize Stages</Link>
                                    <button onClick={(e) => createLead(e)} className="btn btn-primary">Create Lead</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {totalLead !== 0 ?
                                <div className="row no-gutters-mbl">
                                    <div className="col-12">
                                        <div className="leads-container" onScroll={(e) => getScrollHeight(e)}>
                                            <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
                                                <div className={leadStage.length <= 5 ? "leads-container_row leads-container_scroller lead-stage-adjust" : "leads-container_row leads-container_scroller "}>
                                                    {_.map(leadStage, (data, key) => {
                                                        return <React.Fragment key={data.id}> <Droppable droppableId={"drop-" + data.id} type={`lead`} >
                                                            {(provided, snapshot) => (
                                                                <div key={key} style={{ "minHeight": scrollHeight }} className={snapshot.isDraggingOver ? "leads-col dropable-areaa" : "leads-col"} data-scrollable="true" ref={provided.innerRef}
                                                                    {...provided.droppableProps}
                                                                >
                                                                    <div className="leads-col_header">
                                                                        <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target={'#lead-' + data.id} aria-expanded="false" aria-controls={'lead-' + data.id}><span>{data.name} ({data.count})</span> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                                                        <div className="header--web d-none d-lg-flex"><h4>{data.name} </h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                                                                    </div>
                                                                    <div className={"leads-col_body " + isCollapse} id={'lead-' + data.id}>
                                                                        <div className="leads-col_body--wrap">
                                                                            {_.map(allLeads && allLeads[data.id], (lead, leadKey) => {
                                                                                return <Draggable draggableId={'lead-' + lead.id} index={leadKey} key={lead.id}>
                                                                                    {(provided, snapshot) => (
                                                                                        <div className={(leadStage.length === key + 1) ? (lead && lead.lead_lost_reason_id === null ? 'dragable--card completed' : 'dragable--card lost') : "dragable--card"} key={leadKey} ref={provided.innerRef}
                                                                                            {...provided.draggableProps}
                                                                                        >
                                                                                            <div className="title"><Link to={VIEW_LEAD_BASE + lead.id}>{lead.name}</Link></div>
                                                                                            <div {...provided.dragHandleProps}>
                                                                                                {(leadStage.length === key + 1)
                                                                                                    ?
                                                                                                    <div className="info" {...provided.dragHandleProps}><span>{lead.amount && lead.amount !== null ? '$' + lead.amount : (lead.potential_revenue && lead.potential_revenue !== null ? '$' + lead.potential_revenue : '')}</span>
                                                                                                        Updated on: {moment(lead.updated_at).format("ddd, MMM DD YYYY")}</div>
                                                                                                    :
                                                                                                    <div className="info">
                                                                                                        {lead.contact && lead.contact.id ?
                                                                                                            <>
                                                                                                                <p className="mb-0">{lead.contact.first_name + ' ' + (lead.contact.last_name !== null ? lead.contact.last_name : '')}
                                                                                                                    {lead.contact.phone !== null ? (<><br />{lead.contact.phone}</>) : ''}
                                                                                                                    {lead.contact.email !== null ? (<><br />{lead.contact.email}</>) : ''}</p>
                                                                                                                <p className="mb-0">{lead.service_type && lead.service_type.id ? lead.service_type.name : ''}<br /> {lead.potential_revenue && lead.potential_revenue !== null ? '$' + lead.potential_revenue : ''}</p>
                                                                                                            </>
                                                                                                            : ''}
                                                                                                    </div>
                                                                                                }
                                                                                                <div className="total-tasksnotes">
                                                                                                    {lead.interest_level === 'Confirmed' ?
                                                                                                        <div className="star-confirmed">
                                                                                                            <img src={setImagePath(STAR_ICON)} alt="" />
                                                                                                        </div>
                                                                                                        : ''}
                                                                                                    {lead.lead_note_count > 0 ? <div className="totalnotes">{lead.lead_note_count}N</div> : ''}
                                                                                                    {lead.open_lead_task_count > 0 ? <div className={lead.open_due_task_count > 0 ? "totaltasks" : "totalnotes"}>{lead.open_lead_task_count}T</div> : ''}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </Draggable>
                                                                            })}
                                                                        </div>
                                                                        {(leadStage.length === key + 1 && (lastArr.leads).length > 0) && allLeads[data.id].length > 2 ?
                                                                            <div className="d-block view-closed-leads text-center"><Link to={LIST_CLOSE_LEADS} className="text-link">View All Leads</Link></div>
                                                                            : ''}
                                                                    </div>
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                        </React.Fragment>
                                                    })}
                                                </div>

                                            </DragDropContext>
                                        </div>
                                        <div className="drag-note"> <strong>Note:</strong> Drag and drop lead cards to change lead stage. Add leads automatically when customer submits a request on your website. <Link to={VIEW_PROFILE} className="text-link"><strong>Learn More</strong></Link></div>
                                    </div>
                                </div>
                                :
                                <>
                                    <div className="row no-gutters-mbl mb-4">
                                        <div className="col-12">
                                            <div className="leads-container no-lead">
                                                <div className={leadStage.length <= 5 ? "leads-container_row leads-container_scroller lead-stage-adjust" : "leads-container_row leads-container_scroller "}>
                                                    {_.map(leadStage, (data, key) => {
                                                        return <div className="leads-col" key={key}>
                                                            <div className="leads-col_header">
                                                                <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target={'#' + data.id} aria-expanded="false" aria-controls={data.id}><span>{data.name} (0)</span> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                                                <div className="header--web d-none d-lg-flex"><h4>{data.name}</h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                                                            </div>
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {fetchList ?
                                        ''
                                        :
                                        <div className="row no-gutters-mbl">
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="empty-leads">
                                                            <p>You don’t have any leads yet! </p>
                                                            <p>Create new leads and track your business in one view. </p>
                                                            <p>Create your own view by editing the stage names or adding new ones.</p>
                                                            <Link to={ADD_LEAD} className="btn btn-primary">Create Lead</Link>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>}
                                </>
                            }
                        </div>
                    </section>

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
                                        <div className={"form-group mb-2 " + state.amountCls}>
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
                                            <div className="form-group col-md-4 mb-0">
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
                                            {state.taskDueType === "Custom" ? <div className="form-group col-md-4 mb-0">
                                                <div className={"floating-label " + state.customDateCls}>
                                                    <DatePicker
                                                        type="text"
                                                        name="customDate"
                                                        className={state.customDateCls ? "floating-input " + state.customDateCls : "floating-input"}
                                                        placeholder="" selected={state.customDate}
                                                        onChange={(date) => dateForCustom(date)}
                                                        minDate={moment().toDate()}
                                                        placeholderText="Select a date"
                                                    />
                                                    {/* <label>Select a date</label> */}
                                                    {state.customDateErr ? <span className="errorValidationMessage"> {state.customDateErr}</span> : ''}
                                                </div>
                                            </div> : ''}
                                            <div className="form-group col-md-4 mb-0">
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

export const ListLead = withRouter(ListLeadPage)