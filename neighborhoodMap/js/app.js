// The ViewModel part of Knockout
var ViewModel = function(locations){
    self = this;
    this.filter = ko.observable("");
    this.filteredLocations = ko.computed(function(){
        var tempList = [];
        if(self.filter() === ""){
            tempList = locations;
        }
        else{
            tempList = locations.filter(function(restaurant) {
                return restaurant.title.toLowerCase().includes(self.filter().toLowerCase());
            });
        }
        console.log("Filter:", tempList);
        if(typeof google === 'object'){
            hideMarkers(markers);
            markers = [];
            showMarkers(tempList);
            console.log("Markers:", markers);
        }
        return tempList;
    });
    this.openMarker = function(index, restaurant) {
        populateInfoWindow(markers[index], largeInfowindow, restaurant);
    }
    this.filteredLocationsIsEmpty = ko.computed(function(){
        return self.filteredLocations().length === 0;
    });
}
// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
// This is the Model of Knockout.
var locations = [
    {title: 'Restaurante El Capricho', location: {lat: 40.420337063508036, lng: -3.6776359513375256}, foursquareId:"55258aa7498e23c7ea730486"},
    {title: 'La Castela', location: {lat: 40.4203295, lng: -3.6767116}, foursquareId : "4b928184f964a52008ff33e3"},
    {title: 'Sienna', location: {lat: 40.41834, lng: -3.676729}, foursquareId:"4c03ffd4187ec928a26cb67b"},
    {title: 'El Martí', location: {lat: 40.4199078, lng: -3.679105}, foursquareId:"4b376d69f964a520064125e3"},
    {title: 'La Montería', location: {lat: 40.420308064026166, lng: -3.677628503594477}, foursquareId:"4bd9ea86c79cc928309f7ce9"},
    {title: 'Vinos de Bellota', location: {lat: 40.42067595716258, lng: -3.679058690556566}, foursquareId:"4d3b508bcc48224b8ad2454f"},
    {title: 'Diwali', location: {lat: 40.42213891196856, lng: -3.6774542114374715}, foursquareId:"4b8946d8f964a520e22732e3"}
  ];
ko.applyBindings(new ViewModel(locations));