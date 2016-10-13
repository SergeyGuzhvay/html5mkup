import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Glyphicon, FormControl} from 'react-bootstrap';

export default class LikeButton extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showModal: false
        };
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    save() {
        this.props.onSave(ReactDOM.findDOMNode(this.refs.makeupName).value);
        this.close();
    }

    render() {
        return (
            <div id="save-btn">
                <Glyphicon glyph="floppy-disk" onClick={this.open.bind(this)}/>
                <Modal
                    className="flag-content-modal"
                    show={this.state.showModal}
                    onHide={this.close.bind(this)}
                    bsSize={'sm'}
                >
                    <Modal.Header closeButton>
                        <Modal.Title><strong>Guardar maquillaje</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl ref="makeupName" placeholder="Nombre de tu maquillaje" defaultValue={this.props.name || ''}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="warning" onClick={this.save.bind(this)}>
                            Guardar
                        </Button>
                        {/*<Button onClick={this.close.bind(this)}>*/}
                            {/*Cancel*/}
                        {/*</Button>*/}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}