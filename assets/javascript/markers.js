//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    
    if (results.length >= 5) {
      var f = randomNumber(results.length - 3)
      var g = randomNumber(2,1)
      results = results.slice(f, f + g)
    }
    //initial ajax call
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i], randomNumber(150, 1)); 
    }
  } else {
    resetPlace();
  }
}

function createMarker(place, num) {
  
  var type = place.types[0];
  var imgString; 
  var image;

  if (['book_store', 'library', 'theater', 'lawyer', 'bank', 'travel_agency'].some(function (l) {
    return place.types.indexOf(l) >= 0
  })) {
    imgString = "assets/images/pokeball.png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(60,60));
    type = 'pokeball'
  } else if (['gym', 'pharmacy', 'doctor', 'hospital', 'health', 'food', 'restaurant'].some(function (l) {
    return place.types.indexOf(l) >= 0
  })) {
    imgString = "assets/images/berry.png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(60,60));
    type = 'berry'
  } else {
    imgString = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + num + ".png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(100,100));
  }

  var markerId = place.geometry.location;

  userRef.on('value', function(snap) { markers = snap.val().markers;});

  if (!markers.includes('marker_' + markerId)) {
    var marker = new google.maps.Marker({
      position: markerId,
      icon: image,
      map: map,
      id: 'marker_' + markerId,
    });
   marker.num = num;
   marker.type = type;
  //pushes new marker to markers array
   markers.push(marker.get('id'))
  //sets markers array to database
   userRef.child("markers").set(markers);
   bindMarkerEvents(marker);
   resetPlace();
  }
}
//http://jsfiddle.net/fatihacet/CKegk/

var bindMarkerEvents = function(marker) {
    fetchPoke(marker.num, function (poke) { //replacing with fallback
      this.poke = poke
      
      this.addListener("click", function (point) {
        removeMarker(this); //this.setMap(null);?

        if (marker.type == 'pokeball') {
          userRef.child("pokemon").push(this.poke)
        } else if (marker.type == 'berry') {
          //give a berry
          berries++;

          if (berries > 0) {
             $('#berriesButton').show()
          }
          userRef.child("berries").set(berries);
    
        } else {
          if ($pokemoncollection.children().length > 0) {
                $('#catch').empty() //questionable if 
                loadPokemon();
                battleMode(); //go here
                //initialize new opponent
                opponent = this.poke
                renderPokeInBattle(opponent, $('#catch'))
              } else { 
                userRef.child('pokemon').push(this.poke)

                alert("you need to find more poke on the map")
              }
          $('#pouch').css("display", "block"); 
        }
      });    
    }.bind(marker))
    // google.maps.event.addListener(marker, 
};

var removeMarker = function(marker) {
    marker.setMap(null);
};
