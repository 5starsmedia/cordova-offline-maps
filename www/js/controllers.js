angular.module('starter.controllers', [])

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

.controller('ChatsCtrl', function($scope, $interval, $ionicPopup) {
  var n = 0;
  function getRandomImage() {
    n++;
    if (n > $scope.images.length - 1) {
      n = 0;
    }
    $scope.n = n;
    return $scope.images[ n ];
  }

  $scope.images = [
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
    $scope.image = getRandomImage();
  };
  $interval(nextImage, 3000);
  nextImage();
})

.controller('PageListCtrl', function($scope, page, Data) {
  $scope.page = page;

  var places = _.find(page.content, { type: 'places' });
  if (places) {
    Data.getItems(places.items).then(function (items) {
      $scope.places = items;
    });
  }

  if (page.items) {
    Data.getItems(page.items).then(function (items) {
      $scope.list = items;
    });
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
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
