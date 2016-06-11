var resize = function () {

    var mainDiv = document.getElementById('main-div');
    var topSpace = document.getElementById('top-space');
    var menu = document.getElementById('menu');
    var menuBtns = document.getElementsByClassName('menu-btn-body');

    var appWidth = window.innerWidth * 0.9;
    if (appWidth > 1400) appWidth = 1500;
    else if (appWidth < 800) appWidth = 800;
    var appHeight = appWidth * 0.585;
    var margin = (window.innerHeight - appHeight) / 3;

    menu.style.fontSize = Math.round(appWidth / 64) + 'px';
    mainDiv.style.width = appWidth + 'px';
    mainDiv.style.height = appHeight + 'px';
    // topSpace.style.height = margin > 0 ? margin + 'px' : 0;
    for (var n in menuBtns) {
        var btn = menuBtns[n];
        if (!btn.style) continue;
        btn.style.borderBottomWidth = Math.round((appWidth - 400) / 200) + 1 + 'px';
    }
};

window.onload = resize;
window.onresize = resize;