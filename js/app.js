// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
  getAppVersion(function(version) {
    alert(version);
  });
}

angular.module('homeviewapp', ['ionic', 'homeviewapp.controllers', 'homeviewapp.services', 'uiSlider'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.plugins && window.plugins.gaPlugin) {
      console.log("google analyctics initialized");
      gaPlugin = window.plugins.gaPlugin;
      gaPlugin.init(gaSuccessHandler, gaErrorHandler, "UA-56289664-1", 10);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('ad', {
      url: '/ad',
      abstract: true,
      templateUrl: 'templates/ads.html'
    })

    .state('ad.home', {
      url: '/home',
      views: {
        'ad-home': {
          templateUrl: 'templates/ad-home.html',
          controller: 'AdCtrl'
        }
      }
    })

    .state('map', {
      url: "/map",
      abstract: true,
      templateUrl: "templates/map.html"
    })

    .state('map.home', {
      url: '/home',
      views: {
        'map-home': {
          templateUrl: 'templates/map-home.html',
          controller: 'HomeCtrl'
        }
      }
    })



    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:
    
    /*.state('tab.ad', {
      url: '/ad',
      views: {
        'tab-home': {
          templateUrl: 'templates/ad-home.html',
          controller: 'AdCtrl'
        }
      }
    })*/

    /*.state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })*/

    .state('tab.listing-detail', {
      url: '/home/:mls',
      views: {
        'tab-search': {
          templateUrl: 'templates/listing-detail.html',
          controller: 'ListingDetailCtrl'
        }
      }
    })

    .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('tab.favorite-detail', {
      url: '/favorites/:favoriteId',
      views: {
        'tab-search': {
          templateUrl: 'templates/favorite-detail.html',
          controller: 'FavoriteDetailCtrl'
        }
      }
    })

    .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })

    .state('tab.search-results', {
      url: '/search/results',
      views: {
        'tab-search': {
          templateUrl: 'templates/search-results.html',
          controller: 'SearchResultsCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/ad/home');

})

.factory('DataSource', ['$http',function($http){
     return {
         get: function(fileName,callback){
              $http.get(fileName).
              success(function(data, status) {
                  callback(data);
              });
         }
     };
  }]);


var GalleryController = function($scope,DataSource) {
    var IMAGE_WIDTH = 380;
    var THUMB_IMAGE_WIDTH = 65;
    
    // Retrieve and set data 
    /*DataSource.get("images.json",function(data) {
        $scope.galleryData = data;
        $scope.selected = data[0];
    });*/
    
    // Scroll to appropriate position based on image index and width
    $scope.scrollTo = function(image,ind,length) {
        $scope.listposition = {left:((IMAGE_WIDTH+20) * ind * -1) + "px"};

        /* if ind > 2 */
        var left = 0;
        if(length > 6) {
          if(ind > 2) {
            left = ((THUMB_IMAGE_WIDTH+4) * (ind-2) * -1);
          } 
          if(ind > length - 4) {
            left = ((THUMB_IMAGE_WIDTH+4) * (length-6) * -1);
          }
        }
        
        $scope.navposition = {left: left + "px"};

        //console.log($scope.navposition);
        $scope.selected = image;
    };
};

