function battleMode() {
  $('#battleMode').css("display", "block");
  
  renderPokeInBattle(opponent, $('#catch'))
  if (user) {
    renderPokeInBattle(user, $('#user'))
  } else loadPokemon()
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
        $(pokeLost).children('h1')
          .text("Oh NO! " + opponent.name + " has killed your " + user.name + '!');

        user = false
        $('#user').empty()

      };

      if (opponent.health === 0) {
        $('#battleMode').css("display", "none");
        
        pokeMissed.style.display = 'block';
        $(pokeMissed).children('h1')
          .text("Oh NO!, you've killed the poor " + opponent.name + '!');
        
        opponent = false;
        $('#catch').empty()
      };
  });

  $('#catchButton').unbind().click(function() {
    if (opponent.health < 10 && opponent.health > 0) {
      catched.play();
      initPokeBattleValues(opponent)
      initPokeBattleValues(user)
      $('#battleMode').css("display", "none");
      userRef.child('pokemon').push(opponent);
      userRef.child('pokemon').child(user.key).update(user)
      loadPokemon()
      pokeCollected.style.display = 'block';
      $(pokeCollected).children('h1')
          .text("Congratulations! you've caught a " + opponent.name + "!");
      opponent = false;
    } else {
      pokeCollected.style.display = 'block';
      $(pokeCollected).children('h1')
          .text("The " + opponent.name + " Escaped!");
    };
  });

  $('#berriesButton').unbind().click(function() {
    if (berries > 0) {
      berries--;
      userRef.child("berries").set(berries);
      user.health = user.health + 5;
      renderPokeInBattle(user, $('#user'))
    } else {
      $('#berriesButton').hide()
    }
  }) 
}