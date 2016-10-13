import $ from 'jquery';
let updateJq;
$(document).ready(function () {

    var magnifier = $('#magnifier');
    var magnifierInner = $('#magnifier-inner');
    var modelImg = $('#model-img');
    var modelContainer = $('#model-container');
    var maskContainer = $('#mask-container');

    // magnifier
    (function () {
        magnifierInner.html(modelContainer.clone().html());
        magnifierInner.append(maskContainer.clone().html());
        maskContainer.mouseenter(function () {
            // if (angular.element($('body')).scope().previewActiveBtn) return;
            magnifier.fadeIn(100);
        }).mousemove(function (e) {
            var mx = e.pageX - $(this).offset().left;
            var my = e.pageY - $(this).offset().top;
            if (magnifier.is(":visible")) {
                var rx = Math.round(mx / modelImg.width() * maskContainer.width() - magnifier.width() / 2) * -1;
                var ry = Math.round(my / modelImg.height() * maskContainer.height() - magnifier.height() / 2) * -1;

                var px = mx - magnifier.width() / 2;
                var py = my - magnifier.height() / 2;

                magnifier.css({left: px, top: py});
                magnifierInner.css({marginLeft: rx, marginTop: ry});
            }
        }).mouseleave(function () {
            magnifier.fadeOut(100);
        })
    })();

    updateJq = function () {
        // magnifier update
        magnifierInner.html(modelContainer.clone().html());
        magnifierInner.append(maskContainer.clone().html());
    };
});
export {updateJq};