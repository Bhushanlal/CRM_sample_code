import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { constants, selectStyle, tinyConfig } from "../../../../common/constants";
import { fieldValidator, usePrevious, setImagePath, getValidationsOnsubmit, floatingWithTwoDecimal } from '../../../../common/custom';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import _ from 'lodash';
import { getQuoteById, updateQuote, getQuoteTemplateById } from '../../../../duck/quote/quote.action';
import { LIST_QUOTES, VIEW_QUOTE_BASE, ADD_BASIC_QUOTE, VIEW_PROFILE } from "../../../../routing/routeContants";
import { validateInputs } from '../../../../common/validation';
import Swal from 'sweetalert2'
import IC_OFF from "../../../../assets/images/ic_highlight_off.svg";
import {AddTemplate} from './addTemplate'
import { Editor } from '@tinymce/tinymce-react';
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'

export const NewAddQuote = props => {
    let quoteId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        quoteId = props.match.params.id
    }

    const dispatch = useDispatch();
    const itemNameRefer = useRef();
    const itemQtyRefer = useRef();
    const itemRateRefer = useRef();
    const itemChargeRefer = useRef();
    const [loader, setLoader] = useState(false);
    const [paypalUrl, setRedirectPaypal] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [listTemplate, setListTemplate] = useState([]);
    const [lineItems, setLineItems] = useState([{item_name:'', item_description:'', item_charges:'', item_qty: 1, item_rate: '0' }]);
    const [optinalLineItems, setOptinalLineItems] = useState([]);
    const [amountArr, setAmount] = useState([{fee_name:'Set up cost', amount:''},{fee_name:'Service Charge', amount:''},{fee_name:'MISC or Taxes', amount:''},{discount_name:'Discount Name', amount:''}]);
    const [sections, setSections] = useState([]);
    const [contactData, setContactData] = useState('');
    const [state, setState] = useState({
        correctInput: '', wrongInput: constants.WRONG_INPUT, quoteName: '', timeValue: '',  location: '', internalNotes: '',
        timeShiftValue: { value: 'AM', label: "AM" }, timeShiftOptions: [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }], 
        durationValue: { value: "1 Hours", label: "1 Hours" }, durationOptions: [{ value: "1 Hours", label: "1 Hours" },{ value: "2 Hours", label: "2 Hours" },
        { value: "3 Hours", label: "3 Hours" },{ value: "Half Day", label: "Half Day" },{ value: "Full Day", label: "Full Day" },{ value: "Custom", label: "Custom" },
        { value: "N/A", label: "N/A" } ], customDuration: '', lat_long: '', totalAmount:0, deposite:0, date: '', dateErr: '', dateCls: '',
        itemName:'Line Item', discription:'Discription(Optional)', charge: 'Amount', qty:'Qty', rate:'Rate', validThrough:'', validThrouhOptions: [{ value: 3, label: "3 Days" }, { value: 7, label: "7 Days" }, 
        { value: 15, label: "15 Days"}, { value: 30, label: "30 Days" }], validThroughErr: '', validThroughCls: '',
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        selectTemplate: '', redirectPage: false, itemHeadingDisabled: true, itemNameDisabled: true, itemDiscriptionDisabled: true,
        itemChargeDisabled: true, depositRequired: 0, depositOnline: 0,
    });
    const getQuoteByIdData = useSelector(state => state.quote.getQuoteByIdData);
    const prevGetQuoteByIdData = usePrevious({ getQuoteByIdData });

    const updateQuoteData = useSelector(state => state.quote.updateQuoteData);
    const prevUpdateQuoteData = usePrevious({ updateQuoteData });

    // Add Template
    const [addtemplateModalShow, setAddTemplateModalShow] = useState(false);
    const getQuoteTemplateByIdData = useSelector(state => state.quote.getQuoteTemplateByIdData);
    const prevGetQuoteTemplateByIdData = usePrevious({ getQuoteTemplateByIdData });

    // On Load Get Data
    useEffect(() => {
        if (quoteId) {
            setLoader(true)
            dispatch(getQuoteById({ id: quoteId }))
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
    }

    // Set The Quote Input Values
    const setQuoteInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
    }

    // Update Quote Props Manage
    useEffect(() => {
        if (prevUpdateQuoteData && prevUpdateQuoteData.updateQuoteData !== updateQuoteData) {
            if (updateQuoteData && _.has(updateQuoteData, 'data') && updateQuoteData.success === true) {
                setLoader(false)
                if(paypalUrl){
                    props.history.push(VIEW_PROFILE+'#Payment')
                }else if(state.redirectPage){
                    props.history.push(VIEW_QUOTE_BASE+quoteId)
                }else{
                    props.history.push(LIST_QUOTES)
                }
            }
            if (updateQuoteData && _.has(updateQuoteData, 'message') && updateQuoteData.success === false) {
                setLoader(false)
                setServiceMessage(updateQuoteData.message)
            }
        }
    }, [prevUpdateQuoteData, updateQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

   
    // handle click for add item
	const handleAddItemClick = (e) => {
        e.preventDefault();
        setLineItems([...lineItems, {item_name:'', item_description:'', item_charges:'', item_qty:1, item_rate: '0'}]);
    };

    // handle click for add optinal item
	const handleAddOptionalItemClick = (e) => {
        e.preventDefault();
        setOptinalLineItems([...optinalLineItems, {item_name:'', item_description:'', item_charges:0, item_qty:1, item_rate: '0'}]);
    };

    // Optional Line Item Value Set
    const optinalLineItemSetValue = (i, event) => {
        const { name, value } = event.target;
        let itm = [...optinalLineItems];
        itm[i] = { ...itm[i], [name]: value };
        _.map(itm, (data) =>{
            if(parseFloat(data.item_qty) && parseFloat(data.item_rate)){
                let amountTotal = parseFloat(data.item_qty)*parseFloat(data.item_rate)
                data.item_charges = parseFloat(amountTotal).toFixed(2)
            }else{
                data.item_charges =0
            }
        })
        setOptinalLineItems(itm);
    }

    //Optinal Line Item Remove
    const removeOptionalLineItem = (e, index) => {
        e.preventDefault();
        const item = [...optinalLineItems];
        item.splice(index, 1);
        setOptinalLineItems(item);
    }

    // Line Item Value Set
    const LineItemSetValue = (i, event) => {
        const { name, value } = event.target;
        let itm = [...lineItems];
        itm[i] = { ...itm[i], [name]: value };
        setLineItems(itm);
    }

    // Line Item Remove
    const removeLineItem = (e, index) => {
        e.preventDefault();
        const item = [...lineItems];
        item.splice(index, 1);
        setLineItems(item);
    }

    // handle click for add Section
	const handleAddSectionClick = (e) => {
        e.preventDefault();
        setSections([...sections, {section_name:'', section_description:''}]);
    };
    
    // Line Section Value Set
    const sectionSetValue = (i, event) => {
        let sec = [...sections];
        if(event.target && event.target.name==='section_name'){
            const { name, value } = event.target;
            sec[i] = { ...sec[i], [name]: value };
            setSections(sec);
        }else{
            sec[i] = { ...sec[i], section_description: event };
            setSections(sec);
        }
    }

    // handle click for add Amount
	const handleAddAmountClick = (e, type) => {
        e.preventDefault();
        if(type===1){
            setAmount([...amountArr, {fee_name:'', amount:0}]);
        }else{
            setAmount([...amountArr, {discount_name:'', amount:0}]);
        }
    };
    
    
    //Amount Value Set
    const quoteAmountSet = (i, event) => {
        const { name, value } = event.target;
        let newAmount = [...amountArr];
        newAmount[i] = { ...newAmount[i], [name]: value };
        setAmount(newAmount)
    }

    //Amount Remove
    const removeQuoteAmount = (e, key) => {
        e.preventDefault();
        const amount = [...amountArr];
        amount.splice(key, 1);
        setAmount(amount)
    }
    
    //Section Remove
    const removeSection = (e, key) => {
        e.preventDefault();
        const section = [...sections];
        section.splice(key, 1);
        setSections(section)
	}

    // Get props quote by id and add organization 
    useEffect(() => {
        if (prevGetQuoteByIdData && prevGetQuoteByIdData.getQuoteByIdData !== getQuoteByIdData) {
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'data') && getQuoteByIdData.success === true) {
                const QuoteData = getQuoteByIdData.data.quote;
                if(!QuoteData.id || QuoteData.quote_status_type_id!==1){
                    props.history.push(LIST_QUOTES)
                }else{
                    let itemName='Line Item', discription='Discription(Optional)', charge='Amount', qty='Qty', rate='Rate';
                    if(QuoteData.description.length>1){
                        let itemHeadingGet = _.find(QuoteData.description, { 'type': "item_heading"});
                        let itemsGet = _.filter(QuoteData.description, (dd) => dd.type==='item');
                        let optionalItemsGet = _.filter(QuoteData.description, (dd) => dd.type==='optional_item');
                        let sectionsGet = _.filter(QuoteData.description, (dd) => dd.type==='section');
                        itemName= itemHeadingGet && itemHeadingGet.item_heading_name ? itemHeadingGet.item_heading_name : ''
                        discription= itemHeadingGet && itemHeadingGet.item_heading_description ? itemHeadingGet.item_heading_description : ''
                        charge= itemHeadingGet &&  itemHeadingGet.item_heading_charges ? itemHeadingGet.item_heading_charges : ''
                        qty= itemHeadingGet &&  itemHeadingGet.item_heading_qty ? itemHeadingGet.item_heading_qty : ''
                        rate= itemHeadingGet &&  itemHeadingGet.item_heading_rate ? itemHeadingGet.item_heading_rate : ''
                        let amountsGet = _.filter(QuoteData.description, (dd) => (dd.type==='fee' || dd.type==='discount'));
                        let amontAr = []
                        _.map(amountsGet, (data) => {
                            if(data.type==='fee'){
                                amontAr.push({fee_name:data.fee_name, amount:data.fee})
                            }else{
                                amontAr.push({discount_name:data.discount_name, amount: data.discount})
                            }
                        })
                        if(sectionsGet.length>0){
                            setSections(_.map(sectionsGet, _.partial(_.pick, _, ['section_name', 'section_description'])))
                        }else{
                            setSections([{section_name:'Terms & Conditions', section_description:''}])
                        }
                        setAmount(amontAr);
                        setLineItems(_.map(itemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                        setOptinalLineItems(_.map(optionalItemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                    }else{
                        setSections([{section_name:'Terms & Conditions', section_description:''}])
                    }
                    let templateArr = []
                    _.map(getQuoteByIdData.data.template, (data) => {
                        templateArr.push({value:data.id, label: data.name})
                    })
                   
                    setListTemplate(templateArr)
                    setLoader(false)
                    setContactData(QuoteData.contact)
                    setPaymentDetail(QuoteData.payment_account)
                    setState({...state, quoteName: QuoteData.name,
                         total: QuoteData.amount_total,
                         selectTemplate: QuoteData.template && QuoteData.template.id ? { value: QuoteData.template.id, label: QuoteData.template.name } : '',
                         deposite: QuoteData.amount_deposit!==null ? QuoteData.amount_deposit : 0,
                         depositOnline: QuoteData.deposit_online,
                         depositRequired: QuoteData.deposit_required,
                         internalNotes : QuoteData.internal_notes !==null ? QuoteData.internal_notes : '',
                         itemName, discription:'Discription(Optional)', charge, qty, rate
                    })
                }
            }
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'message') && getQuoteByIdData.success === false) {
                setLoader(false)
            }
        }
        if (prevGetQuoteTemplateByIdData && prevGetQuoteTemplateByIdData.getQuoteTemplateByIdData !== getQuoteTemplateByIdData) {
            if (getQuoteTemplateByIdData && _.has(getQuoteTemplateByIdData, 'data') && getQuoteTemplateByIdData.success === true) {
                const templateData = JSON.parse(getQuoteTemplateByIdData.data.quote_body);
                setLineItems(templateData.line_items.items)
                setOptinalLineItems(templateData.optional_items && templateData.optional_items.items ? templateData.optional_items.items :[])
                setSections(templateData.section)
                setAmount(templateData.total)
                setState({...state, itemName:templateData.line_items.item_heading_name, discription:templateData.line_items.item_heading_description , charge: templateData.line_items.item_heading_charges, qty: templateData.line_items.item_heading_qty, rate: templateData.line_items.item_heading_rate})
                setLoader(false)
            }
            if (getQuoteTemplateByIdData && _.has(getQuoteTemplateByIdData, 'message') && getQuoteTemplateByIdData.success === false) {
                setLoader(false)
            }
        }
    }, [prevGetQuoteByIdData, getQuoteByIdData, prevGetQuoteTemplateByIdData, getQuoteTemplateByIdData])// eslint-disable-line react-hooks/exhaustive-deps

    //Calculate Total Amount
    useEffect(() => {
        const calculateTotalAmount = () => {
            _.map(lineItems, (data) =>{
                if(parseFloat(data.item_qty) && parseFloat(data.item_rate)){
                    let amountTotal = parseFloat(data.item_qty)*parseFloat(data.item_rate)
                    data.item_charges = parseFloat(amountTotal).toFixed(2)
                }else{
                    data.item_charges = parseFloat(data.item_charges) ? parseFloat(data.item_charges) :0
                }
            })
            const charge = _.filter(lineItems, (dd) => _.has(dd, 'item_charges'));
            const totalCharge = _.sumBy(charge, ch => {
                return (parseFloat(ch.item_charges) ? parseFloat(ch.item_charges) : 0 );
            });
            const mainFee = _.filter(amountArr, (dd) => _.has(dd, 'fee_name'));
            const discountFee = _.filter(amountArr, (dd) => _.has(dd, 'discount_name'));
            const totalFee = _.sumBy(mainFee, fee => {
                return (parseFloat(fee.amount) ? parseFloat(fee.amount) : 0 );
            });
            const totalDisc = _.sumBy(discountFee, dis => {
                return (parseFloat(dis.amount) ? parseFloat(dis.amount) : 0 );
            });
            setState({...state, totalAmount: ((parseFloat(totalFee) + parseFloat(totalCharge)) - parseFloat(totalDisc))})

        }
        calculateTotalAmount()
    }, [amountArr, lineItems])// eslint-disable-line react-hooks/exhaustive-deps

    // Save Quote Function 
    const saveQuoteData = (status) => {
        let error = state.wrongInput;
        let redirectPage = status ? true : false;
        let deposit = state.deposite, depositCls = '', depositErr = '', getError = false;

        if(state.depositRequired===1  && status){
            if (validateInputs('positiveNumberWithDecimals', deposit) === 'empty') {
                depositErr = 'Please enter deposit.';
                depositCls = error
                getError = true;
            } else if (validateInputs('positiveNumberWithDecimals', deposit) === false) {
                depositErr = 'Please enter valid deposit.';
                depositCls = error
                getError = true;
            } else if (deposit && deposit.length > 1 && deposit.length > 11) {
                depositErr = 'Please enter maximum 10 digits.';
                depositCls = error
                getError = true;
            } else if (deposit > state.totalAmount) {
                depositErr = 'Deposit amount should not be greater than total amount.';
                depositCls = error
                getError = true;
            }
        }

        setState({
            ...state, redirectPage, depositErr, depositCls,  
        })

        const itemValidator = getValidationsOnsubmit(lineItems);
        const amountValidator = getValidationsOnsubmit(amountArr);
        const optionalItemValidator = getValidationsOnsubmit(optinalLineItems);
        if (amountValidator.length > 0 || itemValidator.length > 0 || optionalItemValidator.length>0) {
            setServiceMessage("Please enter valid amount.")
        }else if (getError === false && depositErr==="" ) {
            setLoader(true);
            //console.log(moment(datetimeA).format("YYYY-MM-DD HH:mm:ss"),'datetimeA')
            let itemData = {line_items: {items: _.reject(lineItems, { 'item_name': "", 'item_description': "", 'item_charges': "", 'item_qty':"", 'item_rate':"" }), item_heading_name: state.itemName, 
                item_heading_description: state.discription, item_heading_charges: state.charge, item_heading_qty: state.qty, item_heading_rate: state.rate}, total: amountArr, section: _.reject(sections, { 'section_name': "", 'section_description': "" }), optional_items: {items : _.reject(optinalLineItems, { 'item_name': "", 'item_description': "", 'item_charges': "", 'item_qty':"", 'item_rate': "" })}};
                const quoteData = {deposit_online: state.depositOnline, deposit_required : state.depositRequired , amount_deposit:state.deposite,
                quote_body : JSON.stringify(itemData), internal_notes: state.internalNotes, id: quoteId, contact_id: contactData.id, };
            if(status){
                quoteData.save_draft = 0;
            }else{
                quoteData.save_draft = 1;

            }
            if(state.selectTemplate && state.selectTemplate.value){
                quoteData.quote_template_id = state.selectTemplate.value
            }
            dispatch(updateQuote(quoteData))
        } else {
            setServiceMessage('Please enter all required details.')
        }
    }
  
    // Change Template Data 
    const changeTemplateFunctiona = (data) => {
        setLoader(true)
        setSections([])
        setState({...state, selectTemplate: data})
        dispatch(getQuoteTemplateById({id:data.value}))
    }

    // Edit Icon Input Function 
    const inputCloseFunction = (e, name, refer) => {
        e.preventDefault();
        setState({...state, [name]: ''})
        setTimeout(function () { refer.current.focus(); }, 100);
    }

     // On Cancel
     const CancelForm = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: ' You will lose all the changes if you navigate away',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                props.history.push(LIST_QUOTES)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Move To Basic Detail Page 
    const movedToBasicDetailPage = (e) => {
        let data = getQuoteByIdData.data;
        props.history.push({
            pathname: ADD_BASIC_QUOTE, 
            state:{quoteDataState : data}
        })
    }

    return (
        <>
        <Loader loader={loader} />
        <div className="main-site fixed--header lead-page-hdr unfixed-page-title">
            <Header getMainRoute={'quotes'} />
            <main className="site-body">
      
                <section className="page-title contact--header">
                    <div className="container">
                    <div className="row">
                        <div className="col-lg-auto title--col">
                        <div>
                            <ol className="breadcrumb d-none d-lg-flex">
                            <li className="breadcrumb-item"><Link to={LIST_QUOTES}>Quotes</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Create New Quote</li>
                            </ol>
                            <h2 className="title">New Quote <small className="font-small d-none d-lg-flex">({state.quoteName})</small></h2>
                        </div>
                        </div>
                        <div className="col-auto ml-auto d-flex align-items-center title-elems">
                            {/* <button type="button" onClick={(e) => deleteQuoteFunction(e)} className="btn btn-danger mr-15 d-none d-lg-flex">Delete</button> */}
                            <button onClick={(e) => CancelForm(e)} className="btn btn-dark mr-15 d-none d-lg-flex">Cancel</button>
                            <button onClick={() => saveQuoteData()} className="btn btn-secondary mr-15 d-none d-lg-flex">Save as Draft</button>
                            <div className="btn-divider mr-15 d-none d-lg-flex"></div>
                            <Link  to={{ pathname: ADD_BASIC_QUOTE, state:{quoteDataState : getQuoteByIdData.data}}} className="btn btn-secondary mr-15">Back</Link>
                            <button onClick={() => saveQuoteData(true)} className="btn btn-primary">Continue</button>
                            <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src={setImagePath(MENU_DOTTED)} alt="" />
                                </button>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="#cancel" onClick={(e) => CancelForm(e)}>Cancel</a>
                                    <a className="dropdown-item" href="#saveAsDraft" onClick={() => saveQuoteData()}>Save as Draft</a>
                                    {/* <a className="dropdown-item" href="#delete" onClick={(e) => deleteQuoteFunction(e)}>Delete</a> */}
                                </div>
                            </div> 
                        </div>
                    </div>
                    </div>
                </section>
                
                <section className="middle-section pt-0">
                    <div className="container">
                    {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                    <div className="row no-gutters-mbl mb-lg-4">
                        <div className="col-12">
                        <div className="main-card">
                            <div className="card w-100">
                            <div className="card-body p-0">
                                <div className="new-lead-timeline">
                                
                                <div className="timeline_row">
                                    <div className="timeline-cols completed" onClick={(e) => movedToBasicDetailPage(e)}><h5><em className="d-none d-lg-flex">1. Basic Details</em> <i className="d-lg-none">1</i></h5><span></span></div>
                                    <div className="timeline-cols active"><h5><em className="d-none d-lg-flex">2. Quote Details</em> <i className="d-lg-none">2</i></h5><span></span></div>
                                    <div className="timeline-cols"><h5><em className="d-none d-lg-flex">3. Preview Quote</em> <i className="d-lg-none">3</i></h5><span></span></div>
                                    <div className="timeline-cols"><h5><em className="d-none d-lg-flex">4. Message to Customer</em> <i className="d-lg-none">4</i></h5><span></span></div>
                                </div>
                                
                                </div>
                            </div>
                            </div>
                        </div>              
                        </div>
                    </div>

                    <div className="row no-gutters-mbl mb-4 mt-lg-4">
                        <div className="col-lg-4">
                        <div className="floating-label mb-0 px-4 py-4 p-lg-0">  
                            <Select
                                styles={selectStyle}
                                className="floating-select"
                                components={makeAnimated()}
                                placeholder="Select Template"
                                noOptionsMessage={() => "No results found"}
                                options={listTemplate}
                                value={state.selectTemplate}
                                onChange={(data) => changeTemplateFunctiona(data)}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="row no-gutters-mbl mt-lg-4">
                        <div className="col-lg-12">
                        <div className="main-card create-qoute--cards create-form formbox">
                            <div className="card pt-3 pt-lg-0">
                            <div className="card-body pt-0 pl-0 pr-0 pb-0">

                                <form className="quote--create-form">
                                
                                <div className="row">
                                    <div className="form-group input-edit-wrap col-lg-6 col-6">
                                        <div className={"input-edit-btn max-width--400 "}>
                                            <input placeholder="Optional heading" ref={itemNameRefer}  /* disabled={state.itemNameDisabled} */ onChange={(e) => setQuoteInputValue(e, 'string', 100, null)} name="itemName" value={state.itemName}  type="text" className="floating-input form-control" />
                                            <a className="btn" href="#close" onClick={(e) => inputCloseFunction(e, 'itemName', itemNameRefer)}><img src={setImagePath(IC_OFF)} alt="" /></a>
                                        </div>
                                    </div>
                                    <div className="form-group input-edit-wrap col-xl-2 col-lg-3 col-5">
                                        <div className={"input-edit-btn max-width--115 "}>
                                            <input placeholder="Optional heading" ref={itemQtyRefer} name="qty" onChange={(e) => setQuoteInputValue(e, 'string', 100, null)} value={state.qty}  type="text" className="floating-input form-control" />
                                            <a className="btn" href="#close" onClick={(e) => inputCloseFunction(e, 'qty',itemQtyRefer )}><img src={setImagePath(IC_OFF)} alt="" /></a>
                                        </div> 
                                    </div>
                                    <div className="form-group input-edit-wrap col-xl-2 col-lg-3 col-5">
                                        <div className={"input-edit-btn max-width--115 "}>
                                            <input placeholder="Optional heading" ref={itemRateRefer} name="rate" onChange={(e) => setQuoteInputValue(e, 'string', 100, null)} value={state.rate}  type="text" className="floating-input form-control" />
                                            <a className="btn" href="#close" onClick={(e) => inputCloseFunction(e, 'rate',itemRateRefer )}><img src={setImagePath(IC_OFF)} alt="" /></a>
                                        </div>
                                    </div>
                                    <div className="form-group input-edit-wrap col-xl-2 col-lg-3 col-5">
                                        <div className={"input-edit-btn max-width--115"}>
                                            <input placeholder="Optional heading" ref={itemChargeRefer} name="charge" onChange={(e) => setQuoteInputValue(e, 'string', 100, null)} value={state.charge}  type="text" className="floating-input form-control" />
                                            <a className="btn" href="#close" onClick={(e) => inputCloseFunction(e, 'charge',itemChargeRefer )}><img src={setImagePath(IC_OFF)} alt="" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="line-item--loop"> 
                                {console.log(lineItems,'lineItems')} 
                                {_.map(lineItems, (val, ind) => {
                                    
                                    return <div className="line-item--row line-item--row2"  key={ind}>
                                            <div className="row">
                                                <div className="form-group col-lg-6 col-6">
                                                <div className="floating-label m250">
                                                    <input placeholder={state.itemName || "Line item name"} onChange={(e) => LineItemSetValue(ind,e)} value={val.item_name} name="item_name" type="text" className="floating-input" />
                                                </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder={state.qty || "qty"} name="item_qty" value={val.item_qty?val.item_qty:''} onChange={(e) => LineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder={state.rate || "rate"} name="item_rate" value={val.item_rate ? val.item_rate:''} onChange={(e) => LineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx USD">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder={state.charge || "charge"} name="item_charges" value={val.item_charges} onChange={(e) => LineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                        <p className="m-0 d-none d-lg-flex">USD</p>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-5 descOrder-mbl desc-cstmwidth">
                                                    <div className="floating-label">
                                                        <textarea placeholder={state.discription || "Line item description"} value={val.item_description} name="item_description" onChange={(e) => LineItemSetValue(ind,e)} rows="4" type="text" className="floating-input"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-item-del">
                                            {ind !== 0 ?
                                                <a href="#phone" onClick={(e) => removeLineItem(e, ind)} className="close-icn">
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
                                                <span className="d-lg-none d-block ml-2">Delete</span>
                                                </a>
                                                :''}
                                            </div>
                                            </div>
                                        })}
                                    </div>
                                
                                <div className="line-item--add mb-4">
                                    <a href="#addItm" onClick={(e) => handleAddItemClick(e)} className="btn btn-secondary">Add Line Item</a>
                                </div>
                                
                                <div className="line-item--detail line-item-btm-border">
                                    <div className="row justify-content-end">
                                    <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10">
                                        <div className="add-fee-wrap">
                                        {_.map(amountArr, (data, k) => {
                                            return <div className="add-fee-row" key={k}>                                
                                                <div className="row">
                                                <div className="form-group col-7 pr-lg-4 pr-3">
                                                    <div className="floating-label">
                                                    <input placeholder="Charge Name" type="text" className="floating-input" value={_.has(data, 'discount_name') ? data.discount_name : data.fee_name}  onChange={(e) => quoteAmountSet(k,e)} name={_.has(data, 'discount_name') ? 'discount_name' :'fee_name'} />
                                                    {/* <label>Set up cost </label> */}
                                                    </div>
                                                </div>
                                                <div className="form-group col-5">
                                                    <div className={_.has(data, 'discount_name') ? "d-flex align-items-center col--minus" : "d-flex align-items-center"}>                              
                                                    <p className="m-0 pr-2 d-lg-none">$</p>
                                                    <div className="floating-label m-0">
                                                        <input type="number" min="0" className="floating-input" value={data.amount} onChange={(e) => quoteAmountSet(k,e)} name="amount" />
                                                    </div>
                                                    <p className="m-0 pl-2 d-none d-lg-flex">USD</p>
                                                    </div>
                                                </div>
                                                </div>
                                                <div className="line-item-del">
                                                <a href="#phone" onClick={(e) => removeQuoteAmount(e, k)} className="close-icn">
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
                                                </a>
                                                </div>
                                            </div>
                                        })}
                                        
                                        <div className="add-fee_discount">
                                            <a href="#phone" onClick={(e) => handleAddAmountClick(e,1)}>Add Fee</a> <span>OR</span> <a href="#phone" onClick={(e) => handleAddAmountClick(e,0)}>Add Discount</a> 
                                        </div>
                                        
                                        <div className="total_row">                                
                                            <div className="row mr-3">
                                            <div className="col-7">
                                                <div className="field-text text-right mb-0 mr-2">Total</div>
                                            </div>
                                            <div className="col-5">
                                                <div className="d-flex align-items-center">  
                                                <p className="m-0 d-lg-none">$</p>                            
                                                <div className="feetotal-amount">{floatingWithTwoDecimal(state.totalAmount)}</div>
                                                <p className="m-0 pl-2 d-none d-lg-flex">USD</p>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <h5><strong>Optional Items</strong></h5>
                                <p className="rvwqt-note mt-0">Add any optional items that you would like to share with customers. We will update the quote & amount due accordingly if customer selects any items, and send you a copy as well. </p>
                                <div className="line-item--loop">  
                                {_.map(optinalLineItems, (val, ind) => {
                                    return <div className="line-item--row line-item--row2"  key={ind}>
                                            <div className="row">
                                                <div className="form-group col-lg-6 col-6">
                                                <div className="floating-label m250">
                                                    <input placeholder="Optional Line item name" onChange={(e) => optinalLineItemSetValue(ind,e)} value={val.item_name} name="item_name" type="text" className="floating-input" />
                                                </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder={state.qty || "qty"} name="item_qty" value={val.item_qty} onChange={(e) => optinalLineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder={state.rate || "rate"} name="item_rate" value={val.item_rate} onChange={(e) => optinalLineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-xl-2 col-lg-3 col-5 selectBOx USD">
                                                    <div className="d-flex align-items-center">  
                                                        <p className="m-0 pr-2 d-lg-none">$</p>                            
                                                        <div className="floating-label m-0">
                                                        <input placeholder="" name="item_charges" value={val.item_charges} onChange={(e) => optinalLineItemSetValue(ind,e)} type="number" min="0" className="floating-input"  />
                                                        </div>
                                                        <p className="m-0 d-none d-lg-flex">USD</p>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-5 descOrder-mbl desc-cstmwidth">
                                                    <div className="floating-label">
                                                        <textarea placeholder="Optional Line item description" value={val.item_description} name="item_description" onChange={(e) => optinalLineItemSetValue(ind,e)} rows="4" type="text" className="floating-input"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-item-del">
                                                <a href="#phone" onClick={(e) => removeOptionalLineItem(e, ind)} className="close-icn">
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
                                                <span className="d-lg-none d-block ml-2">Delete</span>
                                                </a>
                                            </div>
                                            </div>
                                        })}
                                    </div>
                                
                                <div className="mb-4 mt-3">
                                    <a href="#addItm" onClick={(e) => handleAddOptionalItemClick(e)} className="btn btn-secondary">Add Optional Items</a>
                                </div>
                                
                                </form>
                                
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    {_.map(sections, (data, s) => {
                        return <div className="row no-gutters-mbl mt-lg-4 mt-2"  key={s}>
                             <div className="col-lg-12">
                                    <div className="main-card  create-qoute--cards create-form">
                                        {/* <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target={"#TermsCondCollapse"+s} aria-expanded="false" aria-controls={"TermsCondCollapse"+s}>                 
                                        <div className="floating-label m-0">
                                            <input placeholder="Section Name" name="section_name" value={data.section_name} onChange={(e) => sectionSetValue(s,e)} type="text" className="floating-input" />
                                            <label>Terms & Conditions</label>
                                        </div> 
                                        <img src={setImagePath(ORANGE_ARROW)} alt="" />               
                                        </button> */}
                                        <div className="card" >
                                            <div className="card-header justify-content-between align-items-center">
                                                <div className="input-edit-wrap align-items-center">
                                                <div className="floating-label mb-0 flex-grow-1">
                                                <input placeholder="Section Name" name="section_name" value={data.section_name} onChange={(e) => sectionSetValue(s,e)} type="text" className="floating-input" />
                                                {/* <label>Terms & Conditions</label> */}
                                                </div>
                                                {s!==0 ?
                                                    <div className="line-item-del pt-0">
                                                        <a href="#phone" onClick={(e) => removeSection(e, s)} className="close-icn">
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
                                                        </a>
                                                    </div>
                                                    : ''
                                                }
                                                </div>
                                            </div>
                                            <div className="card-body pl-4 pr-4">
                                                    <Editor
                                                        initialValue={data.section_description}
                                                        apiKey={constants.tinyAapiKey}
                                                        init={tinyConfig}
                                                        onEditorChange={(data) => sectionSetValue(s,data)}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                    </div>
                    })}
                    
                    <div className="create-quote-buttons">
                        <button onClick={(e) => setAddTemplateModalShow(true)} className="btn btn-primary">Save as Template</button> <a href="#phone" onClick={(e) => handleAddSectionClick(e)} className="btn btn-primary btn-secondary">Add New Section</a>
                    </div>

                    <div className="row no-gutters-mbl">
                        <div className="col-lg-12">
                        <div className="main-card  create-qoute--cards create-form">
                            <div className="card" id="TermsCondCollapse">
                            <div className="card-header pt-4">
                                <h5 className="">Advance Requirements <small className="d-inline">(Optional)</small></h5>
                                <p className="mt-3"><Link to={VIEW_PROFILE+'#Payment'} className="text-link"><strong>Add your PayPal ID</strong></Link> & collect advance/payments from your customers. Your customer can pay with any credit card or PayPal.<br />
                                The payments will be directly deposited to your PayPal account. There is no additional processing fees. <a href="https://www.paypal.com/us/business/how-paypal-works" rel="noopener noreferrer" target="_blank" >(Don’t have a PayPal account?)</a></p> 
                            </div>
                            <div className="card-body pl-4 pr-4">
                                <div className="d-flex align-items-center deposit-reqr mb-1">
                                    <p className="m-0"><strong>Advance required?</strong></p> 
                                    <div className="form-group mx-4 mb-0">
                                        <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="depositeNo" name="depositReq" onChange={() => setState({ ...state, depositRequired: 0, deposite: 0, depositOnline: 0})} checked={state.depositRequired===0 ? true : false} value="0" className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="depositeNo">No</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="depositeYes" onChange={() => setState({ ...state, depositRequired:1, deposite: '50' })} checked={state.depositRequired===1 ? true : false } value="1" name="depositReq" className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="depositeYes">Yes</label>
                                        </div>
                                    </div>
                                    <div className="deposit_Usd d-flex align-items-center">
                                        <input name="deposite" disabled={state.depositRequired===0 ? true : false} onChange={(e) => setState({...state, deposite: e.target.value, depositCls:'', depositErr: ''})} value={state.deposite} type="number" min="0" className="form-control mr-2" aria-describedby="passwordHelpInline" /> USD
                                        {state.depositErr ? <div className="quoteDepositErr"> {state.depositErr}</div> : ''}
                                    </div>
                                
                                </div>
                                 
                                {state.depositRequired === 1 ? 
                                    <div className="d-flex align-items-center deposit-reqr mb-1 mt-3">
                                    <p className="m-0"><strong>Collect advance online?</strong></p> 
                                    <div className="form-group mx-4 mb-0">
                                        <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="onlineDepositNo" name="depositOnlineReq" onChange={() => setState({ ...state, depositOnline: 0 })} checked={state.depositOnline===0 ? true : false} value="0" className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="onlineDepositNo">No</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="onlineDepositYes" onChange={() => setState({ ...state, depositOnline:1})} checked={state.depositOnline===1 ? true : false } value="1" name="depositOnlineReq" className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="onlineDepositYes">Yes</label>
                                        </div>
                                    </div>
                                </div>
                                : ''}
                                
                                {state.depositOnline === 1 ? 
                                    <>
                                    <div className="d-flex align-items-center deposit-reqr mt-3">
                                        <p className="m-0"><strong>Send payment to </strong></p> 
                                        <div className="form-group mx-4 mb-0">
                                            {paymentDetail && paymentDetail.id ?
                                                <><strong className="merchant-id-class">{paymentDetail.paypal_email}</strong> ({paymentDetail.merchant_id}) </>
                                                :
                                                <div className="field-text"><a className="merchant-id-class" href="#addPaypal" onClick={(e) => {e.preventDefault(); setRedirectPaypal(true) ;saveQuoteData() }}>Add PayPal ID</a></div>
                                            }
                                        </div>
                                    </div> 
                                    {paymentDetail && paymentDetail.id ?
                                        <div className="d-flex align-items-center deposit-reqr mb-4">
                                            <p className="m-0"></p> 
                                            <div className="form-group mx-4 mb-0">
                                            <div className="field-text"><a className="merchant-id-class" href="#addPaypal" onClick={(e) => {e.preventDefault(); setRedirectPaypal(true) ;saveQuoteData() }}>(Change)</a></div>
                                            </div>
                                        </div> 
                                        : ''}
                                    </>
                                : 
                                        ''
                                    }

                                   {state.depositOnline === 0 && state.depositRequired === 1  ? 
                                   <div className="d-flex align-items-center deposit-reqr mb-2">
                                    <p className="m-0"></p>
                                    <div className="form-group mx-4 mb-0">
                                    <p>I just want to send a quote/estimate and collect the advance via other methods (check, cash, online transfer etc.) <br /> or already received a payment.</p>
                                    </div>
                                </div>: ''} 
                            </div>
                            </div>
                        </div>
                        </div>            
                    </div>
                    
                    <div className="row no-gutters-mbl mt-4">
                        <div className="col-lg-12">
                        <div className="main-card  create-qoute--cards">
                            {/* <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#NotesCollapse" aria-expanded="false" aria-controls="NotesCollapse">Internal Notes<img src={setImagePath(ORANGE_ARROW)} alt="" /></button> */}
                            <div className="card">
                            <div className="card-header pt-4">
                                <h5 className="">Internal Notes</h5>
                                <small>This section will not be included the quote and will be visible to only you.</small>
                            </div>
                            <div className="card-body pt-0 pl-4 pr-4">
                                <textarea rows="4" name="internalNotes" value={state.internalNotes} onChange={(e) => setState({...state, internalNotes: e.target.value})} type="text" className="form-control" placeholder="Type or copy notes you would like to keep track of. "></textarea>
                            </div>
                            </div>
                        </div>
                        </div>            
                    </div>
                    
                    
                    </div>
                </section>

                {/* Add Template*/}
                <AddTemplate loader={(data) => setLoader(data)}  
                    openTemplate={addtemplateModalShow} 
                    deposite = {state.deposite}
                    listTemplate={listTemplate}
                    addTemplateInList = {(data) => setListTemplate(data)}
                    itemData= {{line_items: {items: _.reject(lineItems, { 'item_name': "", 'item_description': "", 'item_charges': "", 'item_qty':"", 'item_rate':"" }), item_heading_name: state.itemName, 
                        item_heading_description: state.discription, item_heading_charges: state.charge}, total: amountArr, section: _.reject(sections, { 'section_name': "", 'section_description': "" }), optional_items: {items : _.reject(optinalLineItems, { 'item_name': "", 'item_description': "", 'item_charges': "",'item_qty':"", 'item_rate': ""})}}}
                    closeTemplate={() =>setAddTemplateModalShow(false)}
                />
            </main>
            <Footer />
        </div >
        </>
    );
}

export const AddQuote = withRouter(NewAddQuote)