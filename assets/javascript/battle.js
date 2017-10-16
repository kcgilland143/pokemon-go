function battleMode() {
  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').unbind().click(function() {
      pikachu.play();

      user.health = user.health - opponent.atk;
      opponent.health = opponent.health - user.atk;

      if (opponent.health < 0) {
        opponent.health = 0
      }
      if (user.health < 0) {
        user.health = 0
      }

      renderPokeInBattle(opponent, $('#catch'))
      renderPokeInBattle(user, $('#user'))

      if (user.health === 0) {
        var ref = database.ref().child("Users").child(userId.uid).child(user.key);
        ref.remove()

        $('#battleMode').css("display", "none");
        pokeLost.style.display = 'block';
        opponent = false
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
      fetchAjax().done(addPokeToVariables);
      catched.play();
      database.ref().child("Users").child(userId.uid).push(opponent);
      $('#battleMode').css("display", "none");
      pokeCollected.style.display = 'block';
      opponent = false
    };
  });   
}