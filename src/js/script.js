import { updateJq } from './jquery-script';

let updateElements, scrollMaxTop, compareSlideMaxLeft, resetCompareSlider, downloadImage;
window.onload = function () {
    let conf = {
        minWidth: 800,
        maxWidth: 1500,
        fontPoint: 1500,
        fontSize: {
            modelHeader: 28,
            menu: 23,
            inventory: 23,
            preview: 18,
            // usedList: 18,
            description: 17
        }

    };
    let scaleFont;
    let modelsHeader = document.getElementById('model-selection-header');
    let menuBtns = document.getElementsByClassName('menu-btn-body');
    let descriptions = document.getElementsByClassName('prod-description');
    let products = document.getElementsByClassName('product');
    let productsMultiple = document.getElementsByClassName('product-multiple');
    let mainDiv = document.getElementById('main-div');
    let menu = document.getElementById('menu');
    let preview = document.getElementById('preview');
    let inventory = document.getElementById('inventory-body');
    let scroll = document.getElementById('scroll');
    let compareSlider = document.getElementById('compare-slider');
    let compareLine = document.getElementById('compare-line');
    let maskContainer = document.getElementById('mask-container');
    let loadingIcons = document.getElementsByClassName('loading-icon');

    let onResize = function () {
        let width = window.innerWidth * 0.9;
        if (width > conf.maxWidth) width = conf.maxWidth;
        else if (width < conf.minWidth) width = conf.minWidth;
        let height = width * 0.585;
        // let margin = (window.innerHeight - height) / 3;
        scaleFont = function (name) {
            let ratio = width / conf.fontPoint;
            return Math.round(conf.fontSize[name] * ratio) + 'px';
        };
        if (modelsHeader) modelsHeader.style.fontSize = scaleFont('modelHeader');
        menu.style.fontSize = scaleFont('menu');
        preview.style.fontSize = scaleFont('preview');
        inventory.style.fontSize = scaleFont('inventory');
        // usedList.style.fontSize = scaleFont('usedList');
        mainDiv.style.width = width + 'px';
        mainDiv.style.height = height + 'px';
        // let scrollOffset = inventory.offsetWidth - inventory.clientWidth;
        // inventory.style.width = width * 0.492 + scrollOffset + 'px';
        // inventory.style.right = -scrollOffset + 'px';
        // topSpace.style.height = margin > 0 ? margin + 'px' : 0;

        for (let n in menuBtns) {
            if (menuBtns[n].style)
                menuBtns[n].style.borderBottomWidth = Math.round((width - 400) / 200) + 1 + 'px';
        }
        for (let n in loadingIcons) {
            if (loadingIcons[n].style)
                loadingIcons[n].style.borderWidth = Math.round(4 * (width / conf.maxWidth)) + 'px';
        }

        updateElements();
        if (updateJq) updateJq();
    };

    updateElements = function (reset) {
        let scene = document.getElementById('scene');
        let masks = document.getElementById('mask-container').children;
        let inventory = document.getElementById('inventory-body');
        let scrollBody = document.getElementById('scroll-body');
        let scroll = document.getElementById('scroll');
        let pt = document.getElementsByClassName('prod-tone');
        let ptm = document.getElementsByClassName('prod-tone-multiple');
        (function () {
            if (!pt[0] || !pt[0].children[0]) return;

            for (let n in pt) {
                if (pt.hasOwnProperty(n)) {
                    let tones = pt[n];
                    let marginRight = tones.offsetWidth * 0.02;
                    let toneWidth = (tones.offsetWidth - marginRight) / tones.children.length - marginRight;
                    for (let n in tones.children) {
                        if (tones.children.hasOwnProperty(n)) {
                            let tone = tones.children[n];
                            if (!tone.style) continue;
                            tone.style.width = tones.children.length > 5 ? toneWidth + 'px' : '16%';
                        }
                    }
                }
            }
        })();
        (function () {
            if (!ptm[0] || !ptm[0].children[0]) return;
            for (let n in ptm) {
                if (ptm.hasOwnProperty(n)) {
                    let blocks = ptm[n].children;
                    for (let n in blocks) {
                        if (blocks.hasOwnProperty(n)) {
                            let block = blocks[n];
                            let marginRight = block.offsetWidth * 0.03;
                            let toneWidth = (block.offsetWidth - marginRight) / block.children.length - marginRight;
                            for (let n in block.children) {
                                if (block.children.hasOwnProperty(n)) {
                                    let tone = block.children[n];
                                    tone.style.width = block.children.length > 3 ? toneWidth + 'px' : '30%';
                                }
                            }
                        }
                    }
                }
            }
        })();
        for (let n in masks) {
            if (masks.hasOwnProperty(n)) {
                let mask = masks[n];
                mask.width = scene.clientWidth;
            }
        }
        for (let n in descriptions) {
            if (descriptions.hasOwnProperty(n)) {
                let desc = descriptions[n];
                if (!desc.style) continue;
                desc.style.fontSize = scaleFont('description');
            }
        }
        for (let n in products) {
            if (products.hasOwnProperty(n)) {
                let prod = products[n];
                if (!prod.style) continue;
                prod.style.height = inventory.clientHeight * 0.25 + 'px';
            }
        }
        for (let n in productsMultiple) {
            if (productsMultiple.hasOwnProperty(n)) {
                let prod = productsMultiple[n];
                if (!prod.style) continue;
                prod.style.height = inventory.clientHeight * 0.5 + 'px';
            }
        }

        scroll.style.display = 'block';
        let scrollHeight = inventory.offsetHeight / inventory.scrollHeight * 100;
        if (scrollHeight >= 100) scroll.style.display = 'none';
        scroll.style.height = scrollHeight + '%';
        if (reset) scroll.style.top = 0;
        scrollMaxTop = scrollBody.offsetHeight - scroll.offsetHeight;
        if (!inventory.children[0]) return;
        let ratio = inventory.scrollTop / (inventory.children[0].offsetHeight - inventory.offsetHeight);
        scroll.style.top = scrollMaxTop * ratio + 'px';
        compareSlideMaxLeft = preview.offsetWidth;
    };

    (window.onresize = onResize)();
    (function () {
        let startY = 0;
        let startTop = 0;
        function onMouseMove (e) {
            let y = e.clientY - startY;
            let newTop = startTop + y;
            newTop = newTop < 0 ? 0 : newTop > scrollMaxTop ? scrollMaxTop : newTop;
            scroll.style.top = newTop + 'px';
            let ratio = newTop / scrollMaxTop;
            inventory.scrollTop = (inventory.children[0].offsetHeight - inventory.offsetHeight) * ratio;
        }
        scroll.addEventListener('mousedown', function (e) {
            startY = e.clientY;
            startTop = parseInt(scroll.style.top, 10) || 0;
            document.addEventListener('mousemove', onMouseMove);
        });
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
        });
        inventory.addEventListener('scroll', function (e) {
            let ratio = inventory.scrollTop / (inventory.children[0].offsetHeight - inventory.offsetHeight);
            // if (ratio > 1) ratio = 1;
            scroll.style.top = scrollMaxTop * ratio + 'px';
        });

    })();
    (function () {
        let startX;
        let startLeft;
        function onMouseMove (e) {
            let x = e.clientX - startX;
            let newLeft = startLeft + x;
            newLeft = (newLeft < 0 ? 0 : newLeft > compareSlideMaxLeft ? compareSlideMaxLeft : newLeft);
            compareSlider.style.left = (newLeft - compareSlider.offsetWidth / 2.15) / preview.offsetWidth * 100 + '%';
            compareLine.style.left = (newLeft - compareLine.offsetWidth * 0.08) / preview.offsetWidth * 100 + '%';
            let widthRatio = (preview.offsetWidth - newLeft - compareLine.offsetWidth) / preview.offsetWidth;
            maskContainer.style.width = widthRatio * 100 + '%';
        }
        compareSlider.addEventListener('mousedown', function (e) {
            startX = e.clientX;
            startLeft = parseFloat(compareSlider.style.left) / 100 * preview.offsetWidth + compareSlider.offsetWidth / 2 || preview.offsetWidth / 2;
            document.addEventListener('mousemove', onMouseMove);
        });
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
        });
        resetCompareSlider = function () {
            compareSlider.style.left = (preview.offsetWidth / 2 - compareSlider.offsetWidth / 2.15) / preview.offsetWidth * 100 + '%';
            compareLine.style.left = (preview.offsetWidth / 2 - compareLine.offsetWidth * 0.08) / preview.offsetWidth * 100 + '%';
        }
    })();
    CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {

        var lines = text.split("\n");

        for (var i = 0; i < lines.length; i++) {

            var words = lines[i].split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            this.fillText(line, x, y);
            y += lineHeight;
        }
    };
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        if (fill) this.fill();
        else this.stroke();
    };

    downloadImage = function (selected) {
        let model = document.getElementById('model-container').children[0];
        let masks = document.getElementById('mask-container').children;
        let pr = document.getElementsByClassName('used-item');

        let products = {
            rostro: [],
            ojos: [],
            boca: []
        };
        
        for (let p in pr) {
            if (pr.hasOwnProperty(p)) {
                products[pr[p].dataset.type].push(pr[p]);
            }
        }

        let productExtraRow = 0;
        Object.keys(products).forEach(type => {
            let l = products[type].length;
            if (l > 2 && l - 2 > productExtraRow)
                productExtraRow = l - 2;
        });

        let canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 760 + productExtraRow * 70;
        // document.body.insertBefore(canvas, document.body.children[0]);
        let ctx = canvas.getContext('2d');
        let w = canvas.width;
        let h = canvas.height;

        let mainColor = '#F1B61C';
        let lineWidth = 3;

        //background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);

        //header
        ctx.fillStyle = mainColor;
        ctx.fillRect(0, 0, w, 56);
        ctx.fillStyle = 'white';
        ctx.font = "bold 14px Arial";
        ctx.fillText('E N T R E N A M I E N T O  V I R T U A L', 370, 34);

        //footer
        ctx.fillStyle = '#F7F7F8';
        ctx.fillRect(0, 547, w, h - 547);


        //image containers
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = lineWidth;

        ctx.save();
        ctx.roundRect(69, 116, 396, 396, 6);
        ctx.clip();
        ctx.drawImage(model, 69, 116, 396, 396);
        ctx.restore();

        ctx.save();
        ctx.roundRect(534, 116, 396, 396, 6);
        ctx.clip();
        ctx.drawImage(model, 534, 116, 396, 396);
        for (let n in masks) {
            if (masks.hasOwnProperty(n)) {
                let mask = masks[n];
                if (!mask.style) continue;
                ctx.drawImage(mask, 534, 116, 396, 396);
            }
        }
        ctx.restore();

        //products

        ctx.font = "14px Arial";
        ctx.fillText('OJOS', 376, 593);

        ctx.font = "14px Arial";
        ctx.fillText('LABIOS', 669, 593);

        let drawProduct = (product, x, y, last) => {
            let img = product.children[0].children[0].children[0];
            let text = product.children[1].innerHTML;

            ctx.drawImage(img, x, y, 70, 70);

            ctx.fillStyle = '#797979';
            ctx.font = "11px Arial";
            ctx.wrapText(text, x + 80, y + 35, 160, 14);

            if (!last) {
                ctx.strokeStyle = '#E6E6E6';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y + 70 - 0.5);
                ctx.lineTo(x + 250, y + 70 - 0.5);
                ctx.stroke();
            }

        };

        let drawProductType = (x, y, type, products) => {
            let rows = products.length;
            if (!rows) return;
            ctx.strokeStyle = '#D1D1D1';
            ctx.lineWidth = 3;
            ctx.roundRect(x, y + 2, 272, 30 + rows * 70 , 4);

            ctx.fillStyle = 'white';
            ctx.lineWidth = 3;
            ctx.roundRect(x - 2, y - 1, 276, 31 + rows * 70, 4, true);

            ctx.fillStyle = '#E79936';
            ctx.font = "14px Arial";
            ctx.fillText(type.toUpperCase(), x + 20, y + 20);

            products.forEach((product, index) => {
                drawProduct(product, x + 10, y + 30 + 70 * index, rows === index + 1);
            });
        };
        drawProductType(70, 570, 'rostro', products['rostro']);
        drawProductType(361, 570, 'ojos', products['ojos']);
        drawProductType(653, 570, 'labios', products['boca']);


        window.open(canvas.toDataURL(), 'image', `width=${canvas.width}, height=${canvas.height}`);
    };
};

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

export function coloring(src, color, onSuccess, onError) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let [r, g, b] = hexToRgb(color).map(c => c / 255);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * r >= 0 ? data[i] * r : 0;
            data[i + 1] = data[i + 1] * g >= 0 ? data[i + 1] * g : 0;
            data[i + 2] = data[i + 2] * b >= 0 ? data[i + 2] * b : 0;
        }
        ctx.putImageData(imageData, 0, 0);
        onSuccess(canvas.toDataURL());
    };
    img.onerror = onError;
}

export { updateElements, scrollMaxTop, compareSlideMaxLeft, resetCompareSlider, downloadImage };
