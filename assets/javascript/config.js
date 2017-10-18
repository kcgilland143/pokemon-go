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
var userId;

$(document).ready(function () {
  initMap()
})

//ajax

function fetchAjax(num) {
  num = num || Math.floor(Math.random() * 150) + 1;
  return $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + num + '/',
      dataType: 'json',
      method: 'GET'
  });
}

function fetchPoke(num, callback) {
  num = num || Math.floor(Math.random() * 150) + 1;
  var poke
  var basePokeRef = database.ref().child("Base")
  basePokeRef.orderByChild("num").equalTo(num).once("value", function(snapshot) {
    var val = snapshot.val()
    if (val) {
      snapshot.forEach(function (childSnapshot) {
        poke = getPokeValuesFromDB(childSnapshot)
        callback(poke)
      })
    } else { 
      fetchAjax(num).done( function (response) {
        poke = getPokeValues(response)
        basePokeRef.push(poke)
        callback(poke) 
      })
    }
  })
  // try to get pokemon from database
  // fall back to fetchAjax.done on error, 
    // add to database in that case
}

//isotope

var $pokemoncollection = $('#pokemonCollection');

$pokemoncollection.isotope({
  itemselector: '.pokemon',
  layoutMode: 'fitRows',
  getSortData: {
    name: '[data-name]',
    type: '[data-type]',
    hp: function ( elem ) {
        return parseInt($(elem).attr('data-hp'))
      },
    attack: function ( elem ) {
        return parseInt($(elem).attr('data-attack'))
      },
  },
  sortBy: 'hp'
});

//isotope controls

$('#pouchControls .sortby.attack').on('click', function () {
  var ascending = $(this).toggleClass('ascending').hasClass('ascending')
  selector = 'attack';
  $pokemoncollection
    .children()
    .each(function (i, poke) { decoratePouchHover($(poke)) })
  $pokemoncollection.isotope({sortBy : 'attack', sortAscending: ascending})
})
$('#pouchControls .sortby.name').on('click', function () {
  var ascending = $(this).toggleClass('ascending').hasClass('ascending')
  selector = 'name';
  $pokemoncollection
    .children()
    .each(function (i, poke) { decoratePouchHover($(poke)) })
  $pokemoncollection.isotope({sortBy : 'name', sortAscending: ascending})
})
$('#pouchControls .sortby.hp').on('click', function () {
  var ascending = $(this).toggleClass('ascending').hasClass('ascending')
  selector = 'health';
  $pokemoncollection
    .children()
    .each(function (i, poke) { decoratePouchHover($(poke)) })
  $pokemoncollection.isotope({sortBy : 'hp', sortAscending: ascending})
})
$('#pouchControls .sortby.type').on('click', function () {
  var ascending = $(this).toggleClass('ascending').hasClass('ascending')
  selector = 'type';
  $pokemoncollection
    .children()
    .each(function (i, poke) { decoratePouchHover($(poke)) })
  $pokemoncollection.isotope({sortBy : 'type', sortAscending: ascending})
})



//on click open and close pouch

$('#pouchButton').on("click", function() {
  loadPokemon();
  $('#pouch').css("display", "block");
});

$('#closePouch').on("click", function() {
  $('#pouch').css("display", "none");
});

$('#closeBattle').on("click", function() {
  $('#battleMode').css("display", "none");
});

//on click open and close modals

$('#infoButton').on('click', function(){
  infoModal.style.display = 'block';
});

$('#modalBox').on("click", "span", function(){
  infoModal.style.display = 'none';
  loginFailure.style.display = 'none';
  loginSuccess.style.display = 'none';
  pokeCollected.style.display = 'none';
  pokeLost.style.display = 'none';
  pokeMissed.style.display = 'none';
});

$(document).on('click', '.modal2', function (event) {
  this.style.display = 'none'
})

window.onclick = function(event){
  if (event.target == infoModal)  {
    infoModal.style.display = 'none';
  } 
};

//berries






