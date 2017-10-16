function getPokeValues(response) {
  res = {
    attack: response.stats[4].base_stat,
    hp: response.stats[5].base_stat,
    image: response.sprites.front_default,
    name: response.name,
    type: response.types[0].type.name
  }
  initPokeBattleValues(res)
  return res
} //will decide what data gets saved

function getPokeValuesFromDB(snapshot) {
  res = snapshot.val()
  res.key = snapshot.key
  initPokeBattleValues(res)
  return res
}

function initPokeBattleValues (pokeObj) {
  pokeObj.health = pokeObj.hp
  pokeObj.atk = Math.floor(pokeObj.attack / 7)
}


function addPokeToVariables(response) {
  var poke = getPokeValues(response) 
  console.log(poke)
  pokeName = poke.name;
  pokeHealth = poke.hp;
  // catchHealth = poke.hp;
  pokeImage = poke.image;
  pokeAttack = poke.attack;
  pokeType = poke.type;

// to add pokemon

//   var ref = database.ref().child("Users").child(userId.uid)
//   ref.push({ 
//             name: pokeName,
//             health: pokeHealth,
//             image: pokeImage
//           });
// }
}

function renderPokeInBattle (pokeObj, targetElem) {
  var nameEntry = $('<h3>').text(pokeObj.name);
  var healthEntry = $('<h2>').text(pokeObj.health);
  var imageEntry = $("<img class='pokeBattle'>").attr("src", pokeObj.image);
  targetElem.append(imageEntry, healthEntry, nameEntry)
}



$('#pokemonCollection').on("click", "button", function() {
  // fetchAjax().done(addPokeToVariables);
  $('#user').empty();
  $('#pouch').css("display", "none");

//loads the pokemon from the pokemonCollection into the user side of battlemode
//loads specific data into battlemode
//important


  referenceId = $(this).attr("data-id");
  var ref = database.ref().child("Users").child(userId.uid).child(referenceId);
  ref.once("value").then(function(snapshot) {
    user = getPokeValuesFromDB(snapshot)

    renderPokeInBattle(user, $('#user'))
    
  }, function (error) {
     console.log("Error: " + error.code);
  });

//loads specific data into battlemode
//important

  if (opponent) {
    $('#catch').empty();
    renderPokeInBattle(opponent, $('#catch'))
    battleMode();
  }
})

function loadPokemon() {
    $pokemoncollection.empty();

    $pokemoncollection.isotope( 'remove', 
      $pokemoncollection.find('.pokemon'))
      .isotope('layout');

    var ref = database.ref().child("Users").child(userId.uid)

    ref.on("child_added", function(childSnapshot){
      var poke = childSnapshot.val()
      // console.log(
      //   "Left this here, check out how many times it gets called" + 
      //   " when a new pokemon is added.", poke)
      var dataObj;

      if (selector == 'health' || 'name') {
        dataObj= $("<h4 class='hoverHealth'>").append(poke.hp)
      }
      if (selector == 'attack') {
        dataObj= $("<h4 class='hoverHealth'>").append(poke.attack)
      }
      if (selector == 'type') {
        dataObj= $("<h4 class='hoverHealth'>").append(poke.type)
      }

      var image = $("<img class='poke'>").attr("src", poke.image);
      var name = $("<h4 class='hoverName'>").append(poke.name);
      var button = $("<button class='button__description' data-id='" + 
        childSnapshot.key + "'>").append(name, dataObj);
      var div = $("<div class='button__wrap'>")
        .attr('data-name', poke.name)
        .attr('data-attack', poke.attack)
        .attr('data-hp', poke.hp)
        .attr('data-type', poke.type)
        .addClass("pokemon")
        .append(image, button);

        $pokemoncollection
          .prepend(div)
          .isotope('prepended', div)
    });

    
}