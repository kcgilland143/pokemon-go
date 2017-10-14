function battleMode() {
  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').unbind().click(function() {
      pikachu.play();

      userHealth = userHealth - catchAttack;
      catchHealth = catchHealth - userAttack;

      if (catchHealth < 0) {
        catchHealth = 0
      }
      if (userHealth < 0) {
        userHealth = 0
      }

      $('#catch h2').text(catchHealth);
      $('#user h2').text(userHealth);

      if (userHealth === 0) {
        var ref = database.ref().child("Users").child(userId.uid).child(referenceId);
        ref.remove()

        $('#battleMode').css("display", "none");
        fetchAjax().done(addPokeToVariables);
      };

      if (catchHealth === 0) {
        $('#battleMode').css("display", "none");
        fetchAjax().done(addPokeToVariables);
      };
  });

  $('#catchButton').unbind().click(function() {
    if (catchHealth < 10 && catchHealth > 0) {
      fetchAjax().done(addPokeToVariables);
      catched.play();
      database.ref().child("Users").child(userId.uid).push({ 
        name: pokeName,
        hp: pokeHealth,
        image: pokeImage,
        attack: pokeAttack,
        type: pokeType
      });
      $('#battleMode').css("display", "none");
    };
  });   
}