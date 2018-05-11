import React from 'react';

import Alert from './Alert';

export default class Modal extends React.Component {
    constructor() {
        super();
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentWillUnmount() {
        this.textInput = "";
    }
    
    handleChange() {
        this.textInput = document.getElementById('add-input').value;
    }
    
    render() {
        return (
            <div className="row">
                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>Which stock do you wish to add?</h4>
                        <input type="text" onChange={this.handleChange} name="add-input" id="add-input" />
                    </div>
                    <div className="modal-footer">
                        <a onClick={() => this.props.handleAdd(this.textInput)} className="modal-action modal-close waves-effect waves-green btn-flat">Confirm</a>
                        <a className="modal-action modal-close waves-effect waves-green btn-flat">Cancel</a>
                    </div>
                </div>
                <div style={{marginTop: '0px'}}>
                    <Alert error={this.props.error} />
                    <a className="waves-effect waves-light btn modal-trigger" href="#modal1"><i className="material-icons right">timeline</i>Add Stock</a>
                </div>
            </div>
        );
    }
}