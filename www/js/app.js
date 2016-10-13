// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

                       }
                       if (navigator && navigator.splashscreen) {
                        navigator.splashscreen.hide();
                       }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  var oblList = [
    "56e59aa31e4d82515a4ee0d1",
    "56e59ae71e4d82515a4ee0fb"
  ];

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    },
    data: {
      hideHeader: true
    }
  })

  .state('tab.menu', {
      url: '/menu',
      views: {
        'tab-menu': {
          templateUrl: 'templates/tab-menu.html',
          controller: 'ChatsCtrl'
        }
      },
    data: {
      hideHeader: true
    }
    })
      .state('tab.compass', {
        url: '/menu/compass',
        views: {
          'tab-menu': {
            templateUrl: 'templates/page-compass.html',
            controller: 'PageCompassCtrl'
          }
        }
      })
      .state('tab.browse', {
        url: '/menu/:alias',
        views: {
          'tab-menu': {
            controller: 'PageListCtrl',
            templateProvider: function($http, $stateParams, Data, $q) {
              var def = $q.defer();


              Data.get($stateParams.alias).then(function(page) {
                var templateUrl = 'templates/page-' + page.type + '.html';

                if (oblList.indexOf(page.id) != -1) {
                  templateUrl = 'templates/page-regions.html';
                }

                if (page.id == '57515fe59286b438235f078f') {
                  templateUrl = 'templates/page-money.html';
                }

                $http.get(templateUrl).then(function(tpl){
                  def.resolve(tpl.data);
                });
              });
              return def.promise;
            }
          }
        },
        resolve: {
          page: function(Data, $stateParams, $q) {
            var page = Data.get($stateParams.alias),
              defer = $q.defer();

            page.then(function(page) {
              if (oblList.indexOf(page.id) != -1) {
                var alias = page.id == '56e59aa31e4d82515a4ee0d1' ? 'places' : 'synagogues';
                Data.get(alias).then(function(parentPage) {
                  Data.get('id-' + parentPage.items[0]).then(function(fPage) {
                    page.originalPage = fPage;
                    defer.resolve(page);
                  });
                });
              } else {
                defer.resolve(page);
              }
            });
            return defer.promise;
          }
        }
      })
      .state('tab.browseRegion', {
        url: '/menu/:alias/:regionId',
        views: {
          'tab-menu': {
            controller: 'PageListCtrl',
            templateProvider: function($http, $stateParams, Data, $q) {
              var def = $q.defer();


              Data.get($stateParams.alias).then(function(page) {
                var templateUrl = 'templates/page-' + page.type + '.html';

                if (oblList.indexOf(page.id) != -1) {
                  templateUrl = 'templates/page-regions.html';
                }

                $http.get(templateUrl).then(function(tpl){
                  def.resolve(tpl.data);
                });
              });
              return def.promise;
            }
          }
        },
        resolve: {
          page: function(Data, $stateParams, $q) {
            var page = Data.get($stateParams.alias),
              defer = $q.defer();

            page.then(function(page) {
              page.filter = { regionId: $stateParams.regionId };
              defer.resolve(page);
            });
            return defer.promise;
          }
        }
      })

  .state('tab.map', {
    url: '/map?lat&lng',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    },
    data: {
      hideHeader: true
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/menu');

})

.run(function($rootScope, $interval, $state) {

  $rootScope.$watch('current.language', function(lang) {
    if (lang == 'je') {
      $('.rlt').attr('dir', 'rtl')
    } else {
      $('.rlt').attr('dir', 'ltr')
    }
  });

  try {
  $rootScope.$state = $state;

  var n = 0;
  function getRandomImage() {
    n++;
    if (n > $rootScope.images.length - 1) {
      n = 0;
    }
    return $rootScope.images[ n ];
  }

  $rootScope.images = [
    {
      source: "img/1.jpg"
    },
    {
      source: "img/2.jpg"
    },
    {
      source: "img/3.jpg"
    }
  ];

    var timer = null;
    var nextImage = function () {
      $rootScope.$apply(function () {
        $rootScope.image = getRandomImage();
      });
      timer = setTimeout(nextImage, 3000);
    };
    nextImage();
  } catch (e) {
    alert(e)
  }
})
