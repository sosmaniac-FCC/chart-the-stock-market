import React from 'react';
// This does not work well with react-redux
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { v4 } from 'node-uuid';

import Modal from './Modal';

export default class Spread extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log('testing 2: ' + this.props.error);
        
        const spread = this.props.stocks.map((item, i) => {
            return (
                <div className="col s3" key={v4()}>
                    <div className="card" style={{borderRadius: '50px 15px', border: '1px solid gray'}}>
                        <div className="card-content black" style={{borderRadius: '50px 15px', border: '1px solid gray'}}>
                            <div id="icon-represent" style={{backgroundColor: item.color}}></div>
                            <p className="white-text">{item.results[0].symbol}</p>
                            <p id="icon-delete"><i onClick={() => this.props.handleDelete(item.results[0].symbol)} className="material-icons">delete</i></p>
                        </div>
                    </div>
                </div>
            );
        });
        
        if (this.props.loading) {
            return (
                <div>
                    <div className="preloader-wrapper small active" style={{display: "block", margin: "1% auto"}}>
                        <div className="spinner-layer spinner-blue">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div><div className="gap-patch">
                                <div className="circle"></div>
                            </div><div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <Modal handleAdd={this.props.handleAdd} error={this.props.error} />
                </div>
            );
        }
        else if (spread.length !== 0) {
            return (
                <div>
                    <hr />
                    <div id="spread-container" style={{width: "100%"}}>
                        <div className="row">
                            <ReactCSSTransitionGroup transitionName="fade" 
                                transitionAppear={false}
                                transitionAppearTimeout={750}
                                transitionEnter={false}
                                transitionEnterTimeout={750}
                                transitionLeave={false}
                                transitionLeaveTimeout={750}>
                                {spread}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                    <hr style={{marginTop: "-1%"}} />
                    <Modal handleAdd={this.props.handleAdd} error={this.props.error} />
                </div>
            );
        }
        else {
            return (
                <div>
                    <hr />
                        <h6>No stocks are currently being displayed...</h6>
                    <hr />
                    <Modal handleAdd={this.props.handleAdd} error={this.props.error} />
                </div>
            );
        }
    }
}