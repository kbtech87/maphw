var map;

// create new blank array for all the listing markers
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  // single marker version:
  var tribeca = {lat: 40.719526, lng: -74.0089934};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker'
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'blah de blah de blah'
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  // array version:
  var locations = [
    {title: 'location name', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'location name', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'location name', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'location name', location: {lat: 40.7281777, lng: -73.984377}},

  ];

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  //The following group uses the location array to create an array of
  //markers on initialize
  for (var i = 0; i < locations.length; i++) {
    //get the position from the location array
    var position = locations[i].location;
    var title = locations[i].title;
    //create marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // push marker to array of markers
    markers.push(marker);
    //extend boundary of map for each marker
    bounds.extend(marker, position);
    // create onclick event to open infowindow at each marker
    marker.addListener('click', function() {
      populateInfowindow(this, largeInfowindow);
    });
  }
  map.fitBounds(bounds);

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);


  //this function populates the infowindow when marker is clicked
  function populateInfowindow(marker, infowindow) {
    //check to make sure infowindow is not already opened
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      //make sure marker property is cleared if infowindow is closed
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker(null);
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found,
      //compute the position of the streetview image, then calculate the
      //heading, then get a panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title +
            '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        }
        else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      //Use streetview service to get closest image within 50 meters
      streetViewService.getPanoramaByLocation(marker.position, radius,
        getStreetView);
      // Open the infowindow on correct marker
      infowindow.open(map, marker);
    }
  }
}

 // loops through array and displays listings
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  //extends boundaries for each marker and displays marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// loops through array and hides listings
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}
