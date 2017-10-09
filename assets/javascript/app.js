//Firebase API

var config = {
    apiKey: "AIzaSyDH1QU3JbnLa7kJBeaDy6iBZWyCANneEF8",
    authDomain: "pokemon-g-6760b.firebaseapp.com",
    databaseURL: "https://pokemon-g-6760b.firebaseio.com",
    projectId: "pokemon-g-6760b",
    storageBucket: "pokemon-g-6760b.appspot.com",
    messagingSenderId: "712269966690"
  };
firebase.initializeApp(config);

var database = firebase.database();

//Map, Markers, Marker Remove, Marker Action

var map;
var infowindow;
var gplaces = ['restraunts', 'book_store', 'fire_station', 'gas_station', 'grocery_or_supermarket', 'gym', 'university', 'train_station', 'shopping_mall', 'post_office', 'museum', 'movie_theater', 'library', 'laundry'];
var markers = {};

function initMap() {
  var location = {lat: 40.713425, lng: -74.005524};

  map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
      });
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
      });

      infowindow = new google.maps.InfoWindow();

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: location,
        radius: 350,
        type: gplaces
      }, callback);
    });
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]); 
    }
  }
}

function createMarker(place) {
  var image = new google.maps.MarkerImage("assets/images/pokeball.png", null, null, null, new google.maps.Size(35, 35));
  var markerId = place.geometry.location;
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
    google.maps.event.addListener(marker, "click", function (point) {
        var markerId = "marker_(" + getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()) + ")";
        var marker = markers[markerId];
        removeMarker(marker, markerId); 
    });    
};

//ajax and variables

var randomNumber;
var pokeName;
var pokeHealth;
var pokeImage;

function fetchAjax() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + randomNumber,   
      dataType: 'json',
      method: 'GET',
  }).done(function(response) {
        pokeName = response.name;
        pokeHealth = response.base_experience;
        pokeImage = response.sprites.front_shiny; 
  });
}

fetchAjax();

var removeMarker = function(marker, markerId) {
      marker.setMap(null);
      delete markers[markerId];
      fetchAjax();
      database.ref().push({ 
        name: pokeName,
        health: pokeHealth,
        image: pokeImage
      });
  };  

//firebase

database.ref().on("child_added", function(childSnapshot){

   var image = $("<img class='poke'>").attr("src", childSnapshot.val().image);
   var button = $("<button id='pokeselectorbutton' data-id='" + childSnapshot.key + "'>").append(image)
   
   $("#pokemoncollection").prepend(button)
});

//onclick

$('#pokemoncollection').on("click", "button", function() {
  $('#id01').css("display", "block");
  $('#user').empty();

  var ref = firebase.database().ref($(this).attr("data-id"));
  ref.on("value", function(snapshot) {
     var image1 = $("<img class='poke'>").attr("src", snapshot.val().image);
      $('#user').append(image1)
  }, function (error) {
     console.log("Error: " + error.code);
  });

  fetchAjax();
  $('#opponent').empty();
  var image = $("<img class='poke'>").attr("src", pokeImage)
  $("#opponent").append(image)
})

//on click open and close pouch

$('#pouchbutton').on("click", function() {
  $('#pouch').css("display", "block");
})

$('#closepouch').on("click", function() {
  $('#pouch').css("display", "none")
})


