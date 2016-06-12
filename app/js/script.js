var updateScroll, scrollMaxTop;
window.onload = function () {
    var conf = {
        minWidth: 800,
        maxWidth: 1500,
        fontPoint: 1500,
        fontSize: {
            menu: 23,
            preview: 18
        }

    };
    var menuBtns = document.getElementsByClassName('menu-btn-body');
    var mainDiv = document.getElementById('main-div');
    var topSpace = document.getElementById('top-space');
    var menu = document.getElementById('menu');
    var preview = document.getElementById('preview');
    var inventory = document.getElementById('inventory-body');
    var scrollBody = document.getElementById('scroll-body');
    var scroll = document.getElementById('scroll');

    var onResize = function () {
        var width = window.innerWidth * 0.9;
        if (width > conf.maxWidth) width = conf.maxWidth;
        else if (width < conf.minWidth) width = conf.minWidth;
        var height = width * 0.585;
        var margin = (window.innerHeight - height) / 3;

        menu.style.fontSize = scaleFont('menu');
        preview.style.fontSize = scaleFont('preview');
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
        updateScroll();
        function scaleFont(name) {
            var ratio = width / conf.fontPoint;
            return Math.round(conf.fontSize[name] * ratio) + 'px';
        }
    };

    updateScroll = function (reset) {
        scroll.style.display = 'block';
        var scrollHeight = inventory.offsetHeight / inventory.scrollHeight * 100;
        if (scrollHeight >= 100) scroll.style.display = 'none';
        scroll.style.height = scrollHeight + '%';
        if (reset) scroll.style.top = 0;
        scrollMaxTop = scrollBody.offsetHeight - scroll.offsetHeight;
        var ratio = inventory.scrollTop / (inventory.children[0].offsetHeight - inventory.offsetHeight);
        scroll.style.top = scrollMaxTop * ratio + 'px';
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
            scroll.style.top = scrollMaxTop * ratio + 'px';
        });

    })();
};

