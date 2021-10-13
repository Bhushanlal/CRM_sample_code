import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { usePrevious } from '../../../../common/custom';
import { userLoginStatus } from '../../../../duck/dashboard/dashboard.action';
import _ from "lodash";
import { getUserDetails, setUserDetails } from '../../../../storage/user';


export const NewWelcomePage = props => {

    const dispatch = useDispatch();
    const loginStatusData = useSelector(state => state.dashboard.loginStatusData);
    const prevLoginStatusData = usePrevious({ loginStatusData });

    const closedWelcomeModal = () => {
        props.loader(true)
        dispatch(userLoginStatus())
    }

    // List Business Snapshot Data 
    useEffect(() => {
        if (prevLoginStatusData && prevLoginStatusData.loginStatusData !== loginStatusData) {
            if (loginStatusData && _.has(loginStatusData, 'data') && loginStatusData.success === true) {
                let userData = getUserDetails()
                userData.welcome = 1
                setUserDetails(userData)
                props.loader(false)
                props.closeWelcomeModal()
            }
            if (loginStatusData && _.has(loginStatusData, 'message') && loginStatusData.success === false) {
                props.loader(false)
            }
        }

    }, [prevLoginStatusData, loginStatusData ]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Modal show={props.welcomeModal} onHide={() => closedWelcomeModal()} id="welcome-screen"  size="lg">
                <Modal.Body className="text-center">
                    <div className="modal-header p-0">
                        <button type="button" className="close" onClick={() => closedWelcomeModal()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <svg className="wlcm-svg1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 767 59" style={{"enableBackground":"new 0 0 767 59"}} xmlSpace="preserve">
                        <path fill="#D8F3F3" d="M0.1,55.7c29.8-1.6,59.7-4.1,89.5-7.7c75.3-9.1,150.5-24.7,225.8-20.8s150.5,27.2,225.8,31.1
                        c75.3,3.9,150.5-11.7,188.2-19.5l37.6-7.8V0h-37.6c-37.6,0-112.9,0-188.2,0S390.7,0,315.4,0S164.9,0,89.6,0C59.8,0,29.9,0,0.1,0
                        L0.1,55.7z"/>
                    </svg>
                    <h1>Welcome to MyBizz<span>Hive</span></h1>
                    <h4>One stop solution to manage your business online</h4>
                    <h3>We have added sample data and tasks to help you get started.</h3>

                    <div className="row">
                        <div className="col-lg-4 mb-5">
                            <div className="welcome-points">
                                <span>1</span>
                                <p>Use <strong>sample data</strong> to explore and understand key features</p>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-5">
                            <div className="welcome-points">
                                <span>2</span>
                                <p>Complete the steps outlined in <strong>Tasks section</strong> on the dashabord</p>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-5">
                            <div className="welcome-points">
                                <span>3</span>
                                <p><strong>Delete</strong> the sample data and tasks when ready</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-5"><button type="button" onClick={() => closedWelcomeModal()} className="btn btn-primary">Continue</button></div>
                </Modal.Body>
                <svg className="wlcm-svg2" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 801 247" style={{"enableBackground":"new 0 0 801 247"}} xmlSpace="preserve">
                    <path fill="#D8F3F3" d="M0,6.5C106.7,8.9,213.3,22.1,320,46c160.3,36,320.7,96.4,481,88.8l0,112.1c-160.3,0-320.7,0-481,0
                    c-106.7,0-213.3,0-320,0L0,6.5z"/>
                </svg>    
            </Modal>
        </>
    );
}

export const Welcome = withRouter(NewWelcomePage)