import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath} from '../../../../common/custom';
import _ from 'lodash';
import { changeQuoteStatus } from '../../../../duck/quote/quote.action';
import { ACCEPT_QUOTE } from "../../../../routing/routeContants";
import moment from 'moment'
import { validateInputs } from '../../../../common/validation';

export const NewQuoteAccept = props => {

    const dispatch = useDispatch();

    // Add Quote Accpet
    const [addQuoteAcceptMessage, setQuoteAcceptMessage] = useState();
    const [quoteAcceptState, setQuoteAcceptState] = useState({
        name:'', nameErr:'', nameCls:'',
    })
    const changeQuoteStatusData = useSelector(state => state.quote.changeQuoteStatusData);
    const prevChangeQuoteStatusData = usePrevious({ changeQuoteStatusData });

    // Save As Quote Accpet 
    const acceptQuote = () => {
        let error = constants.WRONG_INPUT;
        let name=quoteAcceptState.name, nameErr = '', nameCls = '',getError = false;
       
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

        setQuoteAcceptState({...quoteAcceptState, nameCls, nameErr,  })

        if (getError === false && nameErr === ''  ) {
            let data = {id: props.quoteId, status: 'accept', accept_signatue:quoteAcceptState.name, optional_id: (props.optional_id).join(',') }
            props.loader(true)
            dispatch(changeQuoteStatus(data))
        }
    }

    // Open Quote Accpet Modal
    useEffect(() => {
        setQuoteAcceptMessage('')
        setQuoteAcceptState({...quoteAcceptState, name: '',  nameCls: '', nameErr: '', })
    }, [props.openQuoteAcceptModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.changeQuoteStatusData !== changeQuoteStatusData && props.openQuoteAcceptModal) {
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'data') && changeQuoteStatusData.success === true) {
                props.history.push({
                    pathname: ACCEPT_QUOTE, 
                    state:{quoteAcceptState : true, quoteMessage : 'Quote accepted successfully.'}
                })
            }
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'message') && changeQuoteStatusData.success === false) {
                props.loader(false)
                setQuoteAcceptMessage(changeQuoteStatusData.message)
            }
        }
    }, [prevChangeQuoteStatusData, changeQuoteStatusData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal show={props.openQuoteAcceptModal} onHide={() => props.closeQuoteAcceptModal()}  className="" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Accept Quote <br/>
                        <span className="d-block">{props.quoteName}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addQuoteAcceptMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteAcceptMessage}</div> : ''}
                    <form>
                        <div className="row">
                            <div className="form-group col-md-8">
                                <div className={"floating-label " + quoteAcceptState.nameCls}>
                                    <input placeholder="Enter your full name" type="text" name="name" value={quoteAcceptState.name || ''} onChange={(e) =>{ setQuoteAcceptState({ ...quoteAcceptState, name: e.target.value, nameCls: '', nameErr: '' }); setQuoteAcceptMessage('') }} className="floating-input" />
                                    <label>Signature </label>
                                    {quoteAcceptState.nameErr ? <span className="errorValidationMessage"> {quoteAcceptState.nameErr}</span> : ''}
                                </div>
                            </div>
                            <div className="form-group col-md-4 d-flex align-items-center">
                                <p className="m-0"><strong> {moment().format('ll')}</strong> </p>
                            </div>
                        </div>
                       <p>By clicking on <strong>‘Submit’</strong> button I understand that this electronic signature constitutes a legal signature confirming that I acknowledge and agree to the terms of sevice and payment outlined in the quote. </p>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => props.closeQuoteAcceptModal()}>Cancel</button>
                    <button type="button" onClick={() => acceptQuote()} className="btn btn-primary">Submit</button>
                </Modal.Footer>
            </Modal>
    );
}

export const QuoteAccept = withRouter(NewQuoteAccept)