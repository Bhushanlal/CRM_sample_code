import React from "react";
import { Loader } from '../../loader/loader'
import { constants } from '../../../../../common/constants'

export const Header = props => {

    return (
        <section>
            <Loader loader={props.loader} />
            <header className="site-header">
                <div className="container">
                    <div className="site-header_wrap">
                        <a href={constants.FRONT_URL} className="navbar-brand">MyBizz<span>Hive</span></a>
                    </div>
                </div>
            </header>
        </section>
    );
}