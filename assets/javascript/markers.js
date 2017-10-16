var refBasePoke = database.ref().child("basePoke")

//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //initial ajax call

    var i = 0, max = 1, delay = 3000, run;
    run = function(){
       var x = randomNumber(150, 1);
       console.log("1", x)
       createMarker(results[i], x);
       if(i++ < max){
          setTimeout(run, delay);
       }
    }
    run()
  }
}

function createMarker(place, num) {
  console.log("2", num)
  var markerId = place.geometry.location;  
  var refMarkers = database.ref().child("Users")
                               .child(userId.uid)
                               .child("utilities")

  if (markers.includes('marker_' + markerId) === false) { 
    refMarkers.on('value', function(snap) { markers = snap.val().markers; console.log(markers)});
    refBasePoke.child(num).once("value").then(function(snap) {
      var poke = snap.val();
      var image = new google.maps.MarkerImage(poke.image, null, null, null, new google.maps.Size(100,100));
      var marker = new google.maps.Marker({
        position: markerId,
        icon: image,
        map: map,
        id: 'marker_' + markerId,
      });
      //references markers from database
      marker.index = num
      marker.poke = poke
      console.log("3", num)
      bindMarkerEvents(marker);
      markers.push(marker.get('id'))
    //sets markers array to database
    })
    refMarkers.set({markers: markers});
  }
}

//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {

  marker.addListener("click", function (point) {
        var marker = this;
        console.log("4", this.index, this.poke)
        removeMarker(marker); 

        
        // refBasePoke.child(this.index).once('value', function(snap) { 
        opponent = marker.poke;
        $('#catch').empty()
        renderPokeInBattle(opponent, $('#catch'))
        loadPokemon();
        battleMode();
        // });
  });
}


var removeMarker = function(marker) {
    marker.setMap(null);
};
