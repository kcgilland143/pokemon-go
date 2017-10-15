$('#sumbit').on("click", function() {
   var select = $('#sel1').val();
   var email = $('#email').val();
   var password = $('#password').val();
  
   

   if (select == 2) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
        console.log(success)
        alert("New User Created");
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("User Does Not Exist: " + errorMessage);
      });
      setTimeout(initialPokemon, 3000);
   }
   if (select == 1) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
        alert("You're Logged In");
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Invalid Email: " + errorMessage);
      });
      fetchAjax().done(addPokeToVariables);
    };
    
});

function initialPokemon() {
    //global variable for user database reference
    userRef = database.ref().child("Users").child(userId.uid);
    fetchAjax().done(function (response){
      userRef.push(getPokeValues(response))
    })
}
