var resize = function () {
    var mainDiv = document.getElementById('main-div');
    var topSpace = document.getElementById('top-space');
    var appWidth = window.innerWidth * 0.9;
    if (appWidth > 1400) appWidth = 1400;
    else if (appWidth < 800) appWidth = 800;
    var appHeight = appWidth * 0.585;
    var margin = (window.innerHeight - appHeight) / 3;
    mainDiv.style.width = appWidth + 'px';
    mainDiv.style.height = appHeight + 'px';
    topSpace.style.height = margin > 0 ? margin + 'px' : 0;
};

window.onload = resize;
window.onresize = resize;