
var app = angular.module('starter.directives', []);

app.directive(
    "bnFadeHelper",
    function() {
        function compile( element, attributes, transclude ) {
            element.prepend( "<div class='fader image'></div>" );
            return( link );
        }
        function link( $scope, element, attributes ) {
            var fader = element.find( "div.fader" );
            var primary = element.find( "div.main" );

            $scope.$watch(
                "image.source",
                function( newValue, oldValue ) {
                    if ( newValue === oldValue ) {
                        return;
                    }
                    if ( isFading() ) {
                        return;
                    }
                    initFade( oldValue );
                }
            );
            function initFade( fadeSource ) {
                fader
                    .css( "backgroundImage", 'url("' + fadeSource + '")' )
                    .addClass( "show" )
                ;
                var img = new Image();
                img.onload = function() {
                    startFade();
                };
                img.src = $("div.main").css('backgroundImage').replace('url("', '').replace('")', '');
            }
            function isFading() {
                return(
                    fader.hasClass( "show" ) ||
                    fader.hasClass( "fadeOut" )
                );
            }
            function startFade() {
                fader.addClass( "fadeOut" );
                setTimeout( teardownFade, 600 );
            }
            function teardownFade() {
                fader.removeClass( "show fadeOut" );

            }
        }
        // Return the directive configuration.
        return({
            compile: compile,
            restrict: "A"
        });
    }
);



app.directive("mapBox", function() {

    var mapStyle = {
        "version": 8,
        "sources": {
            "naturalearth": {
                "type": "vector",
                "tiles": [
                    "{z}/{x}/{y}"
                ],
                "minzoom": 0,
                "maxzoom": 8
            }
        },
        "layers": [
            {
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": "#000000"
                }
            },
            {
                "id": "naturalearth",
                "type": "line",
                "source": "naturalearth",
                "source-layer": "ne_110m_admin_0_countries_lakes",
                "paint": {
                    "line-color": "#ff0000"
                }
            }
        ]
    };

    var id = 0;
    return {
        restrict: "A",
        link: function( $scope, element, attributes ) {
            $scope.id = 'map-' + (++id);
            element.attr('id', $scope.id);

            /*if (window.sqlitePlugin && window.sqlitePlugin.openDatabase) {
                try {
                    var map = new mapboxgl.Map({
                        container: $scope.id,
                        center: [0, 0],
                        zoom: 2,
                        style: mapStyle,
                        bearingSnap: 45
                    });
                    map.addControl(new mapboxgl.Navigation());
                } catch (e) {
                    alert(e);
                }
            }*/

        }
    }
});

app.directive("leafRoute", function() {
    return {
        restrict: "A",
        require: ['leaflet'],
        link: function( $scope, element, attributes, controller) {
            var leafletScope = controller[0].getLeafletScope();
            var mapController = controller[0];

            mapController.getMap().then(function(map) {
                $scope.$watch(attributes.leafRoute, function(coord) {
                    var lat = coord.lat && parseFloat(coord.lat),
                        lng = coord.lng && parseFloat(coord.lng);

                    if (!lat || !lng) {
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(function(position) {

                        L.Routing.control({
                            waypoints: [
                                L.latLng(lat, lng),
                                L.latLng(position.coords.latitude, position.coords.longitude)
                            ],
                            routeWhileDragging: true
                        }).addTo(map);

                    }, function() {
                        alert('Неудалось получить Ваши координаты');
                    });
                })
            });

        }
    }
});