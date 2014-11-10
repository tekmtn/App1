$( document ).on( "pageinit", "#map-page", function() {
  var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
  if ( navigator.geolocation ) {
      function success(pos) {
          // Location found, show map with these coordinates
          drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      }
      function fail(error) {
          alert("Please enable your GPS or Location Services.");
         // drawMap(defaultLatLng);  // Failed to find location, show default map
      }
      // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
      navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
  } else {
      drawMap(defaultLatLng);  // No geolocation support, show default map
  }
  function drawMap(latlng) {
      var myOptions = {
          zoom: 10,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

      $.ajax({
        type: 'GET',
        url: "http://app.re605.com/re605applistings/json?callback=?",
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
           console.log(json);
           $.each(json.listings, function(i, item) {
              var position = new google.maps.LatLng(item.latitude, item.longitude);
              
              var details = "<div class='info-window'>" 
                          + "<div class='sidea'><h3>$" + CurrencyFormatted(item.price) + "</h3>"
                          + item.address + "<br />" + item.city + ", " 
                          + item.state + " " + item.zip + "<br />"
                          + item.county + "<br />" 
                          + item.square_feet + " sq ft<br />"
                          + item.beds + " beds, " + item.baths + " baths<br />"
                          + "</div>"
                          + "<div class='sideb'><img class='img-preview' src='http://listings.re605.com/images/property/" + item.mls_number + "/1.jpg' /></div>"
                          + "<div style='clear:both;'></div>" + item.summary + "</div>";

              var infowindow = new google.maps.InfoWindow({
                content: details
              });

              var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: item.price
              });

              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
              });


           });
        },
        error: function(e) {
           console.log(e.message);
        }
      });
      // Add an overlay to the map of current lat/lng
  }
});

function CurrencyFormatted(amount)
{
  var i = parseFloat(amount);
  if(isNaN(i)) { i = 0.00; }
  var minus = '';
  if(i < 0) { minus = '-'; }
  i = Math.abs(i);
  i = parseInt((i + .005) * 100);
  i = i / 100;
  s = new String(i);
  if(s.indexOf('.') < 0) { s += '.00'; }
  if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
  s = minus + s;
  return s;
}