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

//reference the Firebase 
var database = firebase.database();

//Global Variable 
var item;
var cal;
var sug;
var sodi;
var fat;
var unixTime;
var timeStamp;
var time;
var pro; 
var itemName; 
var carb;




//handles logout button 
btnLogout.on('click', e => {
    logout(); 

});

function logout(){
    firebase.auth().signOut();
    event.preventDefault();
    console.log('logged Out');
    location.href = "index.html"
    alert('logged out');
}

//handles current signin user
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(user); 
    console.log(email); 
    console.log(displayName); 
    // ...

        function Chat () {
            this.update = updateChat;
            this.send = sendChat;
            this.getState = getStateOfChat;
}

        //gets the state of the chat
            function getStateOfChat() {
                if(!instanse){
                    instanse = true;
                    $.ajax({
                        type: "POST",
                        url: "process.php",
                        data: {'function': 'getState', 'file': file},
                        dataType: "json",   
                        success: function(data) {state = data.state;instanse = false;}
                    });
                }   
            }

            //Updates the chat
            function updateChat() {
                if(!instanse){
                    instanse = true;
                    $.ajax({
                        type: "POST",
                        url: "process.php",
                        data: {'function': 'update','state': state,'file': file},
                        dataType: "json",
                        success: function(data) {
                            if(data.text){
                                for (var i = 0; i < data.text.length; i++) {
                                    $('#chat-area').append($(" "+ data.text[i] + " "));
                                }   
                            }
                            document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
                            instanse = false;
                            state = data.state;
                        }
                    });
                }
                else {
                    setTimeout(updateChat, 1500);
                }
            }

            //send the message
            function sendChat(message, nickname) { 
                updateChat();
                $.ajax({
                    type: "POST",
                    url: "process.php",
                    data: {'function': 'send','message': message,'nickname': nickname,'file': file},
                    dataType: "json",
                    success: function(data){
                        updateChat();
                    }
                });
            }

} else {
            // User is signed out.
            console.log('not logged in'); 
    }
}); 
