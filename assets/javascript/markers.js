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
  var refBasePoke = database.ref().child("basePoke").child(num)
  var markerId = place.geometry.location;
  // var markerIdd = place.geometry.location.lat.scopes[0].a
  var refMarkers = database.ref().child("Users")
                        .child(userId.uid)
                        .child("utilities")

  refMarkers.on('value', function(snap) { markers = snap.val().markers; });

  refBasePoke.once("value").then(function(snap) {
    imgString = snap.val().image;
  })

  var image = new google.maps.MarkerImage(imgString , null, null, null, new google.maps.Size(100,100));
  
  console.log(markerId)
  //references markers from database
    if (markers.includes('marker_' + markerId) === false) {
      var marker = new google.maps.Marker({
        position: markerId,
        icon: image,
        map: map,
        id: 'marker_' + markerId,
      });
    }
   // marker.num = num;
  //pushes new marker to markers array
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
        loadPokemon();
        fetchAjax().done(function (response) {
          opponent = getPokeValues(response)
          $('#catch').empty()
        });

  });
}
    // fetchAjax(marker.num).done(function (response) {
    //   this.poke = getPokeValues(response)
    
    //   this.addListener("click", function (point) {
    //     removeMarker(this); //this.setMap(null);?
    //     if ($pokemoncollection.children().length > 0) {
    //       $('#catch').empty()//questionable if 
    //       loadPokemon();//these three
    //       battleMode();//go here
    //       //initialize new opponent
    //       opponent = this.poke
    //       renderPokeInBattle(opponent, $('#catch'))
    //     } else { 
    //       database.ref().child("Users").child(userId.uid).push(this.poke)
    //     }
    //     $('#pouch').css("display", "block");
    //   });    
    // }.bind(marker))
    // google.maps.event.addListener(marker, 
// };

var removeMarker = function(marker) {
    marker.setMap(null);
};
