
angular.module('homeviewapp.controllers', [])

.controller('AdCtrl', function($scope,$http,$state,$location, Ads, AppVersion) {
    //console.log("AdCtrl");

    $scope.adurl = "http://www.re605.com/_client_media/ads/";
    $scope.showAd = true;
    $scope.hideTabs = true;
    $scope.adLoaded = false; 
    $scope.loading = true;
    
    $scope.close_ad = function() {
        console.log("closing ad");

        $scope.showAd = false;
        //window.localStorage["viewedAd"] = true;
        window.localStorage["lastViewedAd"] = Date.now();
        //$state.transitionTo("tab.home");
        //window.location = '/#/tab/home';

        $state.go("map.home");

        //$location.url('/', true);
        //$location.path('/#/tab/home');
        //window.location = "/#/tab/home";
    }

    $scope.init = function() {
        //console.log("init");

        $scope.showAd = true;

        if(gaPlugin) {
            gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Ad", "Load", "Load Ad", 1);
        }
        

        cordova.getAppVersion(function(version) { // works
          // get current version from database...
          alert("test version: " + AppVersion.getversion());

          //alert("version:" + version);
        });

        //console.log($scope);
        //console.log(window.localStorage["lastViewedAd"]);
        
        //RootScope.showTabs = false;
        //$scope.showTabs = RootScope.showTabs;
        //console.log(RootScope);

        if(window.localStorage["lastViewedAd"] != undefined) {
            var lastViewed = window.localStorage["lastViewedAd"];
            //console.log("last viewed: " + lastViewed);
            // if now is ### hours after lastViewed, then show ad.
            var datenow = Date.now();
            //console.log("datenow: " + datenow);

            // milliseconds in 1 hour = 1000 * 60 * 60
            var ms_hour = 1000 * 60 * 60;

            var difference = datenow - lastViewed;
            if(difference > ms_hour) {
                $scope.showAd = true;
            } else {
                $scope.showAd = false;
            }
        }

        //$scope.showAd = window.localStorage["lastViewedAd"] == undefined ? true : false;
        //$scope.showAd = true;
        if($scope.showAd) {
            //console.log("getting ad");
            Ads.gethome().then(function(ads) {
                var homead = ads[0];
                if(homead != undefined) {
                    var homelink = "";
                    if(homead.link_url != "#") {
                        homelink = "<a href='" + homead.link_url + "' target='_blank'><img src='" + $scope.adurl + homead.name + "' /></a>";
                    } else {
                        homelink = "<img src='" + $scope.adurl + homead.name + "' />";
                    }

                    document.getElementById('home_ad_container').innerHTML = homelink;
                    $scope.adLoaded = true; 
                    $scope.loading = false;
                } else {
                    $scope.loading = false;
                    $state.go("map.home");
                }
            });
        } else { 
            $scope.loading = false;
            $state.go("map.home");
        }
    }

    //console.log("Calling init");
    $scope.init();
})
.controller('HomeCtrl', function($scope, $window, $http, Ads, Favorites, ErrorLog) {

    $scope.lat = "43.541033";
    $scope.lng = "-96.7457591";
    $scope.accuracy = "0";
    $scope.error = "";
    $scope.model = { myMap: undefined };
    $scope.listing = null;
    $scope.listings = [];
    $scope.markers = [];
    $scope.adurl = "http://www.re605.com/_client_media/ads/";

    $scope.loading = false;

    /*$scope.showAd = true;
    
    $scope.close_ad = function() {
        $scope.showAd = false;
        //window.localStorage["viewedAd"] = true;
        window.localStorage["lastViewedAd"] = Date.now();
        //$state.transitionTo("tab.search-results");
        //$state.go("tab.home");
        //$location.url('/', true);
        //$location.path('/#/tab/home');
        //window.location = "/#/tab/home";
    }*/


    $scope.pageTitle = "Map View";

    $scope.houseIcon = L.icon({
        iconUrl: 'https://s3-us-west-2.amazonaws.com/homeviewapp/images/app/icon-marker.png'
    });
    $scope.greenHouseIcon = L.icon({
        iconUrl: 'https://s3-us-west-2.amazonaws.com/homeviewapp/images/app/icon-green-marker.png'
    });

    $scope.jsonpurl = "http://www.re605.com/homeviewapp/re605applistings/?callback=JSON_CALLBACK";

    $scope.mapoptions = {
        zoom: 8,
        center: [$scope.lat, $scope.lng] /*new google.maps.LatLng($scope.lat, $scope.lng),*/
        /*mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true*/
    }

    $scope.map = null;

    $scope.showResult = function () {
        return $scope.error == "";
    }

    /* get current location */

    

    

    $scope.initializeMap = function() {
        Ads.getfooter().then(function(ads) {

            var link = "";
            if(ads[0].link_url != "#") {
                link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
            } else {
                link = "<img src='" + $scope.adurl + ads[0].name + "' />";
            }
            document.getElementById('footer_ad_container').innerHTML = link;
        });

        //ErrorLog.store({description: "initializing map"});

        $scope.map = L.map('map', {tap: false});

        var gmap_layer = new L.Google('ROADMAP');
        $scope.map.addLayer(gmap_layer);

        if(gaPlugin) {
            gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Map", "Load", "Load Map", 1);
        }
        

        //ErrorLog.store({description: "added map layer"});
        
        /*L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            subdomains: '1234'
        }).addTo($scope.map);*/

        /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo($scope.map);*/

        /*L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '@TekMtn',
            id: 'examples.map-i86knfo3'
        }).addTo($scope.map);*/

        /*L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'examples.map-i86knfo3'
        }).addTo($scope.map);*/

        /*var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
        }).addTo($scope.map);*/

        /* disabled geolocation due to ios 8 for now. */
        $scope.map.setView([$scope.lat, $scope.lng], 17);
        $scope.map.on('dragend', $scope.mapGetListingsByBounds);
        $scope.mapGetListingsByBounds();
        
        function onLocationFound(e) {
            $scope.lat = e.latlng.lat;
            $scope.lng = e.latlng.lng;
            $scope.map.setView([$scope.lat, $scope.lng], 17);

            $scope.map.on('dragend', $scope.mapGetListingsByBounds);
            /*google.maps.event.addListener($scope.map, 'idle', function(event) {
                $scope.mapGetListingsByBounds();
            });*/

            $scope.mapGetListingsByBounds();
        }

        function onLocationError(e) {
            //ErrorLog.store({description: "error location not found"});
            $scope.map.setView([$scope.lat, $scope.lng], 17);

            $scope.map.on('dragend', $scope.mapGetListingsByBounds);

            $scope.mapGetListingsByBounds();

            //alert("Your location was unable to be found. Please check to be sure you have location services enabled.")
            //ErrorLog.store({e: e, description: "unable to find location"});
            //alert(e.message);
        }

        //$scope.getLocation(); // debug function
        $scope.map.on('locationfound', onLocationFound);
        $scope.map.on('locationerror', onLocationError);

        $scope.map.locate({setView: true});


    }

    /* preview close */

    $scope.closePreview = function() {
        document.getElementById("preview").style.display = "none";
        document.getElementById("map").style.height = "100%";
        $scope.listing = null;
        $scope.map.invalidateSize(true);
        //$scope.initializeMap();
    }

    $scope.saveFavorite = function(mls) {
        Favorites.save(mls);
        $scope.listing.isFavorited = true;
    }

    $scope.removeFavorite = function(mls) {
        Favorites.remove(mls);
        $scope.listing.isFavorited = false;
    }

    /*$scope.doListener = function() {

    }*/

    //$scope.getLocation();

    $scope.mapGetListingsByBounds = function(e) {

        //ErrorLog.store({description: "start of mapgetlistingsbybounds"});

        var bounds = $scope.map.getBounds();

        //console.log(bounds);

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        /*console.log(ne);
        console.log(sw);*/

        var nelat = ne.lat;
        var nelng = ne.lng;
        var swlat = sw.lat;
        var swlng = sw.lng;

        /*console.log(nelat);
        console.log(nelng);
        console.log(swlat);
        console.log(swlng);*/

        $http.jsonp($scope.jsonpurl, {params: {
                nelat: nelat,
                nelng: nelng,
                swlat: swlat,
                swlng: swlng,
                type: 'json'
            }}).success(function(data){

                if(data.result == "success") {
                    //console.log(data);
                    //console.log("found " + data.listings.length + " listings");
                    $scope.listings = data.listings;
                    
                    $scope.createMarkers();

                    for(x in $scope.listings) {

                        var icon = $scope.houseIcon;

                        if(window.localStorage["viewedListings"] !== undefined) {
                            viewedListings = JSON.parse(window.localStorage['viewedListings']);
                            if(viewedListings.indexOf($scope.listings[x].mls_number) != -1) {
                                icon = $scope.greenHouseIcon;
                            }
                            //console.log(viewedListings);
                        }

                        $scope.listings[x].marker = new L.Marker(new L.LatLng($scope.listings[x].latitude, $scope.listings[x].longitude), {
                            title: $scope.listings[x].address,
                            icon: icon
                        }).addTo($scope.map);

                        $scope.listings[x].marker.on('click', $scope.onMarkerClick($scope.listings[x]));

                        //marker.bindPopup($scope.listings[x].address);
                    }


                    $scope.loading = false;

                    //console.log("done");
                } else {
                    alert("There was a problem retrieving listings. This issue has been logged and reported.");
                    ErrorLog.store({url: $scope.jsonpurl, params: {nelat: nelat, nelng: nelng, swlat: swlat, swlng: swlng, type: "json"}, description: "problem retrieving listings, jsonp succedded"});
                }
            
        }).error(function(data, status) {
            alert("There was a problem retrieving listings. This issue has been logged and reported.");
            ErrorLog.store({url: $scope.jsonpurl, params: {nelat: nelat, nelng: nelng, swlat: swlat, swlng: swlng, type: "json"}, description: "problem retrieving listings, jsonp failed"});
        });
    }

    $scope.createMarkers = function() {
        //console.log("creating markers");

        for(x in $scope.listings) {
            //console.log(x);
            /*$scope.listings[x].marker = {
                position: new google.maps.LatLng($scope.listings[x].latitude, $scope.listings[x].longitude),
                map: $scope.map,
                title: $scope.listings[x].address
            };*/

            var preview = $scope.listings[x].summary;
            var words = preview.split(" ");
            if(words.length > 30) {
                preview = "";
                for(var i = 0; i < 30; i++) {
                    preview += words[i] + " ";
                }
                preview += "...";
            }

            var img = "http://images-homeview.re605.com/images/property/" + $scope.listings[x].mls_number + "/1.jpg";          
            var elementId = "img_" + $scope.listings[x].mls_number + "_1";  
            //$scope.isValidImage(img, $scope.validateImage, elementId);

            $scope.listing = $scope.listings[x];
            if(!isNaN($scope.listing.price)) {
                $scope.listing.price = "$" + $scope.listing.price;
            }
            //$scope.listing.preview = preview + " <a href='#/tab/home/" + $scope.listings[x].mls_number + "'>View More</a>";

            $scope.listings[x].previewBody = '<div id="previewContent">'+
                '<div id="siteNotice">'+
                '</div>' +
                '<div class="clearfix"></div>' +
                '<div id="previewBody">'+

                //'<p>' + $filter('currency')($scope.listings[x].price, 'XXX') + '</p>'+
                
                '<div class="previewListingImage"><img id="' + elementId + '" class="img-preview" src="' + img + '" /></div>'+
                '<div class="previewText"><p>' + preview + ' <a href="#/tab/home/' + $scope.listings[x].mls_number + '">View More</a></p></div>'+
                '</div>'+
                '</div>';
        }
    }

    $scope.viewListingDetail = function(mls_number) {
        $window.location.href = '#/tab/home/' + mls_number;
    }

    $scope.onMarkerClick = function(listing) {
        //console.log(e);
        return function () {
            //console.log(listing);

            if(gaPlugin) {
                gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Map", "Click", "Preview Click", listing.mls_number);
            }
            

            $scope.listing = listing;

            $scope.listing.isFavorited = Favorites.isFavorite($scope.listing.mls_number);
            //console.log("is favorited", $scope.listing.isFavorited);

            //document.getElementById("btnViewDetails").href = "#/tab/home/" + listing.mls_number;
            //document.getElementById("previewBody").innerHTML = listing.previewBody;
            document.getElementById("preview").style.display = "block";
            document.getElementById("map").style.height = "50%";
            /*if($scope.listing.isFavorited) {
                document.getElementById('saveFavoriteBtn').display = 'none';
                document.getElementById('removeFavoriteBtn').display = 'block';
            } else {
                document.getElementById('saveFavoriteBtn').display = 'block';
                document.getElementById('removeFavoriteBtn').display = 'none';
            }*/

            //document.getElemetnById("previewBody").height = (parseInt(h) / 2) + "px;";

            var h = document.getElementById('preview').offsetHeight;            
            h = parseInt(h) / 5;

            document.getElementById("previewBodyRow").style.height = (h * 3) + "px";
            document.getElementById("previewButtonsRow").style.height = (h * 2) + "px";

            $scope.map.invalidateSize(true);
            //$scope.map.setView(new L.LatLng(listing.latitude, listing.longitude), 17);
            $scope.map.panTo([listing.latitude, listing.longitude]);

            //console.log($scope.listing);

            document.getElementById("listingAddress").innerHTML = listing.address;
            document.getElementById("listingPrice").innerHTML = "$" + $scope.getCurrency(listing.price);
            document.getElementById("previewBody").innerHTML = listing.previewBody;

            $scope.map.removeLayer(listing.marker);

            var greenHouseIcon = L.icon({
                iconUrl: 'https://s3-us-west-2.amazonaws.com/homeviewapp/images/app/icon-green-marker.png'
            });
            listing.marker = new L.Marker(new L.LatLng(listing.latitude, listing.longitude), {
                title: listing.address,
                icon: greenHouseIcon
            }).addTo($scope.map);

            listing.marker.on('click', $scope.onMarkerClick(listing));

            //console.log(window.localStorage["viewedListings"]);
            var viewedListings = [];
            if(window.localStorage["viewedListings"] !== undefined) {
                viewedListings = JSON.parse(window.localStorage['viewedListings']);
                //console.log(viewedListings);
            }

            if(viewedListings.indexOf(listing.mls_number) == -1) {
                viewedListings.push(listing.mls_number);
            }

            
            window.localStorage["viewedListings"] = JSON.stringify(viewedListings);            
        }
        

        /**/
    }

    $scope.initializeMap();

    $scope.getCurrency = function(amount) {
        var i = parseFloat(amount.replace('$',''));
    

        if(isNaN(i)) { i = 0.00; }
        var minus = '';
        if(i < 0) { minus = '-'; }
        i = Math.abs(i);
        i = parseInt((i + .005) * 100);
        i = i / 100;
        

        s = new String(i);
        

        if(s.indexOf('.') < 0) { s += '.00'; }
        if(s.indexOf('.') == (s.length - 2)) { s += '0'; }

        

        /*var start = s.indexOf('.') - 1;
        for (var i = start; i >= 0; i=i-3) {

        };*/

        s = $scope.withCommas(s);
        s = minus + s;

        return s;
    }

    $scope.withCommas = function(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //console.log(parts[0]);

        return parts.join(".");
    }
})

