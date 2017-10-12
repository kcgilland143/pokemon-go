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
        var ref = database.ref().child("Users").child(userId.uid).child(referenceId);
        ref.remove()
        // load the you won the pokemon page
      };

      // if (catchHealth <= 0) {
      //   load you lost the pokemon page
      // }
  });

  $('#catchButton').unbind().click(function() {
    if (catchHealth < 10) {
      catched.play();
      database.ref().child("Users").child(userId.uid).push({ 
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