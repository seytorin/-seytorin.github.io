$(document).ready(function() {

  //Initiate the firebase. 
  var config = {
      apiKey: "AIzaSyA7i_7yLZxHJxRmtHqvYFepccrvGxbrie8",
      authDomain: "nutritrack-smu.firebaseapp.com",
      databaseURL: "https://nutritrack-smu.firebaseio.com",
      projectId: "nutritrack-smu",
      storageBucket: "nutritrack-smu.appspot.com",
      messagingSenderId: "1078293750813"
  };
  firebase.initializeApp(config);

  //Global Variables

    var database = firebase.database();
    var firstName="";
    var lastName="";
    var initialInput="" 
    var submitButton="";
    var data = ""; 
    var postID = data.key;
    var id = "";
    var file ="";
    var email = "";
    

    var fileButton = $('#fileButton');
    var btnHome = $('#btnHome');


  //handles logout button 
  $('#btnLogout').on('click', e => {
    event.preventDefault();
        firebase.auth().signOut().then(function(){
          location.href = "index.html"
        }, function(error){
        console.log("Error Signing out:", error); 
    });
    
  });


  //handles HOME button
  btnHome.on('click', e => {
    event.preventDefault();
    location.href = "landingPage.html"
  });


  // $(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var user = firebase.auth().currentUser;
      console.log(user);
      console.log(email);
      console.log(user.uid);
                    
      }  
  });
           
  //handles image uploads:
  var fileButton = document.getElementById("fileButton");
  // Listen for afile selection
  fileButton.addEventListener("change", function (e) {
    event.preventDefault();
      //Get file
      var file = e.target.files[0];
      // Create a storage ref
      var storageRef = firebase.storage().ref("profiles/" + file.name);
      //Upload file
      var uploadTask = storageRef.put(file);
        // Updated progress bar
      uploadTask.on('state_changed',
      function (snapshot) {},
      function error(err) {},
      function complete() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          $("#fileButton").hide();
          $("#default-img").attr("src", downloadURL);
          console.log(downloadURL);
      });
  });
  


//   //hanldes indentity input sumbission 
//   // function formSubmit(){
//     $("#done-btn").on("click", function () {
//         alert('clicked'); 
//         event.preventDefault();
//         firstName = $("#userName").val().trim();
//         lastName = $("#lastName").val().trim();
//         writeUserData();
//         dbcheck();   
//       }); //done-btn
// // }

// // formSubmit(); 



// function writeUserData() { 
//     var data = firebase.database().ref().push({
//       'usersInfo':{
//       firstName: firstName,
//       lastName:lastName,
//       dateAdded: firebase.database.ServerValue.TIMESTAMP
//     }
//   }); 
//   var key = data.key; 

//   }

// function dbcheck() {
//  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {            
//     event.preventDefault(); 
//     var sv = snapshot.val();      
//     // console.log(sv.usersInfo.dateAdded); 
//     console.log(sv.usersInfo.lastName);
//     console.log(sv.usersInfo.firstName);
//     // Change the HTML to reflect             
//       $("#fname-display").text(snapshot.val().usersInfo.firstName); 
//       $("#lname-display").text(snapshot.val().usersInfo.lastName);
           
//   });
// };


// // dbcheck();
// // // }); 

//retrieve the Image: 
// Create a reference with an initial file path and name
var storage = firebase.storage();
var pathReference = storage.ref();
var storageRef = firebase.storage().ref();

// Create a reference from a Google Cloud Storage URI
var gsReference = storage.refFromURL('gs://nutritrack-smu.appspot.com/profiles/profile.png')

// Create a reference from an HTTPS URL
// Note that in the URL, characters are URL escaped!
var httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/nutritrack-smu.appspot.com/o/profiles/profile.png');

storageRef.child('profiles/profile.png').getDownloadURL().then(function(url) {
  // `url` is the download URL for 'images/stars.jpg'

  // This can be downloaded directly:
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();

  // Or inserted into an <img> element:
  var img = document.getElementById('default-img');
  img.src = url;
  
}).catch(function(error) {
  // Handle any errors
});

}); 