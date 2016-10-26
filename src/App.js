import React, { Component } from 'react';
import { Col, Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import Base from './js/rebase';
import Products from './products';
import Gallery from './gallery';
import SaveButton from './saveButton';
import ProductImage from './product-image';
import { updateElements, resetCompareSlider, downloadImage, coloring, dataURLtoBlob } from './js/script';
import { updateJq } from './js/jquery-script';


export default class App extends Component {
    constructor(props) {
        super(props);

        this.storageRef = Base.storage().ref();
        this.makeupsRef = Base.database().ref('makeups');
        this.descriptionTimer = null;

        this.menuButtons = [
            {name: 'Rostro', size: 2},
            {name: 'Ojos', size: 2},
            {name: 'Labios', size: 2},
            // {name: 'Looks Natura', size: 3},
            {name: 'Mi Galería', size: 6}

        ];

        this.SelectedProduct = function () {
            this.product = null;
            this.tone = null;
            this.pairs = null;
        };

        this.previewButtons = [
            {
                name: 'Descargar',
                size: 3,
                action: () => {
                    this.setState({previewActiveBtn: 0}, () => {
                        downloadImage();
                    });
                }
            },
            {
                name: 'Antes/Después',
                size: 3,
                action: () => {
                    this.setState({previewActiveBtn: this.state.previewActiveBtn === 2 ? 0 : 2}, resetCompareSlider);
                }
            },
            {
                name: 'Compartir',
                size: 2,
                action: () => {
                    this.openModal();
                    // console.log(this.state);
                    // console.log(JSON.stringify(this.state.selected));
                }
            },
            {
                name: '¿Qué estoy usando?',
                size: 4,
                action: () => {
                    this.setState({previewActiveBtn: this.state.previewActiveBtn === 4 ? 0 : 4});
                }
            }
        ];

        this.multipleClass = '';

        this.state = {
            showModal: false,
            activeTab: null,
            previewActiveBtn: 0,
            activeMakeup: null,
            products: null,
            user: null,
            models: [],
            activeModel: null,
            makeups: null,
            selected: {}
        };

    }
    onShare(name, key, callback) {
        downloadImage(this.uploadImage.bind(this, ...arguments));
    }

    uploadImage(name, key, callback, dataUrl) {
        let storageRef = Base.storage().ref(),
            imagesRef = storageRef.child('user-makeups'),
            fileName = `${this.state.user.key}-${key}.jpg`,
            imageRef = imagesRef.child(fileName);

        imageRef.put(dataURLtoBlob(dataUrl)).then(snapshot => {
            imageRef.getDownloadURL().then(function(imageUrl) {
                let url = 'http://natura-makeup.azurewebsites.net/' + btoa(JSON.stringify({image: imageUrl , name: name}));
                if (typeof callback === 'function') callback(name, url);
            }).catch(function(error) {
                console.warn(error);
            });
        });

    }
    
    goHome() {
        this.refs.modelImg.src = '';
        this.clearAll();
        let selected = {};
        Object.keys(this.state.selected).forEach(key => selected[key] = new this.SelectedProduct());

        this.setState({
            activeTab: null,
            previewActiveBtn: 0,
            activeMakeup: null,
            activeModel: null,
            selected
        });
        updateJq();
    }

    filterProducts(type) {
        if (!this.state.products) return {};
        let products = {};
        Object.keys(this.state.products).forEach((key, index) => {
            if (this.state.products[key].type === type)
                products[key] = this.state.products[key];
        });
        return products;
    }

    onImgLoad(e) {
        let img = e.target;
        let className = (img.width/img.height > 1) ? 'wide' : 'tall';
        img.className = 'img-responsive ' + className;
    }

    getURL(path) {
        return 'https://firebasestorage.googleapis.com/v0/b/natura-f3d43.appspot.com/o/' + path.replace(/\//g,'%2F') + '?alt=media';
    }

    getModeMask(name, callback) {
        this.storageRef
            .child(`Models/${this.state.activeModel}/${name}.png`)
            .getDownloadURL()
            .then(callback)
            .catch(error => console.log(error));
    }

    getProductImage(name, callback) {
        this.storageRef
            .child(`products/${name}.png`)
            .getDownloadURL()
            .then(callback)
            .catch(error => console.log(error));
    }

    onTabChange(tab) {
        // if (this.state.activeModel === null) return;
        this.setState({activeTab: tab}, () => {
            updateElements();
            // updateJq();
        });
    }

    selectModel(model, callback) {
        this.setState({activeModel: model, activeTab: 0}, () => {
            this.loadProducts(callback || null);
            this.refs.modelImg.crossOrigin = 'Anonymous';
            this.refs.modelImg.src = this.getURL(`Models/${model}/Face.jpg`);
            updateJq();
        })
    }

    clearAll() {
        let selected = this.state.selected;
        Object.keys(this.state.selected).forEach(c => {
            selected[c] = new this.SelectedProduct();
            if (c === this.multipleClass) {
                this.refs[this.multipleClass + 'A'].src = '';
                this.refs[this.multipleClass + 'B'].src = '';
                this.refs[this.multipleClass + 'C'].src = '';
            }
            else
                this.refs[c].src = '';
        });
        // this.refs.additionalMask.src = '';
        this.setState({selected, activeMakeup: null});
    }

    onScroll() {
        if (this.descriptionTimer !== null) {
            let descriptions = document.getElementsByClassName('prod-description');
            for (let n in descriptions) {
                if (descriptions.hasOwnProperty(n)) {
                    descriptions[n].style.display = 'none';
                }
            }
            clearTimeout(this.descriptionTimer);
            this.descriptionTimer = null;
        }
    }

    onToneSelect(pKey, tKey, bKey) {
        let product = this.state.products[pKey];
        if (!product) return console.log('Product selection error');
        let selected = this.state.selected;
        if (product.class === this.multipleClass) {
            let tone = product.tones;
            let blocks = tone.pairs;
            let color = bKey && bKey !== -1 ? blocks[bKey][tKey] : '';
            if (selected[this.multipleClass].product === pKey) {
                selected[this.multipleClass].pairs[bKey] = tKey;
            }
            else {
                selected[this.multipleClass].product = pKey;
                selected[this.multipleClass].tone = product.tones.key;
                selected[this.multipleClass].pairs = {};
                selected[this.multipleClass].pairs[bKey] = tKey;
                this.refs[this.multipleClass + 'A'].src = '';
                this.refs[this.multipleClass + 'B'].src = '';
                this.refs[this.multipleClass + 'C'].src = '';
            }
            if (product.url[bKey] && color) {
                this.refs.loadingIcon.style.display = 'block';

                coloring(product.url[bKey], color, src => {
                    this.refs[this.multipleClass + bKey].src = src;
                    this.refs.loadingIcon.style.display = 'none';
                    updateJq();
                }, () => {
                    this.refs.loadingIcon.style.display = 'none';
                    setTimeout(() => {
                        alert(`"${product.url[bKey].split('/').pop().split('?')[0].split('%2F').join('/')}" not found`);
                    }, 100);
                });
            }
            else
                this.refs[this.multipleClass + bKey].src = '';
        }
        else {
            let tone = product.tones[tKey];
            selected[product.class].product = pKey;
            selected[product.class].tone = tKey;

            if (product.url && tone) {
                this.refs.loadingIcon.style.display = 'block';
                coloring(product.url, tone.hexColor, src => {
                    // if (pKey === 'base-matific' || pKey === 'base-radiance')
                    //     this.refs.additionalMask.src = this.getURL(`Models/${this.state.activeModel}/Face-Mask.png`);
                    // else if (product.type === 'rostro')
                    //     this.refs.additionalMask.src = '';
                    this.refs[product.class].src = src;
                    this.refs.loadingIcon.style.display = 'none';
                    updateJq();
                }, () => {
                    this.refs.loadingIcon.style.display = 'none';
                    setTimeout(() => {
                        alert(`"${product.url.split('/').pop().split('?')[0].split('%2F').join('/')}" not found`);
                    }, 100);
                });
            }
            else {
                // if (product.type === 'rostro')
                //     this.refs.additionalMask.src = '';
                this.refs[product.class].src = '';
            }
        }
        this.setState({selected});
    }
    getSelectedTypes() {
        return Object.keys(this.state.selected).filter(type => {
            let selected = this.state.selected[type];
            return selected.product && (selected.pairs ?
                        Object.keys(selected.pairs).filter(key => selected.pairs[key] !== null).length :
                        selected.tone
                )
        });
    }

    openModal() {
        this.setState({showModal: true});
    }
    closeModal() {
        this.setState({showModal: false});
    }

    removeProduct(c) {
        let selected = this.state.selected;
        // if (selected[c].product === 'base-matific' || selected[c].product === 'base-radiance') {
        //     this.refs.additionalMask.src = '';
        // }
        selected[c] = new this.SelectedProduct();
        this.refs[c].src = '';
        this.setState({selected});
    }

    onHover(index, bool, e) {
        let product = document.getElementById('product' + index);
        let descr = product.children[0];
        let scrollTop = document.getElementById('inventory-body').scrollTop;
        let icon = e.target.children[0];
        if (bool) {
            this.descriptionTimer = setTimeout(() => {
                descr.style.top = product.offsetTop - scrollTop - 2 + 'px';
                descr.style.left = '-2px';
                descr.children[0].style.height = icon.height + 'px';
                descr.style.display = 'block';
            }, 500);
        }
        else {
            clearTimeout(this.descriptionTimer);
            this.descriptionTimer = null;
            descr.style.display = 'none';
        }
    }
    findUser(data) {
        Base.fetch('users', {
            context: this,
            asArray: true,
            queries: {
                orderByChild: 'mail',
                equalTo: data.mail
            }
        }).then(users => {
            if (!users[0]) {
                this.addUser(data);
            }
            else {
                this.setState({user: users[0]}, () => {
                    this.loadUserMakeups();
                });
            }
        })
    };
    addUser(data) {
        Base.push('users', {
            data,
            then(err){
                if(!err){
                    this.setState({user: data}, () => {
                        this.loadUserMakeups();
                    });
                }
            }
        });
    }

    loadUserMakeups() {
        Base.bindToState('makeups', {
            context: this,
            state: 'makeups',
            asArray: true,
            queries: {
                orderByChild: 'user',
                equalTo: this.state.user.key
            }
        });
    }
    saveMakeup(name, callback) {
        if (!this.state.user) return;
        let data = {
            createdDate: moment().format('DD/MM/YYYY'),
            name: name || 'My makeup',
            model: this.state.activeModel,
            status: 0,
            updatedDate: 12/12/2016,
            used: [],
            user: this.state.user.key,
            key: 0
        };
        Object.keys(this.state.selected).forEach(c => {
            let selected = this.state.selected[c];
            if (!selected.product || !selected.tone) return;
            let product = {
                type: c.split('-')[0],
                class: c,
                productGroup: selected.product,
                product: selected.tone
            };
            if (c === this.multipleClass) product.pairs = selected.pairs;
            data.used.push(product);
        });

        if (this.state.activeMakeup !== null) {
            let makeupKey = this.state.makeups[this.state.activeMakeup].key;
            Base.post(`makeups/${makeupKey}`, {
                data,
                then(err){
                    if(!err){
                        if (typeof callback === 'function') callback(data.name, makeupKey);
                        console.log('MAKEUP SAVED');
                    }
                }
            });
        }
        else {
            let _this = this;
            Base.push('makeups', {
                data,
                then(err){
                    if(!err){
                        console.log('MAKEUP SAVED');
                        _this.setState({activeMakeup: (_this.state.makeups && _this.state.makeups.length - 1) || null}, () => {
                            let makeupKey = _this.state.makeups[_this.state.activeMakeup].key;
                            if (typeof callback === 'function') callback(data.name, makeupKey);
                        })
                    }
                }
            });
        }
    }

    loadMakeup(makeup, index) {
        if (!makeup.used || !makeup.used.length) return;
        this.clearAll();
        if (this.state.activeModel !== Number(makeup.model)) {
            this.selectModel(makeup.model, this.loadMakeup.bind(this, ...arguments));
            return;
        }
        makeup.used.forEach(s => {
            if (s.class === this.multipleClass) {
                Object.keys(s.pairs).forEach(bKey => {
                    this.onToneSelect(s.productGroup, s.pairs[bKey], bKey);
                })
            }
            else {
                this.onToneSelect(s.productGroup, s.product);
            }
        });
        this.setState({activeMakeup: index});
    }

    removeMakeup(key) {
        this.clearAll();
        this.makeupsRef.child(key).remove();
        this.storageRef.child(`user-makeups/${this.state.user.key}-${key}.jpg`).delete();
    }

    loadModels() {
        Base.fetch('models', {
            context: this,
            asArray: true
        }).then(models => {
            this.setState({models})
        });
    }

    loadProducts(callback) {
        Base.fetch('productGroups', {
            context: this,
            asArray: true
        }).then(Products => {
            Base.fetch('products', {
                context: this,
                asArray: true
            }).then(Tones => {
                let products = {};
                Products.forEach(p => {
                    let img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = this.getURL(`products/${p.key}.jpg`);
                    img.alt = 'not found';
                    img.className = 'img-responsive';
                    img.onload = this.onImgLoad;

                    let product = {
                        desc: p.desc || 'Sin descripción',
                        icon: img,
                        type: p.type,
                        class: p.class,
                        name: p.name,
                        key: p.key,
                        url: null
                    };
                    let tones = Tones.filter(t => t.group === p.key);
                    if (tones[0] && tones[0].pairs) {
                        this.multipleClass = p.class;
                    }
                    product.tones = {};
                    tones.forEach(t => product.tones[t.key] = t);
                    if (product.class === this.multipleClass) {
                        product.url = {};
                        product.tones = tones[0];
                        Object.keys(product.tones.pairs).forEach((bKey, index) => {
                            product.url[bKey] = this.getURL(`Models/${this.state.activeModel}/${p.key}-${bKey}.png`);
                        });
                    }
                    else {
                        product.url = this.getURL(`Models/${this.state.activeModel}/${p.key}.png`);
                    }
                    products[p.key] = product ;
                });
                this.setState({products}, () => {
                    console.log('PRODUCTS LOADED');
                    let classes = Products.map(p => p.class);
                    let uniqueClasses = classes.filter((c, i) => classes.indexOf(c) === i);
                    this.onProductsLoaded(uniqueClasses, callback || null);
                });
            });

        }).catch(error => {
            console.log(error);
        });
    }

    onProductsLoaded(classes, callback) {
        let selected = {};
        classes.forEach(c => selected[c] = new this.SelectedProduct());
        this.setState({selected}, () => {
            if (typeof callback === 'function') callback();
        });
    }
    componentDidUpdate() {
        if (updateElements) updateElements();
        // if (updateJq) updateJq();
    }

    componentDidMount() {
        this.loadModels();
        // this.loadProducts();
        // setTimeout(() => {
        //     this.loadMakeup(this.state.makeups[0], 0);
        // }, 1500);
        if (this.props.user)
            this.findUser(this.props.user);

    }

    render() {
        return (
            <div className="App">
                <div id="main-div">
                    <div id="menu" >
                        <div className="container-fluid h100">
                            <div className="row text-center h100 menu-btn-wrap">
                                <div className="menu-home" onClick={this.goHome.bind(this)}>
                                    <Glyphicon glyph="home"/>
                                </div>
                                {this.menuButtons.map((btn, index) =>
                                    <Col
                                        key={index}
                                        xs={btn.size}
                                        className="h100"
                                        style={{visibility: this.state.activeModel === null && index !== 3 ? 'hidden' : 'visible'}}
                                    >
                                        <div className="menu-btn"
                                            onClick={this.onTabChange.bind(this, index)}
                                        >
                                            <div className={'menu-btn-body' + (this.state.activeTab === index ? ' active-tab' : '')}>
                                                <span>{btn.name}</span>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </div>
                        </div>
                    </div>
                    <div id="inventory">
                        <div id="inventory-body-wrap">
                            <div id="inventory-body" ref="inventoryBody" onScroll={this.onScroll.bind(this)}>
                                {this.state.activeTab == null ?
                                    <div id="model-selection-tab">
                                        <div ref="modelLoadingIcon" className="loading-icon loading-icon-models" style={{display: 'block'}}></div>
                                        <p id="model-selection-header">
                                            Elige una modelo
                                        </p>
                                        <div className="model-list">
                                            {this.state.models.map((model, index) =>
                                                <Col key={index} xs={6} className="model">

                                                    <OverlayTrigger placement="bottom" overlay={<Tooltip
                                                        id={model.name + '-tooltip'}>{model.name}</Tooltip>}>
                                                        <img
                                                            onClick={this.selectModel.bind(this, index + 1)}
                                                            src={this.getURL(model.face)}
                                                            alt={'Modelo ' + model.name}
                                                            className="img-responsive"
                                                            onLoad={e => {
                                                                e.target.style.display = 'block';
                                                                this.refs.modelLoadingIcon.style.display = 'none'}
                                                            }
                                                        />
                                                    </OverlayTrigger>
                                                </Col>
                                            )}
                                        </div>
                                    </div>
                                    : [
                                        <Products m={this.multipleClass} products={this.filterProducts('rostro')} selected={this.state.selected} onSelect={this.onToneSelect.bind(this)} onHover={this.onHover.bind(this)}/>,
                                        <Products m={this.multipleClass} products={this.filterProducts('ojos')} selected={this.state.selected} onSelect={this.onToneSelect.bind(this)} onHover={this.onHover.bind(this)} type="ojos"/>,
                                        <Products m={this.multipleClass} products={this.filterProducts('boca')} selected={this.state.selected} onSelect={this.onToneSelect.bind(this)} onHover={this.onHover.bind(this)}/>,
                                        <Gallery models={this.state.models} makeups={this.state.makeups} active={this.state.activeMakeup} loadMakeup={this.loadMakeup.bind(this)} removeMakeup={this.removeMakeup.bind(this)}/>
                                    ][this.state.activeTab]
                                }
                            </div>
                        </div>
                    </div><div id="scrollbar">
                        <div id="scroll-body">
                            <div id="scroll"></div>
                        </div>
                    </div><div id="preview">
                        <div id="nomodel">

                        </div>
                        <div id="scene" style={this.state.activeModel === null ? {height: '100%'} : null}>
                            {this.state.activeModel !== null ? <Button id="reset-btn" bsStyle="warning" onClick={this.clearAll.bind(this)}>Remover todo</Button> : null}
                            <div ref="loadingIcon" className="loading-icon loading-icon-preview"></div>
                            {this.state.activeModel !== null ?
                                <SaveButton
                                    showModal={this.state.showModal}
                                    onOpen={this.openModal.bind(this)}
                                    onClose={this.closeModal.bind(this)}
                                    onSave={this.saveMakeup.bind(this)}
                                    onShare={this.onShare.bind(this)}
                                    getSelectedTypes={this.getSelectedTypes.bind(this)}
                                    name={this.state.activeMakeup !== null && this.state.makeups[this.state.activeMakeup].name}
                                />
                                : null
                            }
                            <div
                                id="curtain"
                                ref="curtain"
                                style={this.state.previewActiveBtn === 4 ? {opacity: 1, zIndex: 1000} : {opacity: 0, zIndex: 0}}
                            ></div>
                            <div id="used-list-wrap" style={{right: this.state.previewActiveBtn === 4 ? 0 : '-70%'}}>
                                <div id="used-list" ref="usedList">
                                    {Object.keys(this.state.selected).map((c, index) => {
                                        let selected = this.state.selected[c];
                                        let product = this.state.products[selected.product];
                                        let tone = product && (product.class !== this.multipleClass ? product.tones[selected.tone] : product.tones);
                                        if (selected.pairs && !Object.keys(selected.pairs).filter(key => selected.pairs[key] >= 0 && selected.pairs[key] !== null).length) {
                                            product = null;
                                        }
                                        return product && tone ? (
                                            <div key={index} className="used-item" data-type={product.type}>
                                                <div className="used-item-icon">
                                                    <ProductImage product={product}/>
                                                    {/*src={require('./' + product.icon)}*/}
                                                </div>
                                                <div className="used-item-name">
                                                    {`${product.name} - ${tone.name}`}
                                                </div>
                                                <div onClick={this.removeProduct.bind(this, product.class)} className="used-item-remove"><Glyphicon glyph="remove"/></div>
                                            </div>
                                        ) : ''
                                                })}
                                    <div id="used-list-button">  
                                        <Button onClick={this.previewButtons[0].action} bsStyle="warning">Descargar</Button>
                                        <div className="infoText">Para completar tu look, entra a <a target='blank' href='http://www.natura.com.pe/portal-maquillaje'>www.natura.com.pe/portal-maquillaje</a> y para hacer tu pedido entra a <a target='blank' href='http://scn.natura.com.pe'>scn.natura.com.pe</a></div>
                                 </div>
                                </div>
                            </div>
                            <div id="model-container" ref="modelContainer">
                                                {this.state.activeModel === null ? <img style={{width: '100%'}} src={require('./media/nomodel.svg')} alt="" className="img-responsive"/> : null}
                                <img id="model-img" ref="modelImg" alt="" className="img-responsive h100" style={{visibility: this.state.activeModel === null ? 'hidden' : 'visible'}}/>
                            </div>
                            <div id="mask-container" ref="maskContainer" style={{width: this.state.previewActiveBtn === 2 ? '50%' : '100%'}}>
                                {/*<img ref="additionalMask" alt="alt" className="mask h100"/>*/}
                                <img ref={this.multipleClass + 'A'}  alt="alt" className="mask h100"/>
                                <img ref={this.multipleClass + 'B'}  alt="alt" className="mask h100"/>
                                <img ref={this.multipleClass + 'C'}  alt="alt" className="mask h100"/>
                                {Object.keys(this.state.selected).map((c, index) =>
                                    <img ref={c} key={index} alt="alt" className="mask h100" crossOrigin="Anonymous"/>
                                )}
                            </div>
                            <div id="compare" className={this.state.previewActiveBtn === 2 ? '' : 'invisible'}>
                                <div id="compare-line"></div>
                                <div id="compare-slider" className="text-center">
                                    <Glyphicon glyph="menu-left"/>
                                    <Glyphicon glyph="menu-hamburger"/>
                                    <Glyphicon glyph="menu-right"/>
                                </div>
                            </div>
                            <div id="magnifier" ref="magnifier" style={{visibility: this.state.activeModel === null ? 'hidden' : 'visible'}}>
                                <div id="magnifier-inner" ref="magnifierInner"></div>
                            </div>
                        </div>
                                                {this.state.activeModel !== null ?
                            <div id="preview-menu" className="container-fluid">
                                <div className="row h100">
                                                {this.previewButtons.map((btn, index) =>
                                        <div key={index} className={`preview-btn-wrap text-center col-xs-${btn.size} h100`}>
                                            <a
                                                className={'preview-btn' + (this.state.previewActiveBtn === index + 1? ' active-btn' : '')}
                                                onClick={btn.action}
                                            >{btn.name}</a>
                                        </div>
                                    )}
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}