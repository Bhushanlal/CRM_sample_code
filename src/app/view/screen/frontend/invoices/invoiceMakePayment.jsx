import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import moment from 'moment'
import _ from 'lodash';
import { invoiceMakePayment } from '../../../../duck/invoice/invoice.action';
import { ACCEPT_INVOICE } from "../../../../routing/routeContants";
import { validateInputs } from '../../../../common/validation';
import { PayPalButton } from "react-paypal-button-v2"

export const NewInvoiceMakePayment = props => {

    const dispatch = useDispatch();

    // Add Invoice Accpet
    const [paymentModalShow, setPaymentModalShow] = useState(false);
    const [invoiceDetail, setInvoiceDetail] = useState();
    const [invoiceMakePaymentMessage, setInvoiceMakePaymentMessage] = useState();
    const [invoiceMakePaymentState, setInvoiceMakePaymentState] = useState({
        name: '', nameErr: '', nameCls: '', checkTip: false, tipAmount: 0,
        tipAmountCls: '', tipAmountErr: ''
    })
    const invoiceMakePaymentData = useSelector(state => state.invoice.invoiceMakePaymentData);
    const prevChangeQuoteStatusData = usePrevious({ invoiceMakePaymentData });

    // Save As Invoice Accpet 
    const acceptQuoteDeposit = () => {
        let error = constants.WRONG_INPUT;
        let name = invoiceMakePaymentState.name, nameErr = '', nameCls = '', checkTip = invoiceMakePaymentState.checkTip,
            tipAmount = invoiceMakePaymentState.tipAmount, tipAmountErr = '', tipAmountCls = '', getError = false;

        if (validateInputs('string', name) === 'empty') {
            nameErr = 'Please enter name.';
            nameCls = error
            getError = true;
        } else if (validateInputs('string', name) === false) {
            nameErr = 'Please enter valid name.';
            nameCls = error
            getError = true;
        } else if (name.length > 50) {
            nameErr = 'Please enter maximum 50 characters.';
            nameCls = error
            getError = true;
        }

        if (validateInputs('positiveNumberWithDecimals', tipAmount) === 'empty' && checkTip) {
            tipAmountErr = 'Please enter amount.';
            tipAmountCls = error
            getError = true;
        } else if (validateInputs('positiveNumberWithDecimals', tipAmount) === false && checkTip) {
            tipAmountErr = 'Please enter valid amount.';
            tipAmountCls = error
            getError = true;
        } else if (tipAmount.length > 10 && checkTip) {
            tipAmountErr = 'Please enter maximum 10 number.';
            tipAmountCls = error
            getError = true;
        }


        setInvoiceMakePaymentState({ ...invoiceMakePaymentState, nameCls, nameErr, tipAmountCls, tipAmountErr })

        if (getError === false && nameErr === '' && tipAmountErr === '') {
            let data = {
                id: props.invoiceId, status: 'accept', accept_signature: invoiceMakePaymentState.name,
                amountPaid: checkTip ? parseFloat(props.depositAmount) + parseFloat(tipAmount) : props.depositAmount
            }
            setInvoiceDetail(data)
            if (props.paymentDetail && props.paymentDetail.merchant_id) {
                setPaymentModalShow(true)
                props.loader(true)
            }

        }
    }

    // Open Quote Accpet Modal
    useEffect(() => {
        setInvoiceMakePaymentMessage('')
        setPaymentModalShow(false)
        setInvoiceMakePaymentState({ ...invoiceMakePaymentState, name: '', nameCls: '', nameErr: '', })
    }, [props.invoiceMakePaymentModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.invoiceMakePaymentData !== invoiceMakePaymentData && props.invoiceMakePaymentModal) {
            if (invoiceMakePaymentData && _.has(invoiceMakePaymentData, 'data') && invoiceMakePaymentData.success === true) {
                props.history.push({
                    pathname: ACCEPT_INVOICE,
                    state: { invoiceAcceptState: true, invoiceMessage: 'Thank you, the payment has been processed successfully.' }
                })
            }
            if (invoiceMakePaymentData && _.has(invoiceMakePaymentData, 'message') && invoiceMakePaymentData.success === false) {
                props.loader(false)
                setInvoiceMakePaymentMessage(invoiceMakePaymentData.message)
                setPaymentModalShow(false)
            }
        }
    }, [prevChangeQuoteStatusData, invoiceMakePaymentData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Modal show={props.invoiceMakePaymentModal} onHide={() => props.closeInvoiceMakePaymentModal()} className="modal-md-lg" centered>
                {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                    <Modal.Header className="payment-modal-header" closeButton>
                        <Modal.Title>
                            Make Payment
                        </Modal.Title>
                        <div className="modal-amount">Amount: {invoiceDetail && invoiceDetail.amountPaid} USD</div>
                    </Modal.Header>
                    :
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Make Payment: Invoice {props.invoiceSerialNo}
                        </Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    {invoiceMakePaymentMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{invoiceMakePaymentMessage}</div> : ''}
                    {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                        <div className="form-group col-md-12">
                            <PayPalButton
                                amount={invoiceDetail && invoiceDetail.amountPaid}
                                shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onButtonReady={() => {
                                    props.loader(false)
                                }}
                                onSuccess={(details, data) => {
                                    //console.log("Transaction completed by " + JSON.stringify(details), data, details.payer, details.purchase_units);
                                    props.loader(true)
                                    invoiceDetail.payment_response = JSON.stringify(details);
                                    dispatch(invoiceMakePayment(invoiceDetail))
                                }}
                                onError={(error) => {
                                    props.loader(false)
                                    console.log(error);
                                }}
                                options={{
                                    merchantId: props.paymentDetail.merchant_id,
                                    clientId: constants.PAYPAL_CLIENT_ID,
                                    disableFunding: 'venmo,credit',
                                }}
                                style={{
                                    shape: 'rect',
                                    label: 'pay',
                                }}
                            />
                        </div>
                        :
                        <form>
                            <div className="row mb-4">
                                <div className="col-12 d-flex align-items-center">
                                    <div className="amount-due-sec">Amount Due: ${props.depositAmount}</div>
                                    {props.allowTip === 1 ?
                                        <div className="amountdue-opt d-flex align-items-center">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" checked={invoiceMakePaymentState.checkTip} onChange={(e) => setInvoiceMakePaymentState({ ...invoiceMakePaymentState, checkTip: e.target.checked })} className="custom-control-input" id="customCheck1" />
                                                <label className="custom-control-label mt-0" htmlFor="customCheck1"><strong>Add Tip</strong></label>
                                            </div>
                                            {invoiceMakePaymentState.checkTip ?
                                                <div className="form-inline">
                                                    <div className="form-group">
                                                        <input type="text" name="tipAmount" value={invoiceMakePaymentState.tipAmount} onChange={(e) => setInvoiceMakePaymentState({ ...invoiceMakePaymentState, tipAmount: e.target.value, tipAmountErr: '' })} className="form-control mx-sm-3" />
                                                        <strong>USD</strong>
                                                    </div>
                                                </div>
                                                : ''}
                                            {invoiceMakePaymentState.tipAmountErr ? <div className="quoteDepositErr"> {invoiceMakePaymentState.tipAmountErr}</div> : ''}
                                        </div>
                                        : ''}
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + invoiceMakePaymentState.nameCls}>
                                        <input placeholder="Enter your full name" type="text" name="name" value={invoiceMakePaymentState.name || ''} onChange={(e) => { setInvoiceMakePaymentState({ ...invoiceMakePaymentState, name: e.target.value, nameCls: '', nameErr: '' }); setInvoiceMakePaymentMessage('') }} className="floating-input" />
                                        <label>Electronic Signature </label>
                                        {invoiceMakePaymentState.nameErr ? <span className="errorValidationMessage"> {invoiceMakePaymentState.nameErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <strong>{moment().format('ll')}</strong> (Today’s Date)
                                        </div>
                            </div>
                            <p>By clicking on <strong>‘Submit’</strong> button you are accepting the terms of payment and the signature above.  </p>
                        </form>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                        <button type="button" onClick={() => setPaymentModalShow(false)} className="btn btn-dark">Back</button>
                        :
                        <>
                            <button type="button" className="btn btn-dark" onClick={() => props.closeInvoiceMakePaymentModal()}>Cancel</button>
                            <button type="button" onClick={() => acceptQuoteDeposit()} className="btn btn-primary">Continue with Payment</button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export const InvoiceMakePayment = withRouter(NewInvoiceMakePayment)