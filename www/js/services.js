angular.module('starter.services', [])

.factory('Data', function($http, $q, $filter) {

  var promise = $http.get('http://jew.5stars.link/api/data');

  return {
    getRegions: function() {
      var def = $q.defer();

      promise.success(function(data) {
        var regions = _.reverse(angular.copy(data));
        def.resolve(regions)
      }).error(function(err) {
        def.reject(err);
      });
      return def.promise;
    },
    search: function(query) {
      var def = $q.defer();

      promise.success(function(data) {
        var sData = _.filter(data.places, { type: 'page' });
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
        var res = _.filter(data.places, function(item) {
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
        var res = _.filter(data.places, function(item) {
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
        var page = _.find(data.places, { alias: pageId });
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
.service('weatherService', function($http){
  this.async = function(lat,lng){
    return $http.get(encodeURI('http://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="(' + lat + ',' + lng + ')")&format=json'))
      .then(function (response) {
          return response.data;
        });
  },
    this.toC = function(f){
      return Math.ceil(Number((f  -  32)  * 5/9).toFixed(2));
    },
    this.toF = function(c){
      return Math.floor(Number((c  *  9/5) + 32).toFixed(1));
    }
});