.controller('FavoritesCtrl', function($scope, $http, Favorites, Ads, currency, ErrorLog) {

    $scope.jsonpurl = "http://www.re605.com/homeviewapp/re605appgetfavorites/?callback=JSON_CALLBACK";
    $scope.favoritesCount = 0;
    $scope.adurl = "http://www.re605.com/_client_media/ads/";

    Ads.getfooter().then(function(ads) {
        var link = "";
        if(ads[0].link_url != "#") {
            link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
        } else {
            link = "<img src='" + $scope.adurl + ads[0].name + "' />";
        }
        document.getElementById('footer_ad_container').innerHTML = link;
    });

    $scope.getCurrency = function(amt) {
        return '$' + currency.get(amt);
    }

    $scope.getFavorites = function() {

        if(gaPlugin) {
            gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Favorites", "Load", "Load Favorites", 1);
        }
        

        if(window.localStorage["favoriteListings"] !== undefined) {
            favoriteListings = window.localStorage['favoriteListings'];
            var favorites = JSON.parse(favoriteListings);
            $scope.favoritesCount = favorites.length;

            
            if($scope.favoritesCount > 0) {
                $http.jsonp($scope.jsonpurl, {params: {
                        favorites: favoriteListings,
                        type: "json"
                    }}).success(function(data){

                        if(data.result == "success") {
                            //("favorites :" + data.listings);


                            if(data.listings !== false) {
                                $scope.favoritesCount = data.listings.length;
                                $scope.listings = data.listings;
                            } else {
                                $scope.favoritesCount = 0;
                            }
                        } else {
                            alert("There was a problem retrieving your favorites. This issue has been logged and reported.");
                            ErrorLog.store({url: $scope.jsonpurl, params: {mls: $stateParams.mls, type: "json"}, description: "problem retrieving favorites, jsonp succedded"});
                        }

                    
                    
                }).error(function(data, status) {
                    alert("There was a problem retrieving your favorites. This issue has been logged and reported.");
                    ErrorLog.store({url: $scope.jsonpurl, params: {mls: $stateParams.mls, type: "json"}, description: "problem retrieving favorites, jsonp failed"});
                });
            }            
        }
    }

    $scope.getFavorites();
})

