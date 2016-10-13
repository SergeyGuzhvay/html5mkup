import React, { Component } from 'react';
import ProductA from './product-a';
import ProductB from './product-b';

export default class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: {
                face: {product: '', tone: ''},
                eyes: {product: '', tone: ''},
                lips: {product: '', tone: ''},
                multiple: {product: '', block: '', tone: ''}
            }
        }
    }


    onToneSelect(product, tone, block) {
        if (this.props.onSelect) this.props.onSelect(product, tone, block);
    }

    isSelected(pKey, tKey, bKey, bIndex) {
        let product = this.props.products[pKey];
        if (!product) return;
        let s = this.props.selected[product.class];
        return s && s.product === pKey && (s.pairs ? s.tone === product.tones.key && s.pairs[bKey] === bIndex : s.tone === tKey);
    }

    render() {
        const products = this.props.products;
        if (!products || !Object.keys(products).length) return null;
        let productsKeys = Object.keys(products);
        if (this.props.type === 'ojos') productsKeys = productsKeys.sort((a, b) => {
            if (products[a].class === this.props.m && products[b].class !== this.props.m) return -1;
            if (products[a].class !== this.props.m && products[b].class === this.props.m) return 1;
            return 0;
        });
        return (
            <div className="product-wrap">
                {productsKeys.map((pKey, index) => {
                    let product = products[pKey];
                    return (
                        product.class !== this.props.m ?
                            <ProductA key={index} product={product} pKey={pKey} onHover={this.props.onHover} onSelect={this.onToneSelect.bind(this)} isSelected={this.isSelected.bind(this)} />
                            :
                            <ProductB key={index} product={product} pKey={pKey} onHover={this.props.onHover} onSelect={this.onToneSelect.bind(this)} isSelected={this.isSelected.bind(this)} />
                    )
                })}
            </div>
        );
    }
}
