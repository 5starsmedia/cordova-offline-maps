angular.module('starter.services', [])

.factory('Data', function($http, $q, $filter) {

  var promise = $http.get('data.json');

  return {
    search: function(query) {
      var def = $q.defer();

      promise.success(function(data) {
        var sData = _.filter(data, { type: 'page' });
        sData = $filter('filter')(sData, {'title': query});
        console.info(sData)
        def.resolve(sData)
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
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
