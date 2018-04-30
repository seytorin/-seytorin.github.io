
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
    var database = firebase.database();

    var item;
    var cal = 0;
    var carb = 0;
    var fat = 0;
    var pro = 0;
    var sodi = 0;
    var itemName; 
    var unixTime;
    var timeStamp;
    var time;
    var newMeal;
                        

    //handles current signin 
  

//handles logout button 
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
    // alert('logged out');
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


    $("#add-meal-btn").on("click", function() {
            
        event.preventDefault();
        item = $("#item").val().trim();
        $('#item').val(' '); 
                
          

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

                  

                     newMeal = {

                        item:item,
                        calories:cal,
                        fat:fat,
                        carbs:carb,
                        protein: pro, 
                        sodium:sodi,
                        time:timeStamp,
                        dateAdded: firebase.database.ServerValue.TIMESTAMP
                    };

                    database.ref().push(newMeal);


                        //Create if statement for number range

                    

                    });  //2nd Ajax


               }); //1st Ajax
         
    });
             
                
                $("#reportGen-btn").on("click", function() {
                    $("#tableHeader").html("<div class='tbl-header'><table cellpadding='0' cellspacing='0' border='0'><thead><tr>" + 
                        "<th>" + "Meal" + 
                        "</th><th>" + "Calories" + 
                        "</th><th>" + "Carbs" +  
                        "</th><th>" + "Fat" + 
                        "</th><th>" + "Protein" +
                        "</th><th>" + "Sodium" + 
                        "</th><th>" + "Date" + 
                        "</th></tr></thead></table></div>"); 
                });
                //retrieving Data from firebase



                database.ref().on("child_added", function(childSnapshot, prevChildKey) {



                    $("#reportGen-btn").on("click", function(event) {
                     
                        event.preventDefault();
                        
                       
                        var fromDate = $("#reportFrom").val();
                        var toDate = $("#reportTo").val();
                        fromDate = moment(fromDate).format("MM/DD/YY");
                        toDate = moment(toDate).format("MM/DD/YY");

                       
               
                        //Applies data from user specified dates
                        if(fromDate <= childSnapshot.val().time && childSnapshot.val().time <= toDate){
                           var itemVal = childSnapshot.val().item;
                           //Creates a table 
                           $(".tbl-content").append("<table cellpadding='0' cellspacing='0' border='0'><tbody><tr><td>" + 
                            itemVal + "</td>" + "<td>" + 
                            childSnapshot.val().calories + "</td>" + "<td>" + 
                            childSnapshot.val().carbs + " (g)" + "</td>" + "<td>" +  
                            childSnapshot.val().fat + " (g)" + "</td>" + "<td>" + 
                            childSnapshot.val().protein + " (g)" + "</td>" + "<td>" + 
                            childSnapshot.val().sodium + " (g)" + "</td>" + "<td>" + 
                            childSnapshot.val().time + "</td>" + " </td></tr></tbody></table>");
                            
                           
                        }
                        //Totals each variable
                         if(fromDate <= childSnapshot.val().time && childSnapshot.val().time <= toDate){
                            
                            if(childSnapshot.val().calories > 0 && childSnapshot.val().calories != NaN){
                                cal = cal + childSnapshot.val().calories;
                                
                            }

                            if(childSnapshot.val().carbs > 0 && childSnapshot.val().carbs != NaN){
                                carb = carb + childSnapshot.val().carbs;
                            }

                            if(childSnapshot.val().fat > 0 && childSnapshot.val().fat != NaN){
                                fat = fat + childSnapshot.val().fat;
                            }

                            if(childSnapshot.val().protein > 0 && childSnapshot.val().protein != NaN){  
                                pro = pro + childSnapshot.val().protein;
                            }

                            if(childSnapshot.val().sodium > 0 && childSnapshot.val().sodium != NaN){   
                                sodi = sodi + childSnapshot.val().sodium;
                                sodi = sodi / 1000;
                            }
                            
                        

                              $("#total").html("<table cellpadding='0' cellspacing='0' border='0'><tbody><tr><td>" + 
                            "Total" + "</td>" + "<td>" + 
                            cal.toFixed(2) + "</td>" + "<td>" + 
                            carb.toFixed(2) + "</td>" + "<td>" +  
                            fat.toFixed(2) + "</td>" + "<td>" + 
                            pro.toFixed(2) + "</td>" + "<td>" + 
                            sodi.toFixed(2) + "</td>" + "<td>" + 
                            fromDate + "-" + toDate + "</td>" + " </td></tr></tbody></table>");

                        

                        }
                       

                    if(childSnapshot.val().time > toDate) {

                        var ctx = document.getElementById("myChart");
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
                    }); // my chart
                }
                    $("#reset").on("click", function(event){ 
                        location.href="landingPage.html"; 
                    }); 
                    //     $(".tbl-content").empty();
                    //     $("#total").empty();
                    //     cal = 0;
                    //     carb = 0;
                    //     fat = 0;
                    //     pro = 0;
                    //    var ctx = document.getElementById("myChart");
                    //     var myChart = new Chart(ctx, {
                    //     type: 'polarArea',
                    //     data: {
                    //         labels: ["Calories", "Carbohydrates", "Fats", "Protein", "Sodium",],
                    //         datasets: [{
                    //             label: '# of Votes',
                    //             data: [0, 0, 0, 0, 0, ],
                    //             backgroundColor: [
                    //                 'rgba(255, 99, 132, 1)',
                    //                 'rgba(54, 162, 235, 1)',
                    //                 'rgba(255, 206, 86, 1)',
                    //                 'rgba(75, 192, 192, 1)',
                    //                 'rgba(153, 102, 255, 1)',
                    //                 'rgba(255, 159, 164, 1)',
    
                    //             ],
                    //             borderColor: [
                    //                 'rgba(0,0,0,1)',
                    //                 'rgba(0,0,0,1)',
                    //                 'rgba(0,0,0,1)',
                    //                 'rgba(0,0,0,1)',
                    //                 'rgba(0,0,0,1)',
                    //                 'rgba(0,0,0,1)',
                                  
                    //             ],
                    //             borderWidth: 1
                    //         }]
                    //     },
                    //     options: {
                    //         scales: {
                    //             yAxes: [{
                    //                 ticks: {
                    //                     beginAtZero:true
                    //                 }
                    //             }]
                    //         }
                    //     }
                    // }); // my chart
                    // }); 

                 
           
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

                 
                
          