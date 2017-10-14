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

      $('#catch h2').text(opponent.health);
      $('#user h2').text(user.health);

      if (user.health === 0) {
        var ref = database.ref().child("Users").child(userId.uid).child(referenceId);
        ref.remove()

        $('#battleMode').css("display", "none");
        opponent = false
      };

      if (opponent.health === 0) {
        $('#battleMode').css("display", "none");
        opponent = false
      };
  });

  $('#catchButton').unbind().click(function() {
    if (opponent.health < 10 && opponent.health > 0) {
      fetchAjax().done(addPokeToVariables);
      catched.play();
      database.ref().child("Users").child(userId.uid).push(opponent);
      opponent = false
      $('#battleMode').css("display", "none");
    };
  });   
}