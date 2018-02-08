import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Options from './Options';
import Spread from './Spread';
import Visualization from './Visualization';

/* global $ */

import { queryAndAddStock, targetAndRemoveStock, visualizeStocks, updateStore } from '../redux/stockActions';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.visualizeTrigger = this.visualizeTrigger.bind(this);
    }
    
    componentDidMount() {
        $('#modal1').modal();
        
        this.props.socket.on('update', (stocks) => {
            this.props.updateStore(stocks);
        });
    }
    
    componentDidUpdate() {
        $('#modal1').modal();
        
        this.props.socket.on('update', (stocks) => {
            this.props.updateStore(stocks);
        });
    }
    
    handleAdd(query) {
        const nowDate = new Date();
        let yyyy = +nowDate.getFullYear();
        let mm = +nowDate.getMonth() + 1;
        let dd = +nowDate.getDate();
        if (mm - 7 <= 0) {
            yyyy = yyyy - 1;
            mm = 12 - (-1 * (mm - 7));
        }
        const pastDate = new Date(yyyy, mm, dd);
        
        this.props.queryAndAddStock(this.props.stocks, query, pastDate.yyyymmdd(), nowDate.yyyymmdd(), this.props.socket);
    }
    
    handleDelete(target) {
        this.props.targetAndRemoveStock(target, this.props.socket);
    }
    
    visualizeTrigger(node) {
        this.node = node;
        
        this.props.visualizeStocks(node, this.props.stocks);
    }
    
    render() {
        console.log('testing 1: ' + this.props.error);
        
        return (
            <div className="container" id="master-container" style={{margin: "0 auto"}}>
                <div className="center-align">
                    <div id="sub-container" style={{marginLeft: "0", marginRight: "0", width: "100%"}}>
                        <Options />
                        <Visualization visualizeTrigger={this.visualizeTrigger} shouldUpdate={this.props.update} error={this.props.error} />
                    </div>
                    <Spread handleAdd={this.handleAdd} handleDelete={this.handleDelete} stocks={this.props.stocks} error={this.props.error} loading={this.props.loading} />
                    <h6 id="footer">Built with <a href="https://www.barchart.com/ondemand/free-market-data-api">Barchart API</a></h6>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        stocks: state.stocks,
        update: state.update,
        error: state.error,
        emit: state.emit,
        loading: state.loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        queryAndAddStock: queryAndAddStock,
        targetAndRemoveStock: targetAndRemoveStock,
        visualizeStocks: visualizeStocks,
        updateStore: updateStore
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);