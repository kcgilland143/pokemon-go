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
        initialPokemon()
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
    fetchAjax().done(function (response){
      userRef.push(getPokeValues(response))
    })
}

// initializer for long-standing DB .on functions
// to stop some of the compounding recursion
function initPouchHandler() {
  userRef.child('pokemon').on("child_added", function(childSnapshot){
    var poke = getPokeValuesFromDB(childSnapshot)
    
    userPokes[poke.key] = poke

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

    delete userPokes[snapshot.key]

    setTimeout(function () {
      $pokemoncollection
        .isotope('remove', pokeRemoved)
        .isotope('layout')
    }, 500)

    loadPokemon()
  })

  userRef.child('pokemon').on('child_changed', function (snapshot) {
    var changed = snapshot.val() 
    // find pouch pokemon by filtering through children
    var $pouchPoke = $pokemoncollection.children().filter(function (i, poke) {
      return ($(poke).attr('data-id') === snapshot.key)
    })
    // update element with new values 
    storePokeDataInElement($pouchPoke, changed)
    decoratePouchHover($pouchPoke)

    $pokemoncollection.isotope('updateSortData')
  //update pokemon in pouch
  })
  
  loadPokemon()
}