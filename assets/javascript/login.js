$('#sumbit').on("click", function() {
   var select = $('#sel1').val();
   var email = $('#email').val();
   var password = $('#password').val();
  
   

   if (select == 2) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
        alert("New User Created");
        userId = firebase.auth().currentUser;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
      setTimeout(initialPokemon, 3000);
   }
   if (select == 1) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
        alert("You're Logged In");
        userId = firebase.auth().currentUser;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
      fetchAjax().done(addPokeToVariables);
    };



    function initialPokemon() {
      
        var ref = database.ref().child("Users").child(userId.uid);
        ref.push({
          name: pokeName,
          hp: pokeHealth,
          image: pokeImage,
          type: pokeType,
          attack: pokeAttack,
        });
        
    
        loadPokemon();
        fetchAjax().done(addPokeToVariables);
    }


    $('#userPortal').hide();
});