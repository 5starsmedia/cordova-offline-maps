angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

})

.controller('ChatsCtrl', function($scope, $interval, $ionicPopup) {
  $scope.countDown = 0; // number of seconds remaining
  var stop;

  $scope.timerCountdown  = function(){
    // set number of seconds until the pizza is ready
    $scope.countDown = 10;

    // start the countdown
    stop = $interval(function() {
      // decrement remaining seconds
      $scope.countDown--;
      // if zero, stop $interval and show the popup
      if ($scope.countDown === 0){
        $interval.cancel(stop);
        var alertPopup = $ionicPopup.alert({
          title: 'Your Pizza Is Ready!',
          template: 'Bon Appétit!'});
      }
    },1000,0); // invoke every 1 second
  };
})

.controller('PageListCtrl', function($scope, page) {
  $scope.page = page;

  $scope.list = page.items;
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, Data) {
  $scope.chat = Chats.get($stateParams.chatId);
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
} catch (e) {
  alert(e);
}
});
