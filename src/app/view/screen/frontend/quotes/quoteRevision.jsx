import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath} from '../../../../common/custom';
import _ from 'lodash';
import { changeQuoteStatus } from '../../../../duck/quote/quote.action';
import { LIST_QUOTES } from "../../../../routing/routeContants";
import { validateInputs } from '../../../../common/validation';

export const NewQuoteRevision = props => {

    const dispatch = useDispatch();

    // Add Quote Revision
    const [addQuoteRevisionMessage, setQuoteRevisionMessage] = useState();
    const [quoteRevisionState, setQuoteRevisionState] = useState({
        comment:'', commentErr:'', commentCls:'',
    })
    const changeQuoteStatusData = useSelector(state => state.quote.changeQuoteStatusData);
    const prevChangeQuoteStatusData = usePrevious({ changeQuoteStatusData });

    // Save As Quote Revision 
    const acceptQuote = () => {
        let error = constants.WRONG_INPUT;
        let comment=quoteRevisionState.comment, commentErr = '', commentCls = '',getError = false;
       
        if (validateInputs('string', comment) === 'empty') {
            commentErr = 'Please enter comment.';
            commentCls = error
            getError = true;
        } else if (validateInputs('string', comment) === false) {
            commentErr = 'Please enter valid comment.';
            commentCls = error
            getError = true;
        } 

        setQuoteRevisionState({...quoteRevisionState, commentCls, commentErr,  })

        if (getError === false && commentErr === ''  ) {
            let data = {id: props.quoteId, status: 'revision', revision:quoteRevisionState.comment }
            props.loader(true)
            dispatch(changeQuoteStatus(data))
        }
    }

    // Open Quote Revision Modal
    useEffect(() => {
        setQuoteRevisionMessage('')
        setQuoteRevisionState({...quoteRevisionState, comment: '',  commentCls: '', commentErr: '', })
    }, [props.openQuoteRevisionModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.changeQuoteStatusData !== changeQuoteStatusData && props.openQuoteRevisionModal) {
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'data') && changeQuoteStatusData.success === true) {
                props.history.push(LIST_QUOTES)
            }
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'message') && changeQuoteStatusData.success === false) {
                props.loader(false)
                setQuoteRevisionMessage(changeQuoteStatusData.message)
            }
        }
    }, [prevChangeQuoteStatusData, changeQuoteStatusData])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal show={props.openQuoteRevisionModal} onHide={() => props.closeQuoteRevisionModal()} className="" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                    Request Quote Revision <br/>
                    <span className="d-block">{props.quoteName}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addQuoteRevisionMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteRevisionMessage}</div> : ''}
                    <form>
                        <div className={"floating-label " + quoteRevisionState.commentCls}>
                            <textarea className="floating-input floating-textarea" name="comment" value={quoteRevisionState.comment} onChange={(e) => setQuoteRevisionState({ ...quoteRevisionState, comment: e.target.value, commentErr: '', commentCls: '' })} placeholder="Enter comments"></textarea>
                            <label>Comment</label>
                            {quoteRevisionState.commentErr ? <span className="errorValidationMessage"> {quoteRevisionState.commentErr}</span> : ''}
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => props.closeQuoteRevisionModal()}>Cancel</button>
                    <button type="button" onClick={() => acceptQuote()} className="btn btn-primary">Submit</button>
                </Modal.Footer>
            </Modal>
    );
}

export const QuoteRevision = withRouter(NewQuoteRevision)