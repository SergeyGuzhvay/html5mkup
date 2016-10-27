import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class messageBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: true
        }
    }
    close() {
        this.setState({show: false});
    }

    render() {
        return (
            <div ref="messageBlock" className="message-block" style={{display: this.props.activeModel && this.state.show ? 'block' : 'none'}}>
                <div className="remove-btn" onClick={this.close.bind(this)}>
                    <Glyphicon glyph="remove"/>
                </div>
                Para completar tu look, entra a <a target='blank' href='http://www.natura.com.pe/portal-maquillaje'>www.natura.com.pe/portal-maquillaje</a> y para hacer tu pedido entra a <a target='blank' href='http://scn.natura.com.pe'>scn.natura.com.pe</a>
            </div>
        )
    }
}