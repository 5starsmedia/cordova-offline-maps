angular.module('starter.services', [])

.factory('Data', function($http, $q, $filter) {

  var promise = $http.get('http://jew.5stars.link/api/data');

  return {
    search: function(query) {
      var def = $q.defer();

      promise.success(function(data) {
        var sData = _.filter(data, { type: 'page' });
        sData = $filter('filter')(sData, {'title': query});
        def.resolve(sData)
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    },
    getItems: function(items) {
      var def = $q.defer();

      promise.success(function(data) {
        var res = _.filter(data, function(item) {
          return items && items.indexOf(item.id) != -1;
        });
        def.resolve(res)
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    },
    getByAlias: function(items) {
      var def = $q.defer();

      promise.success(function(data) {
        var res = _.filter(data, function(item) {
          return items && items.indexOf(item.alias) != -1;
        });
        def.resolve(res)
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    },
    get: function(pageId) {
      var def = $q.defer();

      promise.success(function(data) {
        var page = _.find(data, { alias: pageId });
        if (page) {
          def.resolve(page);
        } else {
          def.reject({ err: 'notfound' });
        }
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    }
  };
})
