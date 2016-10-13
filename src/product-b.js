import React, { Component } from 'react';
import ProductImage from './product-image';

export default class ProductB extends Component {
    onImgLoad(e) {
        let img = e.target;
        let className = (img.width/img.height > 1) ? 'wide' : 'tall';
        img.className = 'img-responsive ' + className;
    }

    render() {
        const product = this.props.product;
        const pKey = this.props.pKey;
        return (
            <div id={'product' + pKey} key={pKey} className={'product-multiple'}>
                <div ref={'prodDescr' + pKey} className="prod-description description-multiple">
                    <div className="prod-description-icon"></div>
                    <p dangerouslySetInnerHTML={{__html: product.desc}}></p>
                </div>
                <div className="prod-icon">
                    <span className="prod-icon-helper"></span>
                    <ProductImage product={product} onHover={this.props.onHover}/>
                    <div className="prod-name">
                        <span>{product.name}</span>
                    </div>
                </div>
                <div className="prod-body">
                    <div className="prod-tone-multiple">
                        {Object.keys(product.tones.pairs).map((bKey, index) => {
                            let block = product.tones.pairs[bKey];
                            return (
                                <div key={index} className="prod-tone-block">
                                    <div className="tone"
                                         onClick={() => {this.props.onSelect(pKey, null, bKey)}}
                                    >
                                        <img src={require('./media/crossbox.png')} alt=""
                                             style={{width: '100%', height: '100%'}}/>
                                    </div>
                                    {block.map((color, bIndex) =>
                                        <div
                                            key={bIndex}
                                            className="tone"
                                            style={{backgroundColor: color}}
                                            onClick={() => {this.props.onSelect(pKey, bIndex, bKey)}}
                                        >
                                            {this.props.isSelected(pKey, product.multiple, bKey, bIndex) ?
                                                <div className="tone-active"><div></div><div></div></div> : ''
                                            }
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="tones-multiple-name">
                        {/*{product.tones[product.multiple].name}*/}
                    </div>
                </div>
            </div>
        );
    }
}