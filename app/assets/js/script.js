var updateElements, scrollMaxTop, compareSlideMaxLeft, resetCompareSlider;
window.onload = function () {
    var conf = {
        minWidth: 800,
        maxWidth: 1500,
        fontPoint: 1500,
        fontSize: {
            menu: 23,
            inventory: 23,
            preview: 18,
            description: 17
        }

    };
    var scaleFont;
    var menuBtns = document.getElementsByClassName('menu-btn-body');
    var descriptions = document.getElementsByClassName('prod-description');
    var products = document.getElementsByClassName('product');
    var prodSamples = document.getElementsByClassName('prod-sample');
    var mainDiv = document.getElementById('main-div');
    var topSpace = document.getElementById('top-space');
    var menu = document.getElementById('menu');
    var preview = document.getElementById('preview');
    var inventory = document.getElementById('inventory-body');
    var scrollBody = document.getElementById('scroll-body');
    var scroll = document.getElementById('scroll');
    var compareSlider = document.getElementById('compare-slider');
    var compareLine = document.getElementById('compare-line');
    var maskContainer = document.getElementById('mask-container');

    var onResize = function () {
        var width = window.innerWidth * 0.9;
        if (width > conf.maxWidth) width = conf.maxWidth;
        else if (width < conf.minWidth) width = conf.minWidth;
        var height = width * 0.585;
        var margin = (window.innerHeight - height) / 3;
        scaleFont = function (name) {
            var ratio = width / conf.fontPoint;
            return Math.round(conf.fontSize[name] * ratio) + 'px';
        };

        menu.style.fontSize = scaleFont('menu');
        preview.style.fontSize = scaleFont('preview');
        inventory.style.fontSize = scaleFont('inventory');
        mainDiv.style.width = width + 'px';
        mainDiv.style.height = height + 'px';
        var scrollOffset = inventory.offsetWidth - inventory.clientWidth;
        inventory.style.width = width * 0.492 + scrollOffset + 'px';
        // inventory.style.right = -scrollWidth + 'px';
        // topSpace.style.height = margin > 0 ? margin + 'px' : 0;

        for (var n in menuBtns) {
            var btn = menuBtns[n];
            if (!btn.style) continue;
            btn.style.borderBottomWidth = Math.round((width - 400) / 200) + 1 + 'px';
        }

        updateElements();
    };

    updateElements = function (reset) {
        (function () {
            var ps = prodSamples;
            if (!ps[0] || !ps[0].children[0]) return;
            var marginRight = ps[0].offsetWidth * 0.02;
            var sampleWidth = (ps[0].offsetWidth - marginRight) / ps[0].children.length - marginRight;
            for (var n in ps) {
                var samples = ps[n];
                if (!samples.style || samples.children.length < 6) continue;
                for (var n in samples.children) {
                    var sample = samples.children[n];
                    if (!sample.style) continue;
                    sample.style.width = sampleWidth + 'px';
                }
            }
        })();
        for (var n in descriptions) {
            var desc = descriptions[n];
            if (!desc.style) continue;
            desc.style.fontSize = scaleFont('description');
        }
        for (var n in products) {
            var prod = products[n];
            if (!prod.style) continue;
            prod.style.height = inventory.clientHeight * 0.25 + 'px';
        }
        scroll.style.display = 'block';
        var scrollHeight = inventory.offsetHeight / inventory.scrollHeight * 100;
        if (scrollHeight >= 100) scroll.style.display = 'none';
        scroll.style.height = scrollHeight + '%';
        if (reset) scroll.style.top = 0;
        scrollMaxTop = scrollBody.offsetHeight - scroll.offsetHeight;
        var ratio = inventory.scrollTop / (inventory.children[0].offsetHeight - inventory.offsetHeight);
        scroll.style.top = scrollMaxTop * ratio + 'px';
        compareSlideMaxLeft = preview.offsetWidth;
    };

    (window.onresize = onResize)();
    (function () {
        var startY = 0;
        var startTop = 0;
        function onMouseMove (e) {
            var y = e.clientY - startY;
            var newTop = startTop + y;
            newTop = newTop < 0 ? 0 : newTop > scrollMaxTop ? scrollMaxTop : newTop;
            scroll.style.top = newTop + 'px';
            var ratio = newTop / scrollMaxTop;
            inventory.scrollTop = (inventory.children[0].offsetHeight - inventory.offsetHeight) * ratio;
        }
        scroll.addEventListener('mousedown', function (e) {
            startY = e.clientY;
            startTop = parseInt(scroll.style.top) || 0;
            document.addEventListener('mousemove', onMouseMove);
        });
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
        });
        inventory.addEventListener('scroll', function (e) {
            var ratio = inventory.scrollTop / (inventory.children[0].offsetHeight - inventory.offsetHeight);
            // if (ratio > 1) ratio = 1;
            scroll.style.top = scrollMaxTop * ratio + 'px';
        });

    })();
    (function () {
        var startX;
        var startLeft;
        function onMouseMove (e) {
            var x = e.clientX - startX;
            var newLeft = startLeft + x;
            newLeft = (newLeft < 0 ? 0 : newLeft > compareSlideMaxLeft ? compareSlideMaxLeft : newLeft);
            compareSlider.style.left = (newLeft - compareSlider.offsetWidth / 2) / preview.offsetWidth * 100 + '%';
            compareLine.style.left = (newLeft - compareLine.offsetWidth / 2) / preview.offsetWidth * 100 + '%';
            var widthRatio = (preview.offsetWidth - newLeft - compareLine.offsetWidth) / preview.offsetWidth;
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
        resetCompareSlider = function (bool) {
            if (bool) {
                maskContainer.style.width = '50%';
            }
            else {
                compareSlider.style.left = (preview.offsetWidth / 2 - compareSlider.offsetWidth / 2) / preview.offsetWidth * 100 + '%';
                compareLine.style.left = (preview.offsetWidth / 2 - compareLine.offsetWidth / 2) / preview.offsetWidth * 100 + '%';
                maskContainer.style.width = '100%';
            }
        }
    })();
    (function () {
        var model = document.getElementById('model-container').children[0];
        var masks = document.getElementById('mask-container').children;
        console.log(masks);

        var canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 760;
        document.body.insertBefore(canvas, document.body.children[0]);
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;

        ctx.roundRect = function (x, y, width, height, fill) {
            var radius = 6;
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

        var mainColor = '#F1B61C';
        var lineWidth = 3;

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
        ctx.fillRect(0, 547, w, 212);

        //image containers
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = lineWidth;

        ctx.save();
        ctx.roundRect(69, 116, 396, 396);
        ctx.clip();
        ctx.drawImage(model, 69, 116, 396, 396);
        ctx.restore();

        ctx.save();
        ctx.roundRect(534, 116, 396, 396);
        ctx.clip();
        ctx.drawImage(model, 534, 116, 396, 396);
        for (var n in masks) {
            ctx.drawImage(masks[n], 534, 116, 396, 396);
        }
        ctx.restore();


    })();
};

