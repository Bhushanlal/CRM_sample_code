import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants, selectStyle } from "../../../../common/constants";
import { usePrevious, setImagePath} from '../../../../common/custom';
import { validateInputs } from '../../../../common/validation';
import _ from 'lodash';
import { addQuoteTemplate } from '../../../../duck/quote/quote.action';
import Select from "react-select";
import makeAnimated from "react-select/animated";

export const NewAddTemplate = props => {

    const dispatch = useDispatch();

    // Add Template
    const [addtemplateMessage, setAddTemplateMessage] = useState();
    const [addtemplateState, setAddTemplateState] = useState({
        templateType: '1', name: '', description: '', nameCls: '', nameErr: '',
        selectTemplate:'', selectTemplateErr:'', selectTemplateCls:''
    })
    const addQuoteTemplateData = useSelector(state => state.quote.addQuoteTemplateData);
    const prevAddQuoteTemplateData = usePrevious({ addQuoteTemplateData });

    // Save As Template 
    const saveTemplate = () => {
        let error = constants.WRONG_INPUT;
        let templateType = addtemplateState.templateType, selectTemplate= addtemplateState.selectTemplate, name=addtemplateState.name, description = addtemplateState.description,
            nameErr = '', nameCls = '', selectTemplateErr = '', selectTemplateCls = '', getError = false;
        if(templateType==='1'){
            if (validateInputs('required', name) === 'empty') {
                nameErr = 'Please enter template name.';
                nameCls = error
                getError = true;
            } else if (validateInputs('required', name) === false) {
                nameErr = 'Please enter valid template name.';
                nameCls = error
                getError = true;
            } else if (name.length > 100) {
                nameErr = 'Please enter maximum 100 characters.';
                nameCls = error
                getError = true;
            }
        }else{
            if(selectTemplate===''){
                selectTemplateErr = 'Please Select Template.';
                selectTemplateCls = error
                getError = true;
            }
        }

        setAddTemplateState({...addtemplateState, nameCls, nameErr, selectTemplateErr, selectTemplateCls })

        if (getError === false && nameErr === '' && selectTemplateErr === '' ) {
            let data = {new_template: templateType, quote_body: JSON.stringify(props.itemData), amount_deposit: props.deposite}
            if(templateType==='1'){
                data.name = name;
                data.description = description
            }else{
                data.id = selectTemplate.value;
            }
            props.loader(true)
            dispatch(addQuoteTemplate(data))
        }
    }

    // Open Template Modal
    useEffect(() => {
        setAddTemplateState({...addtemplateState, name: '', description: '', nameCls: '', nameErr: '', selectTemplate:'', selectTemplateErr:'', selectTemplateCls:''})
    }, [props.openTemplate]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update Quote Customer and Update Quote Props Manage
    useEffect(() => {
        if (prevAddQuoteTemplateData && prevAddQuoteTemplateData.addQuoteTemplateData !== addQuoteTemplateData) {
            if (addQuoteTemplateData && _.has(addQuoteTemplateData, 'data') && addQuoteTemplateData.success === true) {
                props.loader(false)
                props.closeTemplate()
                let templateArr = []
                _.map(addQuoteTemplateData.data, (data) => {
                    templateArr.push({value:data.id, label: data.name})
                })
                props.addTemplateInList(templateArr)
            }
            if (addQuoteTemplateData && _.has(addQuoteTemplateData, 'message') && addQuoteTemplateData.success === false) {
                props.loader(false)
                setAddTemplateMessage(addQuoteTemplateData.message)
            }
        }
        
    }, [prevAddQuoteTemplateData,addQuoteTemplateData])// eslint-disable-line react-hooks/exhaustive-deps

    // Change Template Data 
    const changeTemplateFunctiona = (data) => {
        setAddTemplateState({...addtemplateState, selectTemplate:data, selectTemplateErr:'', selectTemplateCls:''})
    }

    return (
        <Modal show={props.openTemplate} onHide={() => props.closeTemplate()} className="" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Save as Template
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addtemplateMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addtemplateMessage}</div> : ''}
                    <form>
                        <div className="row mb-3">
                            <div className="form-group col-md-12">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="newTemp" onChange={() => setAddTemplateState({ ...addtemplateState, templateType: '1',  nameCls: '', nameErr: '', selectTemplate:'', selectTemplateErr:'', selectTemplateCls:'' })} checked={addtemplateState.templateType === '1' ? true : false} name="templateType" className="custom-control-input" value="1" />
                                    <label className="custom-control-label" htmlFor="newTemp">Create New </label>
                                </div>
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="existingTemp" onChange={() => setAddTemplateState({ ...addtemplateState, templateType: '0',  nameCls: '', nameErr: '', selectTemplate:'', selectTemplateErr:'', selectTemplateCls:'' })} checked={addtemplateState.templateType === '0' ? true : false} name="templateType" className="custom-control-input" value="0" />
                                    <label className="custom-control-label" htmlFor="existingTemp">Update Existing</label>
                                </div>
                            </div>
                        </div>
                        {addtemplateState.templateType === '1'
                            ?
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + addtemplateState.nameCls}>
                                        <input placeholder="Template Name" type="text" name="name" value={addtemplateState.name || ''} onChange={(e) =>{ setAddTemplateState({ ...addtemplateState, name: e.target.value, nameCls: '', nameErr: '' }); setAddTemplateMessage('') }} className="floating-input" />
                                        <label>Template Name </label>
                                        {addtemplateState.nameErr ? <span className="errorValidationMessage"> {addtemplateState.nameErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="floating-label">
                                        <textarea placeholder="Description (Optional)" name="description" value={addtemplateState.description || ''} onChange={(e) => { setAddTemplateState({ ...addtemplateState, description: e.target.value }); setAddTemplateMessage('') }} className="floating-input" ></textarea>
                                        <label>Description (Optional)</label>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="row">
                                        <div className="form-group col-md-6 mb-lg-2">
                                            <div className="floating-label">
                                                <Select
                                                    styles={selectStyle}
                                                    className="floating-select"
                                                    components={makeAnimated()}
                                                    placeholder="Select Template"
                                                    options={props.listTemplate}
                                                    value={addtemplateState.selectTemplate}
                                                    onChange={(data) => changeTemplateFunctiona(data)}
                                                />
                                                {addtemplateState.selectTemplateErr ? <span className="errorValidationMessage"> {addtemplateState.selectTemplateErr}</span> : ''}
                                            </div>
                                        </div>
                                    </div>
                            }
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => props.closeTemplate()}>Cancel</button>
                    <button type="button" onClick={() => saveTemplate()} className="btn btn-primary">Save</button>
                </Modal.Footer>
            </Modal>
    );
}

export const AddTemplate = withRouter(NewAddTemplate)