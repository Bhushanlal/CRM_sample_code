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
import Swal from 'sweetalert2'

export const NewInvoiceReceived = props => {

    const dispatch = useDispatch();

    // Add Invoice Accpet
    const [invoiceReceiveMessage, setInvoiceReceiveMessage] = useState();
    const [invoiceReceiveState, SetInvoiceReceiveState] = useState({
        name: '', nameErr: '', nameCls: '', 
    })
    const invoiceMakePaymentData = useSelector(state => state.invoice.invoiceMakePaymentData);
    const prevChangeInvoiceStatusData = usePrevious({ invoiceMakePaymentData });

    // Save As Invoice Accpet 
    const acceptInvoice = () => {
        let error = constants.WRONG_INPUT;
        let name = invoiceReceiveState.name, nameErr = '', nameCls = '',  getError = false;

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

        SetInvoiceReceiveState({ ...invoiceReceiveState, nameCls, nameErr })

        if (getError === false && nameErr === '') {
            let data = {
                id: props.invoiceId, status: 'accept', accept_signature: name,
            }
            props.loader(true)
            dispatch(invoiceMakePayment(data))
        }
    }

    // Open Invoice Accpet Modal
    useEffect(() => {
        setInvoiceReceiveMessage('')
        SetInvoiceReceiveState({ ...invoiceReceiveState, name: '', nameCls: '', nameErr: '', })
    }, [props.invoiceMakePaymentModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeInvoiceStatusData && prevChangeInvoiceStatusData.invoiceMakePaymentData !== invoiceMakePaymentData && props.openInvoiceAcceptModal) {
            if (invoiceMakePaymentData && _.has(invoiceMakePaymentData, 'data') && invoiceMakePaymentData.success === true) {
                props.loader(false)
                props.closeInvoiceAcceptModal()
                Swal.fire({
                    title: 'Confirmation',
                    html: 'Thank you for your business. You will recive a copy of this invoice in email. Please let me know if you have any questions.',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    reverseButtons: true,
                    showCloseButton: false,
                    customClass: "mycustom-alert",
                    cancelButtonClass: 'cancel-alert-note',
                }).then((result) => {
                    props.history.push({
                        pathname: ACCEPT_INVOICE,
                        state: { invoiceAcceptState: true, invoiceMessage: 'Invoice accepted successfully' }
                    })
                })
            }
            if (invoiceMakePaymentData && _.has(invoiceMakePaymentData, 'message') && invoiceMakePaymentData.success === false) {
                props.loader(false)
                setInvoiceReceiveMessage(invoiceMakePaymentData.message)
            }
        }
    }, [prevChangeInvoiceStatusData, invoiceMakePaymentData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal show={props.openInvoiceAcceptModal} onHide={() => props.closeInvoiceAcceptModal()}  className="" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                Invoice Received 
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {invoiceReceiveMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{invoiceReceiveMessage}</div> : ''}
                <form>
                    <div className="row">
                        <div className="form-group col-md-8">
                            <div className={"floating-label " + invoiceReceiveState.nameCls}>
                                <input placeholder="Enter your full name" type="text" name="name" value={invoiceReceiveState.name || ''} onChange={(e) =>{ SetInvoiceReceiveState({ ...invoiceReceiveState, name: e.target.value, nameCls: '', nameErr: '' }); setInvoiceReceiveMessage('') }} className="floating-input" />
                                <label>Signature </label>
                                {invoiceReceiveState.nameErr ? <span className="errorValidationMessage"> {invoiceReceiveState.nameErr}</span> : ''}
                            </div>
                        </div>
                        <div className="form-group col-md-4 d-flex align-items-center">
                            <p className="m-0"><strong> {moment().format('ll')}</strong> </p>
                        </div>
                    </div>
                    <p>By clicking on <strong>‘Submit’</strong> button I understand that this electronic signature constitutes a legal signature confirming that I acknowledge and agree to the terms of sevice and payment outlined in the invoice. </p>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-dark" onClick={() => props.closeInvoiceAcceptModal()}>Cancel</button>
                <button type="button" onClick={() => acceptInvoice()} className="btn btn-primary">Submit</button>
            </Modal.Footer>
        </Modal>
    );
}

export const InvoiceAccept = withRouter(NewInvoiceReceived)