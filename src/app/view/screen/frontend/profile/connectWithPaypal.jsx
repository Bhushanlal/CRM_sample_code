import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious, getQueryStringParams } from '../../../../common/custom';
import { connectWithPaypal } from "../../../../duck/profile/profile.action";
import _ from "lodash";
import { Loader } from "../../../component/frontend/loader/loader";

export const ConnectWithPaypal = props => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [urlData, setUrlData] = useState({});
    const connectWithPaypalData = useSelector(state => state.profile.connectWithPaypalData);
    const prevConnectWithPaypalData = usePrevious({ connectWithPaypalData });

    useEffect(() => {
        setLoader(true)
        let data = getQueryStringParams(props.location.search)
        setUrlData(data)
        if(data.error_uri){
            props.history.push('/'+data.state)
        }else{
            dispatch(connectWithPaypal({code:data.code}))
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

     // Profile Detail Props
     useEffect(() => {
        if (prevConnectWithPaypalData && prevConnectWithPaypalData.connectWithPaypalData !== connectWithPaypalData) {
            if (connectWithPaypalData && _.has(connectWithPaypalData, 'data') && connectWithPaypalData.success === true) {
                props.history.push('/'+urlData.state)
            }
            if (connectWithPaypalData && _.has(connectWithPaypalData, 'message') && connectWithPaypalData.success === false) {
                setLoader(false)
                props.history.push({
                    pathname: '/'+urlData.state, 
                    state:{paypalError : connectWithPaypalData.message}
                })
            }
        }
    }, [prevConnectWithPaypalData, connectWithPaypalData,]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="login_signup main-site">
            <Loader loader={loader} />
           
        </div>
    );
}
