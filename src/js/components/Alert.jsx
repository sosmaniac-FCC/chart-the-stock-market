import React from 'react';

export default class Alert extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        console.log('testing 4: ' + this.props.error);
        
        if (this.props.error != null) {
            return (
                <div className="row" style={{margin: '0'}}>
                    <div id="card-alert" className="card red lighten-5 col s6 push-s3">
                        <div className="card-content red-text">
                            <p style={{display: 'block', width: '100%' , whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                {this.props.error} <span data-dismiss="alert" className="material-icons right">warning</span>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}