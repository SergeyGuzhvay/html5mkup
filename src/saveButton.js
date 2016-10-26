import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Glyphicon, FormControl} from 'react-bootstrap';
import { ShareButtons, generateShareIcon } from 'react-share';

const {
    FacebookShareButton,
    TwitterShareButton,
    GooglePlusShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');

export default class SaveButton extends Component {
    constructor (props) {
        super(props);

        this.timeouts = [];

        this.state = {
            showSaved: false,
            showShare: false,
            title: '',
            url: ''
        };
    }

    share() {
        this.setState({showShare: true});
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.showModal) {
           this.timeouts.push(setTimeout(() => {
                this.setState({
                    showSaved: false,
                    showShare: false,
                    title: '',
                    url: ''
                })
            }, 300));
        }
    }
    componentWillMount() {
        this.timeouts = [];
    }

    componentWillUnmount() {
        this.timeouts.forEach(t => clearTimeout(t));
    }

    open() {
        this.setState({
            showModal: true,
            showSaved: false,
            showShare: false
        }, () => {
            this.props.onOpen();
        });
    }

    save() {
        this.props.onSave(ReactDOM.findDOMNode(this.refs.makeupName).value, (makeupName, makeupKey) => {
            this.setState({showSaved: true});
            this.props.onShare(makeupName, makeupKey, (title, url) => {
                this.setState({title, url});
            });
        });
    }

    render() {
        return (
            <div id="save-btn">
                <Glyphicon glyph="floppy-disk" onClick={this.open.bind(this)}/>
                {this.state.showShare ?
                    <Modal
                        className="flag-content-modal"
                        show={this.props.showModal}
                        onHide={this.props.onClose}
                        bsSize={'sm'}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title><strong>Compartir mi maquillaje</strong></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.title && this.state.url ?
                                <div className="share-buttons">
                                    <FacebookShareButton title={this.state.title} url={this.state.url}>
                                        <FacebookIcon size={48} round={false}/>
                                    </FacebookShareButton>
                                    <GooglePlusShareButton title={this.state.title} url={this.state.url}>
                                        <TwitterIcon size={48} round={false}/>
                                    </GooglePlusShareButton>
                                    <TwitterShareButton title={this.state.title} url={this.state.url}>
                                        <GooglePlusIcon size={48} round={false}/>
                                    </TwitterShareButton>
                                </div>
                                :
                                <div className="share-buttons">
                                    <div className="loading-icon sharing-modal-loading"></div>
                                </div>
                            }
                        </Modal.Body>
                    </Modal>
                    :
                    <Modal
                        className="flag-content-modal"
                        show={this.props.showModal}
                        onHide={this.props.onClose}
                        bsSize={'sm'}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title><strong>Guardar maquillaje</strong></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.props.getSelectedTypes().length ?
                                this.state.showSaved ?
                                    <p>Tu maquillaje fue guardado... Ya lo puedes compartir</p>
                                    :
                                    <FormControl ref="makeupName" placeholder="Nombre de tu maquillaje" defaultValue={this.props.name || ''}/>
                                :
                                <span style={{color: 'red'}}>Debes aplicar como mínimo un producto a tu maquillaje</span>
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            {this.props.getSelectedTypes().length ?
                                this.state.showSaved ?
                                    <Button bsStyle="primary" onClick={this.share.bind(this)}>
                                        ¡Compartir!
                                    </Button>
                                    :
                                    <Button bsStyle="warning" onClick={this.save.bind(this)}>
                                        Guardar
                                    </Button>
                                :
                                null
                            }
                            <Button onClick={this.props.onClose}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }
            </div>
        );
    }
}