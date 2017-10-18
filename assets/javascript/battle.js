function battleMode() {
  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').unbind().click(function() {
      pikachu.play();

      var ref = userRef.child('pokemon').child(user.key);
      
      user.health = user.health - opponent.atk;
      opponent.health = opponent.health - user.atk;

      if (opponent.health < 0) {
        opponent.health = 0
      }
      if (user.health < 0) {
        user.health = 0
      }

      ref.update(user)

      renderPokeInBattle(opponent, $('#catch'))
      renderPokeInBattle(user, $('#user'))

      if (user.health === 0) {

        ref.remove()

        loadPokemon()
        pokeLost.style.display = 'block';
        $('#user').empty()
      };

      if (opponent.health === 0) {
        $('#battleMode').css("display", "none");
        pokeMissed.style.display = 'block';
        opponent = false
        $('#catch').empty()
      };
  });

  $('#catchButton').unbind().click(function() {
    if (opponent.health < 10 && opponent.health > 0) {
      catched.play();
      initPokeBattleValues(opponent)
      userRef.child('pokemon').push(opponent);
      $('#battleMode').css("display", "none");
      pokeCollected.style.display = 'block';
      opponent = false
    };
  });

  $('#berriesButton').unbind().click(function() {
    console.log(berries)
    if (berries > 0) {
      console.log(berries)
      berries--;
      userRef.child("berries").set(berries);
      user.health = user.health + 5;
      renderPokeInBattle(user, $('#user'))
    } else {
      $('#berriesButton').hide()
    }
  }) 
}