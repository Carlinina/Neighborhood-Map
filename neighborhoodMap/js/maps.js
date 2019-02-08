
// Create a map variable
var map;
// Create a new blank array for all the listing markers.
var markers = [];
// This global polygon variable is to ensure only ONE polygon is rendered.
var polygon = null;
// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];
var largeInfowindow;
var defaultIcon;
var highlightedIcon;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.4208535, lng: -3.677496},
        zoom: 15,
        mapTypeControl: false
      });
    largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('FFFF24');
    // The following group uses the location array to create an array of markers on initialize.
    showMarkers(locations);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow, restaurant) {
    console.log("Restaurant: ",restaurant);
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    console.log("marker:" , marker.restaurant);
    console.log('https://api.foursquare.com/v2/venues/'+marker.restaurant.foursquareId+'/tips?ll='+marker.restaurant.location.lat+','+marker.restaurant.location.lng+'&client_id=CR1HCYWPWWNST5QJUMHHJ3ON42LWJP4EYODYS3Q0YUKOTYAA&client_secret=DEMRJ2YQU5OV5HGJTTMQJPPMXCGPSQ3Z2UMU3ND0KLYFGP3Y&v=20190207');
    fetch('https://api.foursquare.com/v2/venues/'+marker.restaurant.foursquareId+'/tips?ll='+marker.restaurant.location.lat+','+marker.restaurant.location.lng+'&client_id=CR1HCYWPWWNST5QJUMHHJ3ON42LWJP4EYODYS3Q0YUKOTYAA&client_secret=DEMRJ2YQU5OV5HGJTTMQJPPMXCGPSQ3Z2UMU3ND0KLYFGP3Y&v=20190207')
            .then(function(response) {
                // Code for handling API response
                return response.json();
            })
            .then(function(myJson) {
                if(myJson.response.hasOwnProperty("tips")){
                    console.log(myJson.response.tips);
                    infowindow.setContent('<div class="infoWindow"><span class="title">' + marker.title + '</span><div>' + myJson.response.tips.items[0].text + '</div></div>')
                }
                else{
                    infowindow.setContent('<div class="infoWindow">Apparently we exceeded our daily quota, sorry!</div>')
                }
            })
            .catch(function(error) {
                // Code for handling errors
                console.log("Error!", error);
                infowindow.setContent('<div>Something wrong happened, sorry</div>')
            });
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}
// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
function showMarkers(tempList){
    for (var i = 0; i < tempList.length; i++) {
        // Get the position from the location array.
        var position = tempList[i].location;
        var title = tempList[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        marker.restaurant = tempList[i];
        // Push the marker to our array of markers.
        markers.push(marker);
        console.log(tempList[i]);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        marker.setMap(map);
    }
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}
