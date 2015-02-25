angular.module('homeviewapp.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Favorites', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var favorites = [
    { id: 0, address: '9108 W Norma Trl', mls: '12442' }, //name: 'Scruff McGruff' },
    { id: 1, address: '555 Test St', mls: '5234' }//, // name: 'G.I. Joe' },
    //{ id: 2, name: 'Miss Frizzle' },
    //{ id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return favorites;
    },
    get: function(favoriteId) {
      // Simple index lookup
      return favorites[favoriteId];
    },
    save: function(mls) {
      console.log("localstorage" + window.localStorage["favoriteListings"]);
      var favoriteListings = [];
      if(window.localStorage["favoriteListings"] !== undefined) {
          favoriteListings = JSON.parse(window.localStorage['favoriteListings']);
          console.log(favoriteListings);
      }

      //console.log(favoriteListings.indexOf(mls));

      if(favoriteListings.indexOf(mls) == -1) {
          favoriteListings.push(mls);
      }
      
      //console.log("adding mls: " + mls);

      window.localStorage["favoriteListings"] = JSON.stringify(favoriteListings);  
    },
    isFavorite: function(mls) {
      console.log("is favorite? " + mls);

      if(window.localStorage["favoriteListings"] != undefined) {
        var favorites = JSON.parse(localStorage["favoriteListings"]);
        var index = favorites.indexOf(mls);
        console.log("index: " + index);

        if(index > -1) {
          return true;
        }
      }

      return false;
    },
    remove: function(mls) {
      var favorites = JSON.parse(localStorage["favoriteListings"]);
      var index = favorites.indexOf(mls);
      if(index > -1) {
        favorites.splice(index, 1);
        window.localStorage["favoriteListings"] = JSON.stringify(favorites);
        return true;
      } else {
        return false;
      }
    }
  }
})

.factory('Listings', function($http, ErrorLog) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var listings = [{ id: 0, address: '9108 W Norma Trl', mls: '12442' }];
  var jsonpurl = "http://www.re605.com/homeviewapp/re605appgetlisting/?callback=JSON_CALLBACK";

  return {
    all: function() {
      return listings;
    },
    get: function(mls) {
      // Simple index lookup
      // jsonp to get listing details
      console.log("MLS:" + mls);

      $http.jsonp(jsonpurl, {params: {
                mls: mls,
                type: "json"
            }}).success(function(data){
              console.log(data);
              if(data.result == "success") {
               

                return data.listing;
              } else {
                  alert("There was a problem retrieving this listing. This issue has been logged and reported.");
                  ErrorLog.store({url: jsonpurl, params: {mls: mls, type: "json"}, description: "unable to retrieve listing from services.Factory.Listings.get, jsonp succedded."});
              }
        }).error(function(data, status) {
            alert("There was a problem retrieving this listing. This issue has been logged and reported.");
            ErrorLog.store({url: jsonpurl, params: {mls: mls, type: "json"}, description: "unable to retrieve listing from services.Factory.Listings.get, jsonp failed."});
        });

      //return listings[listingId];
    }
  }
})
.factory('RootScope', function() {
  var scope = {'showTabs': true};
  //var scope.showTabs = true;
//
  return scope;
})
.factory('CheckAppVersion', function($http, ErrorLog) {
  getAppVersion(function(version) {
    alert(version);
  });
})
.factory('Ads', function($http, ErrorLog) {
  var jsonpurl = "http://www.re605.com/homeviewapp/re605appads/?callback=JSON_CALLBACK";
  var Ads = {
    gethome: function() {
      var promise = $http.jsonp(jsonpurl, {params: {adtype:"home", type:"json"}}).then(function (response) {
        //console.log(response);
        if(response.data.result == "success") {
          return response.data.ads;

        } else {
            //alert("There was a problem retrieving this listing. This issue has been logged and reported.");
            ErrorLog.store({url: jsonpurl, params: {adtype: "home", type: "json"}, description: "unable to retrieve ad from from services.Factory.Ads.gethome, jsonp succedded."});
        }
        
      });
      return promise;
    },
    getfooter: function() {
      var promise = $http.jsonp(jsonpurl, {params: {adtype:"footer", type:"json"}}).then(function (response) {
        //console.log(response);
        if(response.data.result == "success") {
          return response.data.ads;

        } else {
            //alert("There was a problem retrieving this listing. This issue has been logged and reported.");
            ErrorLog.store({url: jsonpurl, params: {adtype: "footer", type: "json"}, description: "unable to retrieve ad from from services.Factory.Ads.getfooter, jsonp succedded."});
        }
      });
      return promise;
    },
    gethomeandfooter: function() {
      var promise = $http.jsonp(jsonpurl, {params: {adtype:"homeandfooter", type:"json"}}).then(function (response) {
        if(response.data.result == "success") {
          return response.data.ads;

        } else {
            //alert("There was a problem retrieving this listing. This issue has been logged and reported.");
            ErrorLog.store({url: jsonpurl, params: {adtype: "homeandfooter", type: "json"}, description: "unable to retrieve ad from from services.Factory.Ads.gethomeandfooter, jsonp succedded."});
        }
      });
      return promise;
    }
  };
  return Ads;
})

.factory('ErrorLog', function($http) {
    var jsonpurl = "http://www.re605.com/homeviewapp/re605applog/?callback=JSON_CALLBACK&type=json";

    return {
      store: function(obj) {
        $http.jsonp(jsonpurl, {params: obj}).then(function (response) {
          console.log("successfully sent error log");
          //return response.data.ads;
        });
      }
    }
  })

.factory('searchcriteria', function() {

  var criteria = [{location: null, state: "SD", lat:null, lng:null, radius: 5, minprice: 50000, maxprice: 100000, minbeds: 1, maxbeds: 3, minbaths: 1, maxbaths: 2}];

  return {
    store: function(c) {
      //console.log("setting");
      //console.log(c);
      criteria = c;
    },
    get: function() {
      //console.log("getting");
      //console.log(criteria);
      return criteria;
    }
  }
})

.factory('currency', function() {

    return {
      get: function(amount) {
        var i = parseFloat(amount.replace('$',''));
    

        if(isNaN(i)) { i = 0.00; }
        var minus = '';
        if(i < 0) { minus = '-'; }
        i = Math.abs(i);
        i = parseInt((i + .005) * 100);
        i = i / 100;
        

        s = new String(i);
        

        //if(s.indexOf('.') < 0) { s += '.00'; }
        if(s.indexOf('.') == (s.length - 2)) { s += '0'; }

        

        /*var start = s.indexOf('.') - 1;
        for (var i = start; i >= 0; i=i-3) {

        };*/

        $withCommas = function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            //console.log(parts[0]);

            return parts.join(".");
        }

        s = $withCommas(s);
        s = minus + s;

        return s;
      }
    }
        
  });
