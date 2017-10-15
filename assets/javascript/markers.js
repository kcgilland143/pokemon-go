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
   marker.num = num;
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

  // marker.addListener("click", function (point) {
  //       var marker = this;
  //       removeMarker(marker); 
  //       loadPokemon();
  //       fetchAjax().done(function (response) {
  //         opponent = getPokeValues(response)
  //         $('#catch').empty()
  //       }
  
    fetchAjax(marker.num).done(function (response) {
      this.poke = getPokeValues(response)
    
      this.addListener("click", function (point) {
        removeMarker(this); //this.setMap(null);?
        if ($pokemoncollection.children().length > 0) {
          $('#catch').empty()//questionable if 
          loadPokemon();//these three
          battleMode();//go here
          //initialize new opponent
          opponent = this.poke
          renderPokeInBattle(opponent, $('#catch'))
        } else { 
          database.ref().child("Users").child(userId.uid).push(this.poke)
        }
        $('#pouch').css("display", "block");
      });    
    }.bind(marker))
    // google.maps.event.addListener(marker, 
};

var removeMarker = function(marker) {
    marker.setMap(null);
};
