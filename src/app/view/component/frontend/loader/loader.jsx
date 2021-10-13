import React from "react";
import LOADER from '../../../../assets/images/ring-loader.svg'
import { setImagePath } from '../../../../common/custom'

export const Loader = props => {
  return (
    <>
      {
        props.loader === true ?
          <>
            <div className="site-loader">
              <div className="indeterminate">
                {/* <div className="payment-processing">The payment is processing. please do not refresh the page.</div> */}
                <img src={setImagePath(LOADER)} alt="" /></div>
            </div>
          </>
          : ''
      }
    </>
  );
}

