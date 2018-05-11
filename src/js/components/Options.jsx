import React from 'react';

export default class Options extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return (
            <nav className="grey darken-3" style={{marginLeft: "0", marginRight: "0", width: "100%"}}>
                <div className="nav-wrapper" id="master-navbar" style={{marginLeft: "0", marginRight: "0", width: "100%"}}>
                    <a className="brand-logo-custom">
                        <i className="material-icons left">trending_up</i>The Stock Market<i className="material-icons right">trending_down</i>
                    </a>
                    <h6 className="left hide-on-small-only" style={{marginLeft: "10px"}}>Coded by John Simmons</h6>
                </div>
            </nav>
        );
    }
}