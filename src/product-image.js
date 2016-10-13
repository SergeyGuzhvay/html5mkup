import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ProductImage extends Component {

    componentDidMount(){
        this.updateNode(this.props.product.icon);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.product !== this.props.product) {
            this.updateNode(nextProps.product.icon);
        }
    }

    componentWillUnmount(){
        this.updateNode(null);
    }

    updateNode(node){
        let myNode = ReactDOM.findDOMNode(this);
        for (var i=0; i<myNode.children.length; i++) {
            myNode.removeChild(myNode.children[i]);
        }

        if (node) {
            myNode.appendChild(node.cloneNode(false));
        }
    }

    onHover(bool, e) {
        if (this.props.onHover)
            this.props.onHover(this.props.product.key, bool, e);
    }

    render(){
        return <div onMouseEnter={this.onHover.bind(this, true)} onMouseLeave={this.onHover.bind(this, false)} style={{display: 'inline-block'}} />
    }
}