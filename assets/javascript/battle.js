function battleMode() {
  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').on("click", function() {
      pikachu.play();

      userHealth = userHealth - 10;
      catchHealth = catchHealth - 10;

      $('#catch h2').text(catchHealth);
      $('#user h2').text(userHealth);

      if (userHealth <= 0) {
        var ref = firebase.database().ref(referenceId);
        ref.remove()
      };

  });

  $('#catchButton').on("click", function() {
    if (catchHealth < 10 && catchHealth > 0) {
      catched.play();
      database.ref().push({ 
        name: pokeName,
        health: pokeHealth,
        image: pokeImage
      });
    };
  });   
// closes battle mode, potentially shows stats of pokemon collected
  // if (gameover) {
  // $('#battleMode').css("display", "none");
  // }
}

$('#pokemonCollection').on("click", "button", function selectUserPokemon() {
  $('#user').empty();
  $('#pouch').css("display", "none");

  console.log(this)
//loads the pokemon from the pokemonCollection into the user side of battlemode
  referenceId = $(this).attr("data-id");
  var ref = firebase.database().ref(referenceId);
  ref.on("value", function(snapshot) {
    user = snapshot.val()
    $('#user').append(renderPoke(user))
  })
//     userHealth = snapshot.val().health

//     var nameEntry = $('<h3>').text(snapshot.val().name)
//     var healthEntry = $('<h2>').text(userHealth)
//     var imageEntry = $("<img class='pokeBattle'>").attr("src", snapshot.val().image);

//     $('#user').append(imageEntry, healthEntry, nameEntry)

// >>>>>>> basics down, lots of bugs, but enough to work off of

//loads the pokemon from the random Ajax call into the catch side of battlemode
  $('#catch').empty();
  var image = renderPoke(opponent)
  $("#catch").append(image)
// ===
//   var nameEntry = $('<h3>').text(pokeName)
//   var healthEntry = $('<h2>').text(catchHealth)
//   var imageEntry = $("<img class='pokeBattle'>").attr("src", pokeImage)
//   $("#catch").append(image)
// >>>>>>> basics down, lots of bugs, but enough to work off of

  battleMode();
})