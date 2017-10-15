//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //initial ajax call
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]); 
    }
  }
}

function createMarker(place) {
  var image = new google.maps.MarkerImage("assets/images/pokeball.png", null, null, null, new google.maps.Size(40,40));
  var markerId = place.geometry.location;

  var refMarkers = database.ref().child("Users")
                        .child(userId.uid)
                        .child("utilities")

  //references markers from database
  refMarkers.on('value', function(snap) { markers = snap.val().markers; });

  if (!markers.includes('marker_' + markerId)) {
    var marker = new google.maps.Marker({
      position: markerId,
      icon: image,
      map: map,
      id: 'marker_' + markerId,
    });
  //pushes new marker to markers array
   markers.push(marker.get('id'))
  //sets markers array to database
   refMarkers.set({markers: markers});

   bindMarkerEvents(marker);
  }
}
//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {
    marker.addListener("click", function (point) {
        var marker = this;
        removeMarker(marker); 
        loadPokemon();
        fetchAjax().done(function (response) {
          opponent = getPokeValues(response)
          $('#catch').empty()
          renderPokeInBattle(opponent, $('#catch'))
        })
        battleMode()
        //initialize new opponent
        $('#pouch').css("display", "block");
    });    
};

var removeMarker = function(marker) {
    marker.setMap(null);
};
