var refBasePoke = database.ref().child("basePoke")

//Map, Markers, Marker Remove, Marker Action

function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    //initial ajax call


    var i = 0, max = results.length, delay = 2000, run;
    run = function(){
       var num = randomNumber(150, 1);
       createMarker(results[i], num)
       if(i++ < max){
          setTimeout(run, delay);
       }
    }
    run();
  }
}

function createMarker(place, num) {
  var markerId = place.geometry.location;  
  var refMarkers = database.ref().child("Users")
                               .child(userId.uid)
                               .child("utilities")

  refMarkers.on('value', function(snap) { markers = snap.val().markers; });
  refBasePoke.child(num).once("value").then(function(snap) {
    imgString = snap.val().image;
  })
  var image = new google.maps.MarkerImage(imgString , null, null, null, new google.maps.Size(100,100));
  //references markers from database
    if (markers.includes('marker_' + markerId) === false) {
      var marker = new google.maps.Marker({
        position: markerId,
        icon: image,
        map: map,
        id: 'marker_' + markerId,
      });
    }
   marker.num = num
   markers.push(marker.get('id'))
  //sets markers array to database
   refMarkers.set({markers: markers});


   bindMarkerEvents(marker);
  }

//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {

  marker.addListener("click", function (point) {
        var marker = this;
        removeMarker(marker); 
        var pokeId = this.num

        $('#catch').empty()
        loadPokemon();
        battleMode();
        
        refBasePoke.child(pokeId).once('value').then(function(snap) { 
            opponent = snap.val();
        });
        console.log("1", opponent) //comes up as undefined
        renderPokeInBattle(opponent, $('#catch'))
  });
}


var removeMarker = function(marker) {
    marker.setMap(null);
};
