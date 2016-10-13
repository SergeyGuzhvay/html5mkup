import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ProductImage from './product-image';

export default class ProductA extends Component {
    onImgLoad(e) {
        let img = e.target;
        img.crossOrigin = 'Anonymous';
        let className = (img.width/img.height > 1) ? 'wide' : 'tall';
        img.className = 'img-responsive ' + className;
    }

    render() {
        const product = this.props.product;
        const pKey = this.props.pKey;
        return (
            <div id={'product' + pKey} key={pKey} className={'product'}>
                <div ref={'prodDescr' + pKey} className="prod-description">
                    <div className="prod-description-icon"></div>
                    <p dangerouslySetInnerHTML={{__html: product.desc}}></p>
                </div>
                <div className="col-xs-3 prod-icon h100">
                    <span className="prod-icon-helper"></span>
                    <ProductImage product={product} onHover={this.props.onHover}/>
                </div>
                <div className="col-xs-9 prod-body h100">
                    <div className="h100">
                        <div className="prod-name">
                            <span>{product.name}</span>
                        </div>
                        <div className="prod-tone">
                            <div className="tone"
                                 onClick={() => {this.props.onSelect(pKey, null)}}
                            >
                                <img src={require('./media/crossbox.png')} alt=""
                                     style={{width: '100%', height: '100%'}}/>
                            </div>

                            {Object.keys(product.tones).map((tKey) => {
                                let tone = product.tones[tKey];
                                return (
                                    <OverlayTrigger key={tKey} placement="top" overlay={<Tooltip
                                        id={tone.name + tKey}>{tone.name}</Tooltip>}>
                                        <div className="tone"
                                             style={{backgroundColor: tone.hexColor}}
                                             onClick={() => {this.props.onSelect(pKey, tKey)}}
                                        >
                                            {this.props.isSelected(pKey, tKey) ?
                                                <div className="tone-active"><div></div><div></div></div> : ''
                                            }
                                        </div>
                                    </OverlayTrigger>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
