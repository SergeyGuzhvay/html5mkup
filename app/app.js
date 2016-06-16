(function () {
    'use strict';
    
    var app = angular.module('makeupApp', ['ngSanitize']);
    app.controller('MainController', function ($scope, $timeout, $sce) {
        var mc = $scope;
        
        mc.selectedTab = 1;
        mc.menuButtons = [
            {tab: 1, name: 'Face', size: 2},
            {tab: 2, name: 'Eyes', size: 2},
            {tab: 3, name: 'Lips', size: 2},
            {tab: 4, name: 'Looks Natura', size: 3},
            {tab: 5, name: 'My Gallery', size: 3}
        ];
        
        mc.previewActiveBtn = 0;
        mc.previewButtons = [
            {
                id: 1,
                name: 'Remove all',
                size: 3,
                action: function () {

                }
            },
            {
                id: 2,
                name: 'Before/After',
                size: 3,
                action: function () {
                    if (mc.previewActiveBtn === 4)
                        angular.element('#curtain').animate({opacity: 0}, 700).css('z-index', 0);
                    mc.previewActiveBtn = mc.previewActiveBtn !== this.id ? this.id : 0;
                    var _this = this;
                    resetCompareSlider(mc.previewActiveBtn === _this.id);
                }
            },
            {
                id: 3,
                name: 'Share',
                size: 2,
                action: function () {

                }
            },
            {
                id: 4,
                name: 'What is used',
                size: 4,
                action: function () {
                    mc.previewActiveBtn = mc.previewActiveBtn !== this.id ? this.id : 0;
                    var isVisible = mc.previewActiveBtn === this.id;
                    angular.element('#curtain').animate({opacity: Number(isVisible)}, 700).css('z-index', Number(isVisible) * 1000);
                }
            }
        ];
        mc.selectTab = function (n) {
            mc.selectedTab = n;
            $timeout(function () {
                updateElements(true);
                updateJq();
            });
        };
        mc.selectedProduct = [];
        mc.selectProduct = function (prod, tone) {
            mc.selectedProduct = [prod, tone];
        };
        
        mc.testHTML = '<h1>HELLO</h1>';

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
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium animi assumenda blanditiis commodi cum deserunt dolore doloribus dolorum eos excepturi incidunt inventore labore minima mollitia officiis, omnis pariatur quisquam recusandae, repellat sint tenetur ut veritatis? Ab aliquam amet consequatur delectus ea eius eligendi eos facere harum impedit in iure laborum minus natus obcaecati, officia omnis porro, quam quibusdam recusandae repellat saepe sapiente sed soluta totam ullam ut vel veniam voluptate voluptatem. Cupiditate deserunt dignissimos, eveniet exercitationem maxime nostrum perspiciatis qui quos, rem rerum sunt tenetur velit, voluptate? Cupiditate deserunt distinctio hic ipsa ipsum nihil nulla possimus quas sapiente voluptatum! Aliquam animi molestiae placeat tempore! Aperiam eaque ex perspiciatis tempore. Cum ea placeat veritatis. Alias aut consequatur consequuntur dicta dignissimos dolor ea earum ex id libero, modi molestiae molestias nesciunt nulla obcaecati, placeat qui recusandae sequi suscipit tenetur ullam voluptate voluptatibus! Architecto dolorum earum hic iure laborum ullam voluptates? Commodi corporis cupiditate eaque earum eveniet exercitationem facere in itaque nulla omnis, possimus praesentium soluta totam voluptas voluptate? Alias architecto aspernatur eius harum ipsum minima tempore? Accusantium, animi atque commodi consequatur culpa cumque cupiditate dolorem dolores esse ex ipsa natus veniam vitae voluptates voluptatum. Aliquid aperiam atque culpa enim obcaecati, quae!</p>",
                "icon": "media/test1.png",
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
                "icon": "media/test2.png",
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
                "icon": "media/test3.png",
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
                "icon": "media/test4.png",
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
                "prodId": "666",
                "name": "Sixth product",
                "desc": "<h3>Product description</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A architecto commodi consectetur, distinctio dolore dolores dolorum eius et ex exercitationem expedita explicabo facilis fugiat fugit id iusto modi mollitia neque nesciunt odio placeat porro quam rerum tempora tempore tenetur unde ut vel vitae voluptatum? Ad atque consequatur culpa deserunt, doloribus eligendi molestiae nemo nesciunt nihil quam quas recusandae, repellat sapiente sequi temporibus vel veritatis? Consequatur, odit, quos? Ab debitis deserunt eligendi eveniet nam pariatur perferendis quos velit veritatis vero? Ad amet animi aperiam at beatae consectetur dolor doloremque eaque eligendi eveniet excepturi expedita, hic incidunt ipsa possimus qui quibusdam quis reiciendis rem repellat repellendus sit soluta sunt ullam unde veniam voluptas. Fugiat harum illo ipsum laboriosam, modi nesciunt porro reiciendis tempore tenetur voluptates? Ab accusantium aperiam esse, impedit ipsam ipsum laborum nemo non quam quasi quia quisquam quo, saepe tempora vero! At, fugit id nemo numquam quas quos sequi veritatis?</p>",
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
    })
    .directive('toneActive', function () {
        return {
            restrict: 'E',
            template: '<div class="tone-active"><div></div></div>'
        };
    });
})();