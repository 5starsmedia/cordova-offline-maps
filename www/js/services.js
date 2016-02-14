angular.module('starter.services', [])

.factory('Data', function($http, $q) {

  var promise = $http.get('data.json');

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    getItems: function(items) {
      var def = $q.defer();

      promise.success(function(data) {
        def.resolve(_.filter(data, function(item) {
          return items && items.indexOf(item.id) != -1;
        }))
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    },
    get: function(pageId) {
      var def = $q.defer();

      promise.success(function(data) {
        def.resolve(_.find(data, { alias: pageId }))
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    }
  };
})
