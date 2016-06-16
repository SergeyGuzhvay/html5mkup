var updateJq;
$(document).ready(function () {


    var scene = $('#scene');
    var magnifier = $('#magnifier');
    var magnifierInner = $('#magnifier-inner');
    var modelImg = $('#model-img');
    var modelContainer = $('#model-container');
    var maskContainer = $('#mask-container');
    var compareSlider = $('#compare-slider');
    var compareLine = $('#compare-line');

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

    (updateJq = function () {
        // product icon scaling
        (function () {
            $('.prod-icon img').each(function(){
                var imgClass = (this.width/this.height > 1) ? 'wide' : 'tall';
                $(this).addClass(imgClass);
            })
        })();
        // show description
        (function () {
            var timeout;
            $('.prod-icon').mouseenter(function () {
                $('.prod-description').hide();
                var position = $(this).parent().position();
                position.top -= 2;
                position.left = -2;
                $(this).prev().css(position);
            }).mousemove(function () {
                var _this = this;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    $('.prod-description-icon').height($(_this).height());
                    $(_this).prev().show();
                }, 500);
            }).mouseleave(function () {
                $('.prod-description').hide();
                clearTimeout(timeout);
            });
        })();
    })();


});