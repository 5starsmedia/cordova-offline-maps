angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('PageCompassCtrl', function($scope) {
  var rotate_object = null;
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

    var options = { frequency: 100 };

    watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    $('#freeze+div').show();
  }

// Stop watching the compass
//
  function stopWatch() {
    if (watchID) {
      navigator.compass.clearWatch(watchID);
      watchID = null;
      $('#freeze+div').hide();
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
    document.getElementById('info-panel').innerHTML =
        direction(heading.magneticHeading) + '<br>' + parseInt(heading.magneticHeading) + ' &deg;';
  }

// onError: Failed to get the heading
//
  function onError(compassError) {
    alert('Compass error: ' + compassError.code);
  }


  startWatch();
  $scope.$on('$destroy', stopWatch);

});
