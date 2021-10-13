import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath} from '../../../../common/custom';
import _ from 'lodash';
import { addQuote } from '../../../../duck/quote/quote.action';
import { ADD_QUOTE_BASE } from "../../../../routing/routeContants";
import { validateInputs } from '../../../../common/validation';

export const NewQuoteAdd = props => {

    const dispatch = useDispatch();

    // Add Quote Add
    const [addQuoteMessage, setAddQuoteMessage] = useState();
    const [quoteState, setQuoteState] = useState({
        quoteName:'', quoteNameErr:'', quoteNameCls:'',
    })
    const addQuoteData = useSelector(state => state.quote.addQuoteData);
    const prevAddQuoteData = usePrevious({ addQuoteData });

    // Save As Quote Add 
    const acceptQuote = () => {
        let error = constants.WRONG_INPUT;
        let quoteName=quoteState.quoteName, quoteNameErr = '', quoteNameCls = '',getError = false;
       
        if (validateInputs('string', quoteName) === 'empty') {
            quoteNameErr = 'Please enter quote name.';
            quoteNameCls = error
            getError = true;
        } else if (validateInputs('string', quoteName) === false) {
            quoteNameErr = 'Please enter valid quote name.';
            quoteNameCls = error
            getError = true;
        } else if (quoteName.length > 50) {
            quoteNameErr = 'Please enter maximum 50 characters.';
            quoteNameCls = error
            getError = true;
        }

        setQuoteState({...quoteState, quoteNameCls, quoteNameErr,  })

        if (getError === false && quoteNameErr === ''  ) {
            let data = {name : quoteName, contact_id: props.contactId, lead_id: props.leadId, new_contact: '0'}
            if(props.service_type_id!==''){
                data.service_type_id = props.service_type_id
            }
            props.loader(true)
            dispatch(addQuote(data))
        }
    }

    // Open Quote Add Modal
    useEffect(() => {
        setAddQuoteMessage('')
        setQuoteState({...quoteState, quoteName: props.leadName,  quoteNameCls: '', quoteNameErr: '', })
    }, [props.openAddQuoteModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevAddQuoteData && prevAddQuoteData.addQuoteData !== addQuoteData && props.openAddQuoteModal) {
            if (addQuoteData && _.has(addQuoteData, 'data') && addQuoteData.success === true) {
                props.history.push(ADD_QUOTE_BASE+addQuoteData.data.id)
            }
            if (addQuoteData && _.has(addQuoteData, 'message') && addQuoteData.success === false) {
                props.loader(false)
                setAddQuoteMessage(addQuoteData.message)
            }
        }
    }, [prevAddQuoteData, addQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal show={props.openAddQuoteModal} onHide={() => props.closeAddQuoteModal()}  className="" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                        Create New Quote
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {addQuoteMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteMessage}</div> : ''}
                            <form>
                                <div className="form-group col-md-12">
                                    <div className={"floating-label " + quoteState.quoteNameCls}>
                                        <input placeholder="Event, Service, Customer name etc." type="text" name="quoteName" value={quoteState.quoteName || ''} onChange={(e) => setQuoteState({...quoteState, quoteName: e.target.value, quoteNameCls: '', quoteNameErr: ''})} className="floating-input" />
                                        <label>Quote Name *</label>
                                        {quoteState.quoteNameErr ? <span className="errorValidationMessage"> {quoteState.quoteNameErr}</span> : ''}
                                    </div>
                                </div>
                            </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => props.closeAddQuoteModal()}>Cancel</button>
                    <button type="button" onClick={() => acceptQuote()} className="btn btn-primary">Continue</button>
                </Modal.Footer>
            </Modal>
    );
}

export const QuoteAdd = withRouter(NewQuoteAdd)