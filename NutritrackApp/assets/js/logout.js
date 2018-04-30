
$(document).ready(function() {
  //Initialize Firebase 
    var config = {
      apiKey: "AIzaSyA7i_7yLZxHJxRmtHqvYFepccrvGxbrie8",
      authDomain: "nutritrack-smu.firebaseapp.com",
      databaseURL: "https://nutritrack-smu.firebaseio.com",
      projectId: "nutritrack-smu",
      storageBucket: "nutritrack-smu.appspot.com",
      messagingSenderId: "1078293750813"
    };
    
    firebase.initializeApp(config);
     // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();
    
    //Get Elements 
    var btnLogout = $('#btnLogout');
    var fileButton = $('#fileButton'); 

    btnLogout.on('click', e=>{
      firebase.auth().signOut(); 
      console.log('clicked')
      location.href = "index.html" 
    }); 
    // fileButton.on('click', function() {
    //   alert('clicked'); 
    // }); 
  //Listen the file selection 
  fileButton.on('change', function(e) {
    //get file 
     var file = e.target.files[0]; 

    //Create a storage ref
    var storageRef = firebase.storage().ref(user+'/profilePicture/' + file.name)
    
    //upload file
    var task = storageRef.put(file); 
    var user = firebase.auth().currentUser;   

    //upload progress bar
    task.on('state_changed', 
      function error(err) {

      },

      function complete() {

      }

      ); 
  }); 

  //Display Picture
  function showUserDetails(){

   var user = firebase.auth().currentUser;
   var name,email, photoUrl, uid;

   if (user != null) {
      name = user.displayName;
      photoUrl = user.photoURL;

      document.getElementById('dp').innerHTML=photoURL;
      document.getElementById('username').innerHTML=name;  
}}


}); 
