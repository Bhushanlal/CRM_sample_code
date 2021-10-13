import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import _ from 'lodash';
import { changeQuoteStatus } from '../../../../duck/quote/quote.action';
import { ACCEPT_QUOTE } from "../../../../routing/routeContants";
import { validateInputs } from '../../../../common/validation';
import { PayPalButton } from "react-paypal-button-v2"

export const NewQuoteAcceptDeposit = props => {

    const dispatch = useDispatch();

    // Add Quote Accpet
    const [paymentModalShow, setPaymentModalShow] = useState(false);
    const [quoteDetail, setQuoteDetail] = useState();
    const [addQuoteAcceptDepositMessage, setQuoteAcceptDepositMessage] = useState();
    const [quoteAcceptDepositState, setQuoteAcceptDepositState] = useState({
        name: '', nameErr: '', nameCls: '', amountType: '1',
    })
    const changeQuoteStatusData = useSelector(state => state.quote.changeQuoteStatusData);
    const prevChangeQuoteStatusData = usePrevious({ changeQuoteStatusData });

    // Save As Quote Accpet 
    const acceptQuoteDeposit = () => {
        let error = constants.WRONG_INPUT;
        let name = quoteAcceptDepositState.name, nameErr = '', nameCls = '', getError = false;

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

        setQuoteAcceptDepositState({ ...quoteAcceptDepositState, nameCls, nameErr })

        if (getError === false && nameErr === '') {
            let data = {
                id: props.quoteId, status: 'accept', accept_signatue: quoteAcceptDepositState.name, amountType: quoteAcceptDepositState.amountType, optional_id: (props.optional_id).join(','),
                paymentType: quoteAcceptDepositState.paymentType, amount_deposit: (quoteAcceptDepositState.amountType === '1' ? props.depositAmount : props.total)
            }
            setQuoteDetail(data)
            if (props.paymentDetail && props.paymentDetail.merchant_id) {
                setPaymentModalShow(true)
                props.loader(true)
            }

        }
    }

    // Open Quote Accpet Modal
    useEffect(() => {
        setQuoteAcceptDepositMessage('')
        setPaymentModalShow(false)
        setQuoteAcceptDepositState({ ...quoteAcceptDepositState, name: '', nameCls: '', nameErr: '', amountType: (props.depositAmount===props.total) ? '0' : '1' })
    }, [props.openQuoteAcceptDepositModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.changeQuoteStatusData !== changeQuoteStatusData && props.openQuoteAcceptDepositModal) {
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'data') && changeQuoteStatusData.success === true) {
                props.history.push({
                    pathname: ACCEPT_QUOTE,
                    state: { quoteAcceptState: true, quoteMessage: 'Quote accepted & payment processed successfully.' },
                })
            }
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'message') && changeQuoteStatusData.success === false) {
                props.loader(false)
                setQuoteAcceptDepositMessage(changeQuoteStatusData.message)
                setPaymentModalShow(false)
            }
        }
    }, [prevChangeQuoteStatusData, changeQuoteStatusData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Modal show={props.openQuoteAcceptDepositModal} onHide={() => props.closeQuoteAcceptDepositModal()} className="" centered>
                {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                    <Modal.Header className="payment-modal-header" closeButton>
                        <Modal.Title>
                            Make Payment
                        </Modal.Title>
                        <div className="modal-amount">Amount: {quoteDetail && quoteDetail.amount_deposit} USD</div>
                    </Modal.Header>
                    :
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Accept Quote : Pay Advance
                        </Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    {addQuoteAcceptDepositMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteAcceptDepositMessage}</div> : ''}
                    {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                        <div className="form-group col-md-12">
                            <PayPalButton
                                amount={quoteDetail && quoteDetail.amount_deposit}
                                shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onButtonReady={() => {
                                    props.loader(false)
                                }}
                                onSuccess={(details, data) => {
                                    //console.log("Transaction completed by " + JSON.stringify(details), data, details.payer, details.purchase_units);
                                    props.loader(true)
                                    quoteDetail.payment_response = JSON.stringify(details);
                                    dispatch(changeQuoteStatus(quoteDetail))
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
                            <div className="row mb-3">
                                {props.depositAmount===props.total ?
                                    <h5 className="col mb-1">Full Amount : ${props.total}</h5>
                                    :
                                    <div className="form-group col-md-12">
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="newTemp" onChange={() => setQuoteAcceptDepositState({ ...quoteAcceptDepositState, amountType: '1' })} checked={quoteAcceptDepositState.amountType === '1' ? true : false} name="amountType" className="custom-control-input" value="1" />
                                            <label className="custom-control-label" htmlFor="newTemp">${props.depositAmount} (Deposit) </label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="existingTemp" onChange={() => setQuoteAcceptDepositState({ ...quoteAcceptDepositState, amountType: '0' })} checked={quoteAcceptDepositState.amountType === '0' ? true : false} name="amountType" className="custom-control-input" value="0" />
                                            <label className="custom-control-label" htmlFor="existingTemp">${props.total} (Full Amount)</label>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row">
                                <div className="form-group col-md-8">
                                    <div className={"floating-label " + quoteAcceptDepositState.nameCls}>
                                        <input placeholder="Enter your full name" type="text" name="name" value={quoteAcceptDepositState.name || ''} onChange={(e) => { setQuoteAcceptDepositState({ ...quoteAcceptDepositState, name: e.target.value, nameCls: '', nameErr: '' }); setQuoteAcceptDepositMessage('') }} className="floating-input" />
                                        <label>Electronic Signature </label>
                                        {quoteAcceptDepositState.nameErr ? <span className="errorValidationMessage"> {quoteAcceptDepositState.nameErr}</span> : ''}
                                    </div>
                                </div>
                            </div>
                            <p>By clicking on <strong>‘Continue with Payment’</strong> button you are accepting the terms of payment and that this electronic signature constitutes a legal signature.</p>
                        </form>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {props.paymentDetail && props.paymentDetail.merchant_id && paymentModalShow ?
                        <button type="button" onClick={() => setPaymentModalShow(false)} className="btn btn-dark">Back</button>
                        :
                        <>
                            <button type="button" className="btn btn-dark" onClick={() => props.closeQuoteAcceptDepositModal()}>Cancel</button>
                            <button type="button" onClick={() => acceptQuoteDeposit()} className="btn btn-primary">Continue with Payment</button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export const QuoteAcceptDeposit = withRouter(NewQuoteAcceptDeposit)