import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants } from "../../../../common/constants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import { validateInputs } from '../../../../common/validation';
import _ from 'lodash';
import { addService } from '../../../../duck/lead/lead.action';

export const NewAddService = props => {

    const dispatch = useDispatch();
    const serviceTextRef = useRef();

    // Add Service
    const [serviceOptionMessage, setServiceOptionMessage] = useState('');
    const [serviceState, setServiceState] = useState({
        service: '', serviceCls: '', serviceErr: ''
    });
    const addServiceData = useSelector(state => state.lead.addServiceData);
    const prevAddServiceData = usePrevious({ addServiceData });

    

    // Save Service Data
    const saveServiceData = () => {
        let success = '';
        let error = constants.WRONG_INPUT;
        let service = serviceState.service, serviceErr = '', serviceCls = success, getError = false;

        if (validateInputs('required', service) === 'empty') {
            serviceErr = 'Please enter service.';
            serviceCls = error
            getError = true;
        }

        setServiceState({
            ...serviceState, serviceCls, serviceErr
        })

        if (getError === false && serviceErr === '') {
            props.loader(true)
            dispatch(addService({ name: service }))
        }
    }

    // Open Template Modal
    useEffect(() => {
        setServiceState({...serviceState, service: '', serviceCls: '', serviceErr: ''});
        setServiceOptionMessage()
    }, [props.openService]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update Quote Customer and Update Quote Props Manage
    useEffect(() => {
        if (prevAddServiceData && prevAddServiceData.addServiceData !== addServiceData) {
            if (addServiceData && _.has(addServiceData, 'data') && addServiceData.success === true) {
                props.loader(false)
                props.closeService()
                props.addServiceInList({value: addServiceData.data.id, label: addServiceData.data.name })
            }
            if (addServiceData && _.has(addServiceData, 'message') && addServiceData.success === false) {
                props.loader(false)
                setServiceOptionMessage(addServiceData.message)
            }
        }

    }, [prevAddServiceData, addServiceData])// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <Modal show={props.openService} onHide={() => props.closeService(false)} className="" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Service
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {serviceOptionMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceOptionMessage}</div> : ''}
                <p className="p-small"><strong>Note:</strong> This service will automatically be saved for future use. </p>
                <form>
                    <div className={"floating-label " + serviceState.serviceCls}>
                        <textarea ref={serviceTextRef} className="floating-input floating-textarea" name="service" value={serviceState.service || ''} onChange={(e) => setServiceState({...serviceState, service: e.target.value, serviceCls: '', serviceErr: ''})} placeholder="Type service name here"></textarea>
                        <label>Service Name</label>
                        {serviceState.serviceErr ? <span className="errorValidationMessage"> {serviceState.serviceErr}</span> : ''}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-dark" onClick={() => props.closeService(false)}>Cancel</button>
                <button type="button" onClick={() => saveServiceData()} className="btn btn-primary">Add</button>
            </Modal.Footer>
        </Modal>
    );
}

export const AddService = withRouter(NewAddService)