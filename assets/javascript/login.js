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
        $(loginSuccess).children('h1')
          .text(success.message);
        
        userRef.child("markers").set(markers);
        userRef.child("berries").set(berries);

        userRef.child("markers").on('value', function(snap) { markers = snap.val(); });
        userRef.child("berries").on('value', function(snap) { berries = snap.val(); 
          if (berries == 0) {
            $('#berriesButton').hide();
          } else {
            $('#berriesButton').show();
          }
          $('#berryAmount').text(berries)
        });

        $('#berriesButton').hide();

        initialPokemon();
        initMapHandler();
        initPouchHandler();
      }).catch(function(error) {
        loginFailure.style.display = 'block';
        $(loginFailure).children('h1')
          .text(error.message);

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
        initMapHandler()

        loginSuccess.style.display = 'block';
        $(loginSuccess).children('h1')
          .text('Welcome back, ' + success.email + '!');

        userRef.child("markers").on('value', function(snap) { markers = snap.val(); });
        userRef.child("berries").on('value', function(snap) { berries = snap.val(); 
          if (berries == 0) {
            $('#berriesButton').hide();
          } else {
            $('#berriesButton').show();
          }
          $('#berryAmount').text(berries)
        });

      }).catch(function(error) {
        loginFailure.style.display = 'block';
        var errorCode = error.code;
        var errorMessage = error.message;
        $(loginFailure).children('h1')
          .text(error.message);
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
    
    userPokes[poke.key] = poke

    var $div = renderPokeInPouch(poke)

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

