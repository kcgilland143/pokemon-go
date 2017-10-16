//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //initial ajax call
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i], randomNumber(150, 1)); 
    }
  } else {
    console.log("error")
  }
}

function createMarker(place, num) {
  
  var type = place.types[0];
  var imgString; 
  var image;

  if (place.types[0] == 'book_store') {
    imgString = "assets/images/pokeball.png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(60,60));
  } else if (place.types[0] == 'gym') {
    imgString = "assets/images/berry.png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(60,60));
  } else {
    imgString = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + num + ".png"
    image = new google.maps.MarkerImage(imgString, null, null, null, new google.maps.Size(100,100));
  }

  var markerId = place.geometry.location;

  userRef.on('value', function(snap) { markers = snap.val().markers;});
  console.log(markers)

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

        if (marker.type == 'book_store') {
          userRef.child("pokemon").push(this.poke)
          console.log("addedPoke", this.poke.name);
        } else if (marker.type == 'gym') {
          //give a berry
          berries++;

          userRef.child("berries").set(berries);
          userRef.on('value', function(snap) { berries = snap.val().berries; });
          
          alert("berry")
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
          console.log("battle"); 
          $('#pouch').css("display", "block"); 
        }
      });    
    }.bind(marker))
    // google.maps.event.addListener(marker, 
};

var removeMarker = function(marker) {
    marker.setMap(null);
};
