function getPokeValues(response) {
  res = {
    attack: response.stats[4].base_stat,
    hp: response.stats[5].base_stat,
    image: response.sprites.front_default,
    name: response.name,
    type: response.types[0].type.name,
    num: response.id
  }
  initPokeBattleValues(res)
  return res
} //will decide what data gets saved

function getPokeValuesFromDB(snapshot) {
  res = snapshot.val()
  res.key = snapshot.key
  return res
}

function initPokeBattleValues (pokeObj) {
  pokeObj.health = pokeObj.hp
  pokeObj.atk = Math.floor(pokeObj.attack / 7) + 1
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

function renderPokeInBattle (pokeObj, $targetElem) {
  $targetElem.empty()
  var nameEntry = $('<h3>').text(pokeObj.name);
  var healthEntry = $('<h2 class="hp">')
    .text('HP: ' + pokeObj.health)
    .prepend($('<img class="hp" src="assets/images/hp.png">'))
  var attackEntry = $('<h2 class="attack">').text('ATK: ' + pokeObj.atk)
  var imageEntry = $("<img class='pokeBattle'>").attr("src", pokeObj.image);
  var battlePlatform = $("<img class='battlePlat'>").attr('src', 'assets/images/battle-platform.png');
  $targetElem.append(imageEntry, battlePlatform, healthEntry, attackEntry, nameEntry)
}

function renderPokeInPouch (pokeObj) {
  var image = $("<img class='poke'>").attr("src", pokeObj.image);
  var name = $("<h4 class='hoverName'>").append(pokeObj.name);
  var dataObj= $("<h4 class='hoverHealth'>").append(pokeObj.hp)
  var button = $("<button class='button__description' data-id='" + pokeObj.key + "'>")
    .append(name, dataObj);
  var div = $("<div class='button__wrap'>")
    .attr('data-name', pokeObj.name)
    .attr('data-attack', pokeObj.atk)
    .attr('data-hp', pokeObj.health)
    .attr('data-type', pokeObj.type)
    .attr('data-id', pokeObj.key)
    .addClass("pokemon")
    .append(image, button);
  return div
}

function storePokeDataInElement($element, pokeObj) {
  $element
    .attr('data-name', pokeObj.name)
    .attr('data-attack', pokeObj.atk)
    .attr('data-hp', pokeObj.health)
    .attr('data-type', pokeObj.type)
    .attr('data-id', pokeObj.key)
}

function decoratePouchHover ($pouchPoke) {
  var dataShown;
    if (selector == 'health' || 'name') {
      dataShown = 'HP: ' + $pouchPoke.attr('data-hp')
    }
    if (selector == 'attack') {
      dataShown = 'ATK: ' + $pouchPoke.attr('data-attack')
    }
    if (selector == 'type') {
      dataShown = $pouchPoke.attr('data-type')
    }
    $pouchPoke.find('.hoverHealth').text(dataShown)
}


$('#pokemonCollection').on("click", "button", function() {
  // fetchAjax().done(addPokeToVariables);
  $('#user').empty();
  $('#pouch').css("display", "none");

//loads the pokemon from the pokemonCollection into the user side of battlemode
//loads specific data into battlemode
//important


  referenceId = $(this).attr("data-id");

  var ref = userRef.child("pokemon").child(referenceId);

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
    $('#pouch').css("display", "block");
    if ($('#battleMode').css('display') === 'block') {
      $('#pouch').addClass('pushed')
    } else $('#pouch').removeClass('pushed')
    $pokemoncollection.isotope('layout');
}