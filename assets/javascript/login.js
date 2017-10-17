$('#sumbit').on("click", function() {
   var select = $('#sel1').val();
   var email = $('#email').val();
   var password = $('#password').val();
  
   

   if (select == 2) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
        userRef = database.ref().child("Users").child(userId.uid);
        loginSuccess.style.display = 'block';
        
        userRef.child("markers").set(markers);
        userRef.child("berries").set(berries);
      
        $('#berriesButton').hide();
        

        initialPokemon();
        initPouchHandler();
      }).catch(function(error) {
        loginFailure.style.display = 'block';
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("User Does Not Exist: " + errorMessage);
      });
   }
   if (select == 1) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
        userRef = database.ref().child("Users").child(userId.uid);
        initPouchHandler()
        loginSuccess.style.display = 'block';

        userRef.child("markers").on('value', function(snap) { markers = snap.val().markers; });
        userRef.child("berries").on('value', function(snap) { berries = snap.val(); 
          if (berries == 0) {
            $('#berriesButton').hide();
          } else {
            $('#berriesButton').show();
          }

        });



      }).catch(function(error) {
        loginFailure.style.display = 'block';
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Invalid Email: " + errorMessage);
      });
    };
    
});

function initialPokemon() {
    //global variable for user database reference
    fetchPoke(null, function(pokeObj) {
        userRef.child("pokemon").push(pokeObj)
    });
}
      

// initializer for long-standing DB .on functions
// to stop some of the compounding recursion
function initPouchHandler() {

  userRef.child("pokemon").on("child_added", function(childSnapshot){

    var poke = getPokeValuesFromDB(childSnapshot)
    
    var dataObj;

    var $div = renderPokeInPouch(poke)
    
    console.log(poke)

    decoratePouchHover($div)

    setTimeout(function () {
      $pokemoncollection
      .prepend($div)
      .isotope('prepended', $div)
    }, 500)

    loadPokemon() //to show pouch
  });
  //userRef.on('child_removed') ---TODO

  userRef.child('pokemon').on('child_removed', function (snapshot) {
    //remove pokemon from pouch
    var pokeRemoved = $pokemoncollection.children().filter(function (i, childElem) {
      console.log(snapshot.key)
      return $(childElem).attr('data-id') === snapshot.key
    })

    setTimeout(function () {
      $pokemoncollection
        .isotope('remove', pokeRemoved)
        .isotope('layout')
    }, 500)

    loadPokemon()
  })
  
  loadPokemon()
}




