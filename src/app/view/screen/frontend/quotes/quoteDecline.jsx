import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants, selectStyle } from "../../../../common/constants";
import { usePrevious, setImagePath} from '../../../../common/custom';
import _ from 'lodash';
import { changeQuoteStatus } from '../../../../duck/quote/quote.action';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { LIST_QUOTES } from "../../../../routing/routeContants";

export const NewQuoteDecline = props => {

    const dispatch = useDispatch();

    // Add Decline
    const [addDeclineMessage, setAddDeclineMessage] = useState();
    const [declineState, setDeclineState] = useState({
        selectReason:'', selectReasonErr:'', selectReasonCls:'',
        reasonOptions: [{ value: "Changed/canceled plans", label: "Changed/canceled plans" }, { value: "Postponed plans, contact again later", label: "Postponed plans, contact again later" },
        { value: "Found a better option", label: "Found a better option" },{ value: "Too expensive", label: "Too expensive" },{ value: "Don’t need the service but can refer to friends/family", label: "Don’t need the service but can refer to friends/family" },]        
    })
    const changeQuoteStatusData = useSelector(state => state.quote.changeQuoteStatusData);
    const prevChangeQuoteStatusData = usePrevious({ changeQuoteStatusData });

    // Save As Decline 
    const declineQuote = () => {
        let selectReasonErr = '', selectReasonCls = '';
     
        if (declineState.selectReason && declineState.selectReason.value ) {
            let data = {id: props.quoteId, status: 'reject', reject_reason:declineState.selectReason.value }
            props.loader(true)
            dispatch(changeQuoteStatus(data))
        }else{
            selectReasonErr = 'Please select reason.'
            selectReasonCls = constants.WRONG_INPUT
            setDeclineState({...declineState,selectReasonErr, selectReasonCls })
        }
    }

    // Open Decline Modal
    useEffect(() => {
        setAddDeclineMessage('')
        setDeclineState({...declineState,  selectReason:'', selectReasonErr:'', selectReasonCls:'',})
    }, [props.openDeclineModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.changeQuoteStatusData !== changeQuoteStatusData && props.openDeclineModal) {
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'data') && changeQuoteStatusData.success === true) {
                props.history.push(LIST_QUOTES)
            }
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'message') && changeQuoteStatusData.success === false) {
                props.loader(false)
                setAddDeclineMessage(changeQuoteStatusData.message)
            }
        }
    }, [prevChangeQuoteStatusData, changeQuoteStatusData])// eslint-disable-line react-hooks/exhaustive-deps


    // Change Decline Data 
    const changeReasonFunctiona = (data) => {
        setDeclineState({...declineState, selectReason:data, selectReasonErr:'', selectReasonCls:''})
        setAddDeclineMessage('')
    }

    return (
        <Modal show={props.openDeclineModal} onHide={() => props.closeDeclineModal()} className="" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Reject Quote
                        <span className="d-block">{props.quoteName}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addDeclineMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addDeclineMessage}</div> : ''}
                    <form>
                        <div className="row">
                            <div className="form-group col-md-12 mb-lg-2">
                                <div className={"floating-label "+declineState.selectReasonCls}>
                                    <Select
                                        styles={selectStyle}
                                        className="floating-select"
                                        components={makeAnimated()}
                                        placeholder="Select Reason"
                                        noOptionsMessage={() => "No results found"}
                                        options={declineState.reasonOptions}
                                        value={declineState.selectReason}
                                        onChange={(data) => changeReasonFunctiona(data)}
                                    />
                                    {declineState.selectReasonErr ? <span className="errorValidationMessage"> {declineState.selectReasonErr}</span> : ''}
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => props.closeDeclineModal()}>Cancel</button>
                    <button type="button" onClick={() => declineQuote()} className="btn btn-primary">Submit</button>
                </Modal.Footer>
            </Modal>
    );
}

export const QuoteDecline = withRouter(NewQuoteDecline)