import React from 'react';

export default class Visualization extends React.Component {
    constructor() {
        super();
        
        this.handleResize = this.handleResize.bind(this);
    }
    
    handleResize() {
        this.props.visualizeTrigger(this.node);
    }
    
    componentDidUpdate() {
        if (this.props.shouldUpdate) {
            this.props.visualizeTrigger(this.node);
        }
        
        window.addEventListener('resize', this.handleResize);
    }
    
    componentDidMount() {
        if (this.props.shouldUpdate) {
            this.props.visualizeTrigger(this.node);
        }
        
        window.addEventListener('resize', this.handleResize);
    }
    
    render() {
        return <svg style={{marginLeft: "0", marginRight: "0", width: "100%"}} id="d3-node" ref={(node) => {this.node = node}}></svg>;
    }
}