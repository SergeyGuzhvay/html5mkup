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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium beatae blanditiis culpa dolorum
                ducimus eaque earum error exercitationem id iusto, laboriosam molestias nisi obcaecati odio quas
                reprehenderit sed sequi vel.
            </div>
        )
    }
}