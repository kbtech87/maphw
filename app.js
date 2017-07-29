var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.7392, lng: -104.9903},
    zoom: 13
  });

  var locations = [
    {title: 'Elitch Gardens', location: {lat: 39.7494, lng: -105.0125}},
    {title: 'Mile High Stadium', location: {lat: 39.7439, lng: -105.0201}},
    {title: 'Denver Zoo', location: {lat: 39.7506, lng: -104.9488}},
    {title: 'Coors Field', location: {lat: 39.7559, lng: -104.9942}},
    {title: 'Buell Theater', location: {lat: 39.7446, lng: -104.9979}}

  ];

  var infowindow = new google.maps.InfoWindow({
    content: 'blah de blah de blah'
  });
  function populateInfowindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker(null);
      });
    }
  }

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
    //bounds.extend(marker, position);
    // create onclick event to open infowindow at each marker
    marker.addListener('click', function() {
      populateInfowindow(this, infowindow);
    });
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      }
      else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    marker.addListener('click', toggleBounce);
  }
}
