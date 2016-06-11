'use strict';

(function () {
    var app = angular.module('makeupApp', []);
    app.controller('MainController', function () {
        var mc = this;
        mc.selectedTab = 0;
        
        mc.menuButtons = [
            {tab: 1, name: 'Face', size: 2},
            {tab: 2, name: 'Eyes', size: 2},
            {tab: 3, name: 'Lips', size: 2},
            {tab: 4, name: 'Looks Natura', size: 2},
            {tab: 5, name: 'My Gallery', size: 2}
        ];
        mc.previewButtons = [
            {name: 'Remove all', size: 3},
            {name: 'Before/After', size: 3},
            {name: 'Share', size: 2},
            {name: 'What is used', size: 4}
        ];
        mc.selectTab = function (n) {
            mc.selectedTab = n;
        }
    });
})();

