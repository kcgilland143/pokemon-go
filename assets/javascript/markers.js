//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //initial ajax call
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i], randomNumber(150, 1)); 
    }
  }
}

function createMarker(place, num) {
  var imgString = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + num + ".png"
  var image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(100,100));
  var markerId = place.geometry.location;
  if (!markers['marker_' + markerId]) {
    var marker = new google.maps.Marker({
      position: markerId,
      icon: image,
      map: map,
      id: 'marker_' + markerId,
    });
   marker.num = num;
   markers[marker.get('id')] = marker;
   bindMarkerEvents(marker);
  }
}
//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {
    fetchAjax(marker.num).done(function (response) {
      this.poke = getPokeValues(response)
    }.bind(marker))

    // google.maps.event.addListener(marker, 
    marker.addListener("click", function (point) {
      removeMarker(this); //this.setMap(null);?
      $('#catch').empty()//questionable if 
      loadPokemon();//these three
      battleMode();//go here
      //initialize new opponent
      opponent = this.poke
      renderPokeInBattle(opponent, $('#catch'))
      $('#pouch').css("display", "block");
    });    
};

var removeMarker = function(marker) {
    marker.setMap(null);
};
