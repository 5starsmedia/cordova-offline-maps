// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

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

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.menu', {
      url: '/menu',
      views: {
        'tab-menu': {
          templateUrl: 'templates/tab-chats.html',
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
        url: '/menu/browse',
        views: {
          'tab-menu': {
            templateUrl: 'templates/page-list.html',
            controller: 'PageListCtrl'
          }
        },
        resolve: {
          page: function(Data) {
            return Data.get('browse');
          }
        }
      })
      .state('tab.browse/info', {
        url: '/menu/browse/:id',
        views: {
          'tab-menu': {
            templateUrl: 'templates/page-objectInfo.html',
            controller: 'PageListCtrl'
          }
        },
        resolve: {
          page: function(Data) {
            return {};
          }
        }
      })
    .state('tab.objectInfo', {
      url: '/menu/:chatId',
      views: {
        'tab-menu': {
          templateUrl: 'templates/page-objectInfo.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/menu');

})

.run(function($rootScope, $interval, $state) {

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
  $rootScope.image = getRandomImage();

  $interval(function() {
    $rootScope.image = getRandomImage();
  }, 3000);
})
