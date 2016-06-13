'use strict';

(function () {
    var app = angular.module('makeupApp', []);
    app.controller('MainController', function ($scope, $timeout) {
        var mc = $scope;
        mc.selectedTab = 1;
        mc.sliderIsOpened = false;
        
        mc.menuButtons = [
            {tab: 1, name: 'Face', size: 2},
            {tab: 2, name: 'Eyes', size: 2},
            {tab: 3, name: 'Lips', size: 2},
            {tab: 4, name: 'Looks Natura', size: 3},
            {tab: 5, name: 'My Gallery', size: 3}
        ];
        mc.previewButtons = [
            {name: 'Remove all', size: 3},
            {name: 'Before/After', size: 3},
            {name: 'Share', size: 2},
            {name: 'What is used', size: 4, action: function () {
                mc.sliderIsOpened = !mc.sliderIsOpened;
                angular.element("#curtain").animate({opacity: Number(mc.sliderIsOpened)}, 700);
            }}
        ];
        mc.selectTab = function (n) {
            mc.selectedTab = n;
            $timeout(function () {
                updateElements(true);
            });
        };

        mc.products = [
            {
                "prodId": "111",
                "name": "First product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque eos fuga magni non officia pariatur!</p>",
                "icon": "media/test-prod-icon.png",
                "tones": [
                    {
                        "toneId": "1",
                        "name": "The tone 1",
                        "hexColor": "#CD9374",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "2",
                        "name": "The tone 2",
                        "hexColor": "#E6A08F",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "3",
                        "name": "The tone 3",
                        "hexColor": "#D98B87",
                        "pngMask": "/path/to/mask.png"
                    }
                ]
            },
            {
                "prodId": "222",
                "name": "Second product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque eos fuga magni non officia pariatur!</p>",
                "icon": "media/test-prod-icon.png",
                "tones": [
                    {
                        "toneId": "1",
                        "name": "The tone 1",
                        "hexColor": "#CD9374",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "2",
                        "name": "The tone 2",
                        "hexColor": "#E6A08F",
                        "pngMask": "/path/to/mask.png"
                    }
                ]
            },
            {
                "prodId": "333",
                "name": "Third product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque eos fuga magni non officia pariatur!</p>",
                "icon": "media/test-prod-icon.png",
                "tones": [
                    {
                        "toneId": "1",
                        "name": "The tone 1",
                        "hexColor": "#CD9374",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "2",
                        "name": "The tone 2",
                        "hexColor": "#E6A08F",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "3",
                        "name": "The tone 3",
                        "hexColor": "#D98B87",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "4",
                        "name": "The tone 4",
                        "hexColor": "#D18B17",
                        "pngMask": "/path/to/mask.png"
                    }
                ]
            },
            {
                "prodId": "444",
                "name": "Fourth product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque eos fuga magni non officia pariatur!</p>",
                "icon": "media/test-prod-icon.png",
                "tones": [
                    {
                        "toneId": "1",
                        "name": "The tone 1",
                        "hexColor": "#CD9374",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "2",
                        "name": "The tone 2",
                        "hexColor": "#E6A08F",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "3",
                        "name": "The tone 3",
                        "hexColor": "#D98B87",
                        "pngMask": "/path/to/mask.png"
                    }
                ]
            },
            {
                "prodId": "555",
                "name": "Fifth product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque eos fuga magni non officia pariatur!</p>",
                "icon": "media/test-prod-icon.png",
                "tones": [
                    {
                        "toneId": "1",
                        "name": "The tone 1",
                        "hexColor": "#CD9374",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "2",
                        "name": "The tone 2",
                        "hexColor": "#E6A08F",
                        "pngMask": "/path/to/mask.png"
                    },
                    {
                        "toneId": "3",
                        "name": "The tone 3",
                        "hexColor": "#D98B87",
                        "pngMask": "/path/to/mask.png"
                    }
                ]
            }
        ];
        function getWatchers(root) {
            root = angular.element(root || document.documentElement);
            var watcherCount = 0;

            function getElemWatchers(element) {
                var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
                var scopeWatchers = getWatchersFromScope(element.data().$scope);
                var watchers = scopeWatchers.concat(isolateWatchers);
                angular.forEach(element.children(), function (childElement) {
                    watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
                });
                return watchers;
            }

            function getWatchersFromScope(scope) {
                if (scope) {
                    return scope.$$watchers || [];
                } else {
                    return [];
                }
            }

            return getElemWatchers(root);
        }
    })
    .directive('sampleActive', function () {
        return {
            restrict: 'E',
            template: '<div class="sample-active"><div></div></div>'
        };
    });
})();