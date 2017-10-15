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

  var ref = database.ref().child("Users")
                          .child(userId.uid)
                          .child("utilities")
                          .child("markers")
  
  


  ref.on('value', function(snap) { markers = snap.val(); });

  markers.splice(1, 1);
  ref.set(markers);
  

  ref.once("value").then(function(snap) {
     referenceMarkers = snap.val();
     console.log(referenceMarkers);
  }, function (error) {
     console.log("Error: " + error.code);
  });

  

  if (!markers['marker_' + markerId]) {
    var marker = new google.maps.Marker({
      position: markerId,
      icon: image,
      map: map,
      id: 'marker_' + markerId,
    });
   markers[marker.get('id')] = marker;
   

   
   bindMarkerEvents(marker);
  }
}
//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {
    // google.maps.event.addListener(marker, 
    marker.addListener("click", function (point) {
        var markerId = "marker_(" + getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()) + ")";
        var marker = markers[markerId];
        removeMarker(marker, markerId); 
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
