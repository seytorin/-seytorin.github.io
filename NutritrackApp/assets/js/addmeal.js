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


//hide the table on page load.
$('#tableHeader').hide();
$('#itemName').hide(); 

//Get HTML Elements
var btnLogout = $('#btnLogout');


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

        //Write Data to Firebase Root Directory 
        $("#add-meal-btn").on("click", function() {
            event.preventDefault();
                item = $("#item").val().trim(); 
                firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data){
                    // console.log('Date in moment ' + data.val() + Date.now());

                    unixTime = Date.now();
                    timeStamp = moment(unixTime).format("MM/DD/YY");
                        
                    console.log("today's Date " + timeStamp);
                }, //firebase.database().ref

                function (err) {
                    return err;
                }); //function(err)

            var queryURL = "https://api.nutritionix.com/v1_1/search/" + item + "?results=0%3A1&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=ef960392&appKey=55b5dd87d2107d2b9ae4e9b7651a181a" 
            //submit value from enter item box
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(r){
                console.log("food Consumed: " + item);
                var results = r.brand_name;
                var itemId = r.hits[0]._id;        
                console.log(itemId);
                var queryURL2 = "https://api.nutritionix.com/v1_1/item?id=" + itemId + "&appId=ef960392&appKey=55b5dd87d2107d2b9ae4e9b7651a181a"
                $.ajax({
                    url: queryURL2,
                    method: "GET"
                }).done(function(response) {
                    var results2 = response;
                    cal = response.nf_calories;
                    fat = response.nf_total_fat;
                    carb = response.nf_total_carbohydrate; 
                    pro = response.nf_total_protein;
                    sodi = response.nf_sodium;
                    itemName = response.item_name; 


                $("#food").html('<h4>' + 'Meal Added: '+ '</h4>'+ '<h5>' + itemName+ '</h5>'
                    + '<h5>' +'Total Calorie Intake: ' + cal + '</h5>'
                    + '<h5>' + 'Total Fat Intake: ' + fat +  ' gms' + '</h5>'
                    + '<h5>' + 'Total Protein Intake: ' + pro +  ' gms' + '</h5>'
                    + '<h5>' + 'Total Carb Intake:' + carb +  ' gms' + '</h5>'
                    + '<h5>' + 'Total Sodium Intake:  ' + sodi +  ' gms' + '</h5>'
                    );

                console.log('Food consumed: ' + itemName); 
                console.log('Calories consumed: ' + cal);
                console.log('Sodium consumed: ' + sodi + ' gms'); 
                console.log('Fat consumed: ' + fat + ' gms'); 
                console.log('Protein Intake: ' + pro + ' gms'); 
                console.log('Carbs consumed: ' + carb + ' gms'); 

                 newMeal = {
                    item:item,
                    calories:cal,
                    sodium:sodi,
                    fat:fat,
                    carbs:carb,
                    protein: pro, 
                    time:timeStamp,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                };

                database.ref().push(newMeal);
                var ctx = $("#myChart"); 
                var myChart = new Chart(ctx, {
                        type: 'polarArea',
                        data: {
                            labels: ["Calories", "Carbohydrates", "Fats", "Protein", "Sodium",],
                            datasets: [{
                                label: '# of Votes',
                                data: [cal.toFixed(0), carb.toFixed(0), fat.toFixed(0), pro.toFixed(0), sodi.toFixed(0), ],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 164, 1)',
    
                                ],
                                borderColor: [
                                    'rgba(0,0,0,1)',
                                    'rgba(0,0,0,1)',
                                    'rgba(0,0,0,1)',
                                    'rgba(0,0,0,1)',
                                    'rgba(0,0,0,1)',
                                    'rgba(0,0,0,1)',
                                  
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    }); // my  chart
                });  //2nd Ajax
            }); //1st Ajax
        }); //add meal button 


        //handles report generation
        $("#reportGen-btn").on("click", function() {
            $('#tableHeader').show();
            $('#itemName').show(); 
            $("#tableHeader").html("<div class='tbl-header'><table cellpadding='0' cellspacing='0' border='0'><thead><tr>" + 
                "<th>" + "Meal" + 
                "</th><th>" + "Calories(kcal)" + 
                "</th><th>" + "Fat(g)" + 
                "</th><th>" + "Protein(g) " + 
                "</th><th>" + "Carb(g)" +
                "</th><th>" + "Sodium(g)" +  
                "</th><th>" + "Date" + 
                "</th></tr></thead></table></div>"); 
        });

        //retrieving Data from firebase
        database.ref().on("child_added", function(childSnapshot, prevChildKey) {

            $("#reportGen-btn").on("click", function(event) {
                event.preventDefault();
                console.log("Generate works");
                var fromDate = $("#reportFrom").val();
                var toDate = $("#reportTo").val();
                fromDate = moment(fromDate).format("MM/DD/YY");
                toDate = moment(toDate).format("MM/DD/YY");
                var itemCal =0;
                var itemCalTotal = 0;
                    if(fromDate <= childSnapshot.val().time && childSnapshot.val().time <= toDate){
                        var itemVal = childSnapshot.val().item;
                        console.log(childSnapshot.val().item); 
                        
                        $(".tbl-content").append("<table class='tb-content' cellpadding='0' cellspacing='0' border='0'><tbody><tr><td>" + 
                            itemVal + "</td>" + "<td>" + 
                            childSnapshot.val().calories + "</td>" + "<td>" + 
                            childSnapshot.val().carbs + "</td>" + "<td>" + 
                            childSnapshot.val().sodium + "</td>" + "<td>" + 
                             childSnapshot.val().protein + " (g)" + "</td>" + "<td>" + 
                            childSnapshot.val().fat + "</td>" + "<td>" + 
                            childSnapshot.val().time + "</td>" + " </td></tr></tbody></table>");
                    }
            });
        },
            database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(snapshot) {
                $("#item").val(snapshot.val().item);
                document.getElementById("myChart");       
            })
        );

} else {
            // User is signed out.
            console.log('not logged in'); 
    }
}); 
