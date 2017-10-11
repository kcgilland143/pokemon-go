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
var service;
var infowindow;
var gplaces = ['restaurants', 'book_store', 'fire_station', 'gas_station', 'grocery_or_supermarket', 'gym', 'university', 'train_station', 'shopping_mall', 'post_office', 'museum', 'movie_theater', 'library', 'laundry'];
var markers = {};

function initMap() {
  var location = {lat: 40.713425, lng: -74.005524};

  map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 17
      });

  service = new google.maps.places.PlacesService(map);

  infowindow = new google.maps.InfoWindow();
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.panTo(location)
    }); 
  }


  map.addListener('tilesloaded', function (event) {
    service.nearbySearch({
        location: map.getCenter(),
        radius: 20,
        type: gplaces
      }, createPokeMarkers);
  });
}    


function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]); 
    }
  }
}

function createMarker(place) {
  var image = new google.maps.MarkerImage("assets/images/pokeball.png", null, null, null, new google.maps.Size(40,40));
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
    // google.maps.event.addListener(marker, 
    marker.addListener("click", function (point) {
        var markerId = "marker_(" + getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()) + ")";
        var marker = markers[markerId];
        removeMarker(marker, markerId); 
        fetchAjax().done(function (resp) {
          addPokeToPouch(getPokeValues(resp))
        });
    });    
};

//ajax and variables
//bunch of global variables hidden deep in code
//#style

var randomNumber;
var pokeName;
var pokeHealth;
var pokeImage;

var $pokemoncollection = $('#pokemoncollection').isotope({
  itemselector: '.pokeselectorbutton',
  layoutMode: 'fitRows',
  getSortData: {
    id: '.id',
    name: '.name',
    hp: '.hp',
    type: '.type'
  },
  sortBy: ['id', 'hp']
})
$('#pouchControls .sortby.number').on('click', function () {
  console.log('clicked me')
  $pokemoncollection.isotope({sortBy : 'id'})
})
$('#pouchControls .sortby.type').on('click', function () {
  $pokemoncollection.isotope({sortBy : 'type'})
})
$('#pouchControls .sortby.hp').on('click', function () {
  $pokemoncollection.isotope({sortBy : 'hp', sortAscending: false})
})

function fetchAjax() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  return $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + randomNumber + '/',
      dataType: 'json',
      method: 'GET'
  });
}

function getPokeValues(response) {
  var res = {
    id: response.id,
    image: response.sprites.front_default,
    name: response.name,
    attack: response.stats[4].base_stat,
    hp: response.stats[5].base_stat,
    type: response.types[0].type.name
  }
  return res
} //will decide what data gets saved

function addPokeToPouch(pokeObj) {
  var $poke = renderPoke(pokeObj)
  $pokemoncollection.prepend($poke).isotope('prepended', $poke).arrange()
}

function addPokeToDB(pokeObj) {
  database.ref().push(pokeObj);
}

function renderPoke(pokeObj, keys) {
  var $div = $("<button id='pokeselectorbutton' data-id='" + pokeObj.id + "'>")
  if (!keys || !keys.length) { keys = Object.getOwnPropertyNames(pokeObj) }
  keys.forEach(k => {
    switch(k) {
      case 'id': {
        $div.append($('<div class="id">').text('id: ' + pokeObj.id))
        break
      }
      case 'name': {
        $div.append($('<div class="name">').text('name: ' + pokeObj.name))
        break
      }
      case 'type': {
        $div.append($('<div class="type">').text('type: ' + pokeObj.type))
        break
      }
      case 'attack': {
        $div.append($('<div class="attack">').text('attack: ' + pokeObj.attack))
        break
      }
      case 'hp': {
        $div.append($('<div class="hp">').text('hp: ' + pokeObj.hp))
        break
      }
      case 'image': {
        $div.append($("<img class='poke'>").attr("src", pokeObj.image))
        break
      }
    }
  })
  return $div
} //will output poke image and data in html

var removeMarker = function(marker, markerId) {
    marker.setMap(null);
};

//firebase

// removed this because I broke firebase with data restructure

// database.ref().on("child_added", function(childSnapshot){
//    // var image = $("<img class='poke'>").attr("src", childSnapshot.val().image);
//    // var button = $("<button id='pokeselectorbutton' data-id='" + childSnapshot.key + "'>").append(image)
//    var poke = getPokeValues(childSnapshot.val())
//    $("#pokemoncollection").prepend(renderPoke(poke))
// });

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

  // fetchAjax(); may be unneccesary
  $('#opponent').empty();
  var image = $("<img class='poke'>").attr("src", pokeImage)
  $("#opponent").append(image)
})

//on click open and close pouch

$('#pouchbutton').on("click", function() {
  $('#pouch').css("display", "block");
});

$('#closepouch').on("click", function() {
  $('#pouch').css("display", "none");
});


