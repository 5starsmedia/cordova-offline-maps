angular.module('starter.controllers', [])

    .run(function($rootScope) {
      $rootScope.current = { language: 'ru' };
    })
    .filter('translate', function ($rootScope) {
      return function (input, field) {
        if (angular.isObject(input) && input.translates && input.translates[field] && input.translates[field][$rootScope.current.language]) {
          return input.translates[field][$rootScope.current.language] || input.translates[field]['ru'];
        }
        if (!input || !input[field]) {
          return;
        }
        return input[field];
      };
    })
.controller('SearchCtrl', function($scope, Data) {

  $scope.current = {
    query: ''
  }

  $scope.$watch('current.query', function(query) {
    if (query == '') {
      $scope.items = [];
      return;
    }
    Data.search(query).then(function (items) {
      $scope.items = items;
    });
  });

})

.controller('ChatsCtrl', function($scope, $interval, $ionicModal, Data) {
  var n = 0;
  function getRandomImage() {
    n++;
    if (n > $scope.images.length - 1) {
      n = 0;
    }
    $scope.n = n;
    return $scope.images[ n ];
  }


  Data.getByAlias(['browse', 'places', 'synagogues', 'community', 'hostels', 'food', 'help', 'world', 'compass']).then(function (items) {
    $scope.menu = items;
  });

  $scope.currentMap = 'online';
  $scope.languages = [
    {alias: 'ru',title: 'Русский'},
    {alias: 'fr',title: 'Français'},
    {alias: 'en',title: 'English'},
    {alias: 'je',title: 'Иврит'}
  ];
  $scope.mapTypes = [
    {value: 'online',title: 'Online'},
    {value: 'offline',title: 'Offline'}
  ];

  $ionicModal.fromTemplateUrl('settings', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showSettings = function() {
    $scope.modal.show();
  };

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  var timer = null;
  var nextImage = function () {
    $scope.image = getRandomImage();
  };
  $interval(nextImage, 3000);
  nextImage();
})

.controller('PageListCtrl', function($scope, page, Data, $ionicScrollDelegate) {
  $scope.page = page;

  var places = _.find(page.content, { type: 'places' });
  if (places) {
    Data.getItems(places.items).then(function (items) {
      $scope.places = items;
    });
  }

  if (page.items) {
    Data.getItems(page.items).then(function (items) {
      if (page.filter) {
        items = _.filter(items, page.filter);
      }
      $scope.list = items;
    });
  }

  Data.getRegions().then(function (items) {
    $scope.regions = _.reverse(items);
  });

  $scope.toggleItem = function(item) {
    item.$$isShow = !item.$$isShow;
    $ionicScrollDelegate.resize();
  }
})

.controller('MapCtrl', function($scope, $stateParams) {
  $scope.buildPath = $stateParams;
  $scope.center = {
    lat: 49.1673,
    lng: 31.0474,
    zoom: 5
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('MoneyCtrl', function($scope, $http) {
  $scope.current = {
    money: 1000,
  };
  $scope.currentVal = 1000;
  $scope.loading = true;
  $http.get('http://jew.5stars.link/api/money').then(function(items) {
    $scope.loading = false;
    $scope.rates = items.data;
    $scope.current.rate = 'USD';
  }, function() {
    $scope.loading = false;
    $scope.error = true;
  });

  $scope.$watch('current', function() {
    if (!$scope.rates) {
      return;
    }
    var rate = _.find($scope.rates, { cc: $scope.current.rate });
    $scope.currentVal = Math.round(($scope.current.money || 0) * rate.rate * 100) / 100;
  }, true);
})

.controller('PageCompassCtrl', function($scope) {
try {
  var rotate_object = document.getElementById('needle');
  var watchID = null;

  function startNeedle() {
    rotate_object.style['-webkit-transform'] = 'rotate(0deg)';
    rotate_object = document.getElementById('needle');
  }

  function startCompass() {
    rotate_object.style['-webkit-transform'] = 'translateX(-12px) rotate(0deg)';
    rotate_object = document.getElementById('compass');
  }


// Array of names for directions for Info panel
  var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];

  function direction(heading) {
    var dir = Math.abs(parseInt((heading) / 45) + 1);
    return directions[dir];
  }

  function startWatch() {

    var options = {frequency: 100};
    if (!navigator.compass) {
      alert('no navigator.compass');
      return;
    }

    watchID = navigator.compass.watchHeading(onSuccess, onError, options);
  }

// Stop watching the compass
//
  function stopWatch() {
    if (watchID) {
      navigator.compass.clearWatch(watchID);
      watchID = null;
    }
  }

// onSuccess: Get the current heading
//
  function onSuccess(heading) {
    var transform = null;
    if (rotate_object.id == 'needle') {
      transform = ' translateX(-12px) rotate(' + (360 - heading.magneticHeading) + 'deg)';
    }
    else {
      transform = 'rotate(' + -1 * (heading.magneticHeading) + 'deg)';
    }
    rotate_object.style['-webkit-transform'] = transform;

    // Change Info panel
    //document.getElementById('info-panel').innerHTML =
    //    direction(heading.magneticHeading) + '<br>' + parseInt(heading.magneticHeading) + ' &deg;';
  }

// onError: Failed to get the heading
//
  function onError(compassError) {
    alert('Compass error: ' + compassError.code);
  }


  startWatch();
  $scope.$on('$destroy', stopWatch);
} catch (e) {
  alert(e);
}
});