.controller('FavoriteDetailCtrl', function($scope, $stateParams, Ads, Favorites) {
    $scope.favorite = Favorites.get($stateParams.favoriteId);
    $scope.adurl = "http://www.re605.com/_client_media/ads/";

    if(gaPlugin) {
        gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Favorites", "Click", "View Favorite", $scope.favorite.mls_number);
    }
    

    Ads.getfooter().then(function(ads) {
        var link = "";
        if(ads[0].link_url != "#") {
            link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
        } else {
            link = "<img src='" + $scope.adurl + ads[0].name + "' />";
        }
        document.getElementById('footer_ad_container').innerHTML = link;
    });
})

.controller('ListingDetailCtrl', function($scope, $stateParams, $http, currency, $window, Ads, Favorites, ErrorLog) {
    //console.log("Getting listing details...");
    //console.log($stateParams);
    $scope.adurl = "http://www.re605.com/_client_media/ads/";
    $scope.jsonpurl = "http://www.re605.com/homeviewapp/re605appgetlisting/?callback=JSON_CALLBACK";
    $scope.listing = null;
    $scope.gallery = "";

    $scope.fieldDescriptions = [];
    $scope.fieldDescriptions["beds"] = "Beds";
    $scope.fieldDescriptions["baths"] = "Baths";
    $scope.fieldDescriptions["home_style"] = "Home&nbsp;Style";
    $scope.fieldDescriptions["garage_size"] = "Garage&nbsp;Size";
    $scope.fieldDescriptions["square_feet"] = "Sq&nbsp;Ft";
    $scope.fieldDescriptions["mls_number"] = "MLS&nbsp;Number";
    $scope.fieldDescriptions["virtual_tour_url"] = "Virtual&nbsp;Tour";
    $scope.fieldDescriptions["open_house_date"] = "Open House Date";
    $scope.fieldDescriptions["open_house_start"] = "Open House Start";
    $scope.fieldDescriptions["open_house_end"] = "Open House End";

    $scope.contact = {'name':'', 'email':'', 'phone':'', 'message':''};
    /*$scope.contact.name = "";
    $scope.contact.email = "";
    $scope.contact.phone = "";
    $scope.contact.message = "";*/

    Ads.getfooter().then(function(ads) {
        var link = "";
        if(ads[0].link_url != "#") {
            link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
        } else {
            link = "<img src='" + $scope.adurl + ads[0].name + "' />";
        }
        document.getElementById('footer_ad_container').innerHTML = link;
    });


    $scope.goBack = function() {
        $window.history.back();
    }

    $scope.sendMessage = function(mls_number) {
        
        var valid = true;
        var errmsg = "";

        if($scope.contact.name.length == 0) {
            valid = false;
            errmsg += "Please include your name.\n";
        }
        if($scope.contact.message.length == 0) {
            valid = false;
            errmsg += "Please include a message.\n";
        }

        if(!valid) {
            alert(errmsg);
        } else {

            var url = "http://www.re605.com/homeviewapp/re605appsendcontactform/?callback=JSON_CALLBACK";
            //console.log($scope.contact);
            $http.jsonp(url, {params: {
                    name: $scope.contact.name,
                    email: $scope.contact.email,
                    phone: $scope.contact.phone,
                    message: $scope.contact.message,
                    mls_number: mls_number
                }}).success(function(data){

                lh('submit', 'AGENT_EMAIL_SENT', {lkey:data.listing.listing_key});

                //console.log("good", data.listing.listing_key);

            }).error(function(data, status) {
                //console.log("bad");
            });
        }

        
    }

    $scope.metrics_report_event = function(event, listing_key) {
        //console.log("sending metrics for", event, listing_key);
        lh('submit', event, {lkey:listing_key});
    }

    $scope.view_virtual_tour = function(url) {
        window.open(url, '_system', 'location=yes');
    }

    $scope.saveFavorite = function() {
        var mls = $scope.listing.mls_number;
        Favorites.save(mls);
        $scope.isFavorited = true;
    }

    $scope.removeFavorite = function() {
        var mls = $scope.listing.mls_number;
        Favorites.remove(mls);
        $scope.isFavorited = false;
    }

    //$scope.listing = Listings.get($stateParams.mls);
    $scope.getListing = function() {

        if(gaPlugin) {
            gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Listing Details", "Click", "View Listing", $stateParams.mls);
        }

               

        $http.jsonp($scope.jsonpurl, {params: {
                mls: $stateParams.mls,
                type: "json"
            }}).success(function(data){

            if(data.result == "success") {
                $scope.listing = data.listing;
                //console.log("metrics reporting: ", $scope.listing.listing_key);
                lh('submit', 'DETAIL_PAGE_VIEWED', {lkey:$scope.listing.listing_key}); 
                $scope.isFavorited = Favorites.isFavorite($scope.listing.mls_number);
                $scope.listing.price = "$" + currency.get($scope.listing.price);
                $scope.listing.photos = [];
                //$scope.listing.default_picture = null;
                for (var i = 0; i < $scope.listing.picture_count; i++) {

                   $scope.listing.photos[i] = {src: "http://images-homeview.re605.com/images/property/" + $scope.listing.mls_number + "/" + (parseInt(i)+1) + ".jpg"};

                   /*if(i==0) {
                        $scope.listing.default_picture = $scope.listing.photos[0];
                    }*/
                };

                //console.log($scope.listing.photos);
            } else {
                alert("There was a problem retrieving the listing. This issue has been logged and reported.");
                ErrorLog.store({url: $scope.jsonpurl, params: {mls: $stateParams.mls, type: "json"}, description: "unable to find listing, jsonp succedded"});
            }
            

        }).error(function(data, status) {
            alert("There was a problem retrieving the listing. This issue has been logged and reported.");
            ErrorLog.store({url: $scope.jsonpurl, params: {mls: $stateParams.mls, type: "json"}, description: "unable to find listing, jsonp failed."});
        });
    }

    // initial image index
    $scope._Index = 0;
    // if a current image is the same as requested image
    /*$scope.isActive = function (index) {
        return $scope._Index === index;
    };*/
    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.listing.photos.length - 1;
    };
    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.listing.photos.length - 1) ? ++$scope._Index : 0;
    };
    // show a certain image
    /*$scope.showPhoto = function (index) {
        $scope._Index = index;
    };*/

    $scope.getListing();
})
.controller('SearchCtrl', function($scope, $http, $state, Ads, searchcriteria, currency) {
    $scope.foundLocation = false;
    $scope.adurl = "http://www.re605.com/_client_media/ads/";
    $scope.showResults = false;
    $scope.lat = null;
    $scope.lng = null;

    if(gaPlugin) {
        gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Search", "Load", "Load Search", 1);    
    }
    

    Ads.getfooter().then(function(ads) {
        var link = "";
        if(ads[0].link_url != "#") {
            link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
        } else {
            link = "<img src='" + $scope.adurl + ads[0].name + "' />";
        }
        document.getElementById('footer_ad_container').innerHTML = link;
    });

    //$scope.radiuses = [{miles: 5}, {miles: 10}, {miles: 25}, {miles: 50}];
    $scope.radiuses = [
      {miles:5},
      {miles:10},
      {miles:25},
      {miles:50}
    ];

    $scope.getCurrency = function(amt) {
        return '$' + currency.get(amt);
    }
    $scope.getItemHeight = function(item) {
        return 100;
    };
    $scope.getItemWidth = function(item) {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        //console.log(width);

        if(width > 540) {
            return '50%';
        } else {
            return '100%';
        }
    };


    //$scope.currencyFormatting = function(value) { return value.toString() + " $" }

    //console.log(window.localStorage["lastSearchedZipCode"].length);
    //alert(window.localStorage["lastSearchedZipCode"]);
    //$scope.useMyLocation = window.localStorage["lastSearchedUseMyLocation"] != undefined ? window.localStorage["lastSearchedUseMyLocation"] : false;
    $scope.location = window.localStorage["lastSearchedLocation"] != undefined ? window.localStorage["lastSearchedLocation"] : "";
    $scope.radius = window.localStorage["lastSearchedRadius"] != undefined ? window.localStorage["lastSearchedRadius"] : 5;
    $scope.minbeds = window.localStorage["lastSearchedMinBeds"] != undefined ? window.localStorage["lastSearchedMinBeds"] : "1";
    $scope.maxbeds = window.localStorage["lastSearchedMaxBeds"] != undefined ? window.localStorage["lastSearchedMaxBeds"] : "3";
    $scope.minbaths = window.localStorage["lastSearchedMinBaths"] != undefined ? window.localStorage["lastSearchedMinBaths"] : "1";
    $scope.maxbaths = window.localStorage["lastSearchedMaxBaths"] != undefined ? window.localStorage["lastSearchedMaxBaths"] : "2";
    $scope.minprice = window.localStorage["lastSearchedMinPrice"] != undefined ? window.localStorage["lastSearchedMinPrice"] : "50000";
    $scope.maxprice = window.localStorage["lastSearchedMaxPrice"] != undefined ? window.localStorage["lastSearchedMaxPrice"] : "100000";

    $scope.search = function() {

        /*if($scope.useMyLocation) {
            $scope.getLocation();
        }*/

        var useMyLocation = document.getElementById("useMyLocation").checked;

        //console.log("use my location: ", useMyLocation);

        var location = document.getElementById("location").value;
        var radius = document.getElementById("radius").value;
        var minbeds = document.getElementById("minbeds").value;
        var maxbeds = document.getElementById("maxbeds").value;
        var minbaths = document.getElementById("minbaths").value;
        var maxbaths = document.getElementById("maxbaths").value;
        var minprice = document.getElementById("minprice").value;
        var maxprice = document.getElementById("maxprice").value;

        if(gaPlugin) {
            gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Search", "Click", "Submit Search", location);
        }
        

        var valid = true;
        var errmsg = "";
        if(!useMyLocation && location.length == 0) {
            valid = false;
            errmsg += "Please include a search location or click 'Use My Location.'";
        }

        if(!valid) {
            alert(errmsg);
        } else {
            window.localStorage["lastSearchedUseMyLocation"] = $scope.useMyLocation;
            window.localStorage["lastSearchedLocation"] = location;
            window.localStorage["lastSearchedRadius"] = radius;
            window.localStorage["lastSearchedMinBeds"] = minbeds;
            window.localStorage["lastSearchedMaxBeds"] = maxbeds;
            window.localStorage["lastSearchedMinBaths"] = minbaths;
            window.localStorage["lastSearchedMaxBaths"] = maxbaths;
            window.localStorage["lastSearchedMinPrice"] = minprice;
            window.localStorage["lastSearchedMaxPrice"] = maxprice;

            var c = [];

            if(useMyLocation) {
                c = [{lat:$scope.lat, lng:$scope.lng, radius: radius, minprice: minprice, maxprice: maxprice, minbeds: minbeds, maxbeds: maxbeds, minbaths: minbaths, maxbaths: maxbaths}];
            } else {
                c = [{location: location, state: "SD", radius: radius, minprice: minprice, maxprice: maxprice, minbeds: minbeds, maxbeds: maxbeds, minbaths: minbaths, maxbaths: maxbaths}];
            }

            //var c = [{location: location, state: "SD", lat:$scope.lat, lng:$scope.lng, radius: radius, minprice: minprice, maxprice: maxprice, minbeds: minbeds, maxbeds: maxbeds, minbaths: minbaths, maxbaths: maxbaths}];
            searchcriteria.store(c);

            //console.log("criteria", c);

            //$location.path('/#/tab/search/results');
            $state.transitionTo("tab.search-results");
            //window.location = "/#/tab/search/results";
            /*$http.jsonp($scope.jsonpurl, {params: {
                    zipcode: zipcode,
                    radius: radius,
                    minprice: minprice,
                    maxprice: maxprice,
                    minbeds: minbeds,
                    maxbeds: maxbeds,
                    minbaths: minbaths,
                    maxbaths: maxbaths,
                    type: "json"
                }}).success(function(data){
                console.log(data);

                $scope.listings = data.listings;
                $scope.listingCount = data.listingcount;

                $scope.showResults = true;

                

            }).error(function(data, status) {
                console.log("bad");
            });*/
        }
    }

    $scope.getLocation = function (useMyLocation) {
        if (navigator.geolocation && useMyLocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        } else {
            $scope.lat = null;
            $scope.lng = null;
        }
    }

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
    }

    $scope.showError = function (error) {
        //console.log("location unable to be found");
        //ErrorLog.store({description: "error with geolocation", error:error});
    }
}).controller('SearchResultsCtrl', function($scope, $http, $window, searchcriteria, Ads, currency, $state, ErrorLog) {
    $scope.showResults = true;
    $scope.jsonpurl = "http://www.re605.com/homeviewapp/re605appsearch";
    $scope.adurl = "http://www.re605.com/_client_media/ads/";
    $scope.loaded = false;

    Ads.getfooter().then(function(ads) {
        var link = "";
        if(ads[0].link_url != "#") {
            link = "<a href='" + ads[0].link_url + "' target='_blank'><img src='" + $scope.adurl + ads[0].name + "' /></a>";
        } else {
            link = "<img src='" + $scope.adurl + ads[0].name + "' />";
        }
        document.getElementById('footer_ad_container').innerHTML = link;
    });

    $scope.goBack = function() {
        //$window.history.back();

        $state.go("tab.search");
        //$location.url('/', true);
        //$location.path('/#/tab/home');
        //window.location = "/#/tab/home";
    }

    $scope.getCurrency = function(amt) {
        return '$' + currency.get(amt);
    }
    $scope.getResults = function() {
        criteria = searchcriteria.get();

        /*var zipcode = criteria.zipcode;
        var radius = criteria.radius;
        var minbeds = criteria.minbeds;
        var maxbeds = criteria.maxbeds;
        var minbaths = criteria.minbaths;
        var maxbaths = criteria.maxbaths;
        var minprice = criteria.minprice;
        var maxprice = criteria.maxprice;*/

        //console.log("searching with..");
        //console.log(criteria);

        //var zipcode = $criteria.zipcode; //57106;
        //var radius = $criteria.radius; //5;

        $http.jsonp($scope.jsonpurl, {params: {
                criteria: criteria,
                /*minprice: minprice,
                maxprice: maxprice,
                minbeds: minbeds,
                maxbeds: maxbeds,
                minbaths: minbaths,
                maxbaths: maxbaths,*/
                callback: "JSON_CALLBACK",
                type: "json"
            }}).success(function(data){

                if(data.result == "success") {

                    if(gaPlugin) {
                        gaPlugin.trackEvent( gaSuccessHandler, gaErrorHandler, "Search Results", "Load", "Load Search Results", criteria.location);
                    }

                    lhlkey = [];
                    data.listings.forEach(function(item) {
                        lhlkey.push({lkey:item.listing_key});
                    });
                    lh('submit', 'SEARCH_DISPLAY', lhlkey);
                    //console.log("lhlkey",lhlkey);

                    //console.log(data);

                    $scope.listings = data.listings;
                    $scope.listingCount = data.listingcount;

                    $scope.showResults = true;
                    $scope.loaded = true;
                } else {
                  alert("There was a problem retrieving the search results. This issue has been logged and reported.");
                  ErrorLog.store({url: $scope.jsonpurl, params: {criteria: criteria, type: "json"}, description: "unable to retrieve search results, jsonp succedded."});
                }
        }).error(function(data, status) {
            alert("There was a problem retrieving the search results. This issue has been logged and reported.");
            ErrorLog.store({url: $scope.jsonpurl, params: {criteria: criteria, type: "json"}, description: "unable to retrieve search results, jsonp failed."});
        });
    }

    $scope.getResults();
});
