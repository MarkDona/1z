var activeTokenID = "";
// Retrieve an existing token ID from Firebase
function getTokenIdFromFirebase() {
    var tokenId = "";
    firebase.auth().onAuthStateChanged(function(user) {
        agentID = user.uid;

        var databaseRef = firebase.database().ref('agents/' + agentID + '/tokens');

        databaseRef.orderByChild("tokenStatus").equalTo("Unopened").once("value", function(snapshot) {
            var tokens = snapshot.val();
            if (tokens) {
              // Get the first token ID
              var tokenId = Object.keys(tokens)[0];
              console.log("Token ID: ", tokenId);
            } else {
              console.log("No active tokens found in the database.");
            }
          }, function(error) {
            console.log("Error retrieving tokens from the database: ", error);
          });
    
    });

    return tokenId;

}

// Function to count the number of tokens and active tokens
function countTokens() {

    firebase.auth().onAuthStateChanged(function(user) {

        agentID = user.uid;

        // Reference to the "tokens" node in the database
        var tokensRef = firebase.database().ref('agents/' + agentID + '/tokens');
  
        var totalTokens = 0;
        var activeTokens = 0;
        var unverifiedTokens = 0;
        var verifiedTokens = 0;
            tokensRef.once("value").then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                  var token = childSnapshot.val();
                  totalTokens++;

                  if(token){
                    document.getElementById("total-Tokens").innerHTML = totalTokens;

                    if (token.tokenStatus === "Unopened") {
                        activeTokens++;
                        document.getElementById("total-Active-Tokens").innerHTML = activeTokens; 

                    }else  if (token.tokenStatus === "Opened"){

                      unverifiedTokens++;
                      document.getElementById("total-Unverified-Tokens").innerHTML = unverifiedTokens;
                    }else {

                      verifiedTokens++;
                      document.getElementById("total-Verified-Tokens").innerHTML = verifiedTokens;
                    }
                  }
                  
              });

                console.log("Total tokens: ", totalTokens);
                console.log("Active tokens: ", activeTokens);
                console.log("Unverified tokens: ", unverifiedTokens);
                console.log("Unverified tokens: ", unverifiedTokens);
                
            }).catch(function(error) {
                console.log("Error retrieving tokens: ", error);
            });
            
            
     });

}

function checkTokenStatus() {
   
    firebase.auth().onAuthStateChanged(function(user) {

      agentID = user.uid;

      var databaseRef = firebase.database().ref('agents/' + agentID + '/tokens');

       databaseRef.once("value", function(snapshot) {
        var tokens = snapshot.val();
        console.log(tokens);

        Object.keys(tokens).forEach(function(tokenId) {
            var token = tokens[tokenId];
            //console.log("Token ID:", tokenId, "Status:", token.tokenStatus);
            if (token.tokenStatus === "Unopened") {
              // Token is active, disable the button
                disableButton(true); 
                //alert("Active Token Present..!");
                activeTokenID = tokenId;
                console.log("Token ID:", tokenId, "Status:", token.tokenStatus); 
            }
          });
      }, function(error) {
        console.log("Error retrieving token status: ", error);
      });

    });
 }
 // Function to disable the button
function disableButton(state) {
    var myButton = document.getElementById("generate-url-btn");
    myButton.disabled = state;
    myButton.innerText = "Locked";
}

//fetch agent, token and candidate info on dashboard load 
// function readData(){

//     //checkTokenStatus();
//     countTokens();
//     //getTokenIdFromFirebase();

//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//           // User is signed in.

//           var agentID = user.uid;
//           console.log("AgentID: " + agentID);

//           var tbody = document.querySelector("#data-table tbody");
//           var rbody = document.querySelector("#data-mobile tbody");
//           tbody.innerHTML = "";
//           rbody.innerHTML = "";

//             var agentCollectionId = agentID;

//             var link = "";
//             var token = "";
//             var tokenId = "";
//             var tokenStatus = "";
//             var candidateName = "";

//             // Reference to the subcollection
//           var tokencollectionRef = firebase.database().ref('agents/' + agentCollectionId + '/tokens');
//           var tokencollectionRefm = firebase.database().ref('agents/' + agentCollectionId + '/tokens');

//             // Retrieve the subcollection data
//             tokencollectionRef.once('value')
//             .then(function(snapshot) {

//                 snapshot.forEach(function(childSnapshot){
//                     var tokenData = childSnapshot.val();

//                     var row = document.createElement("tr");

//                     // Create table data cells and populate with data
//                     tokenId = document.createElement("td");
//                     tokenId.textContent = childSnapshot.key;
//                     row.appendChild(tokenId);

//                     token = document.createElement("td");
//                     token.textContent = tokenData.token;
//                     row.appendChild(token);

//                     link = document.createElement("td"); 
//                     link.textContent = tokenData.linkWithToken  + "?agentID=" + agentID + "&" + "tokenID=" + childSnapshot.key;
//                     link.setAttribute("class", "hide-column");       
//                     row.appendChild(link);

//                     candidateName =  document.createElement("td");
//                     candidateName.textContent = tokenData.candidateName;
//                     row.appendChild(candidateName);

//                     linkStatus =  document.createElement("td");
//                     linkStatus.textContent = tokenData.linkStatus;
//                     row.appendChild(linkStatus);

//                     tokenStatus = document.createElement("td");
//                     tokenStatus.textContent = tokenData.tokenStatus;
//                     row.appendChild(tokenStatus);

//                     // Append the row to the table body
//                     tbody.appendChild(row);

//                 })
//             })
//             .catch(function(error) {
//                 console.error('Error retrieving subcollection data:', error);
//             });
          
          
//         tokencollectionRefm.once('value')
//             .then(function(snapshot) {

//                 snapshot.forEach(function(childSnapshot){
//                     var tokenData = childSnapshot.val();

//                     var row = document.createElement("tr");

//                     // Create table data cells and populate with data
//                     token = document.createElement("td");
//                     token.textContent = tokenData.token;
//                     row.appendChild(token);

//                     candidateName =  document.createElement("td");
//                     candidateName.textContent = tokenData.candidateName;
//                     row.appendChild(candidateName);
                  
//                     tokenStatus = document.createElement("td");
//                     tokenStatus.textContent = tokenData.tokenStatus;
//                     row.appendChild(tokenStatus);

//                     // Append the row to the table body
//                     rbody.appendChild(row);

//                 })
//             })
//             .catch(function(error) {
//                 console.error('Error retrieving subcollection data:', error);
//             });
//         }
//       });
       
// }

function readData(){

    //checkTokenStatus();
    countTokens();
    //getTokenIdFromFirebase();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

          var agentID = user.uid;
          console.log("AgentID: " + agentID);

          var tbody = document.querySelector("#data-table tbody");
          var rbody = document.querySelector("#data-mobile tbody");
          tbody.innerHTML = "";
          rbody.innerHTML = "";

            var agentCollectionId = agentID;

            var link = "";
            var token = "";
            var tokenId = "";
            var tokenStatus = "";
            var candidateName = "";
            var createdAt = "";

            // Reference to the subcollection
            var tokencollectionRef = firebase.database().ref('agents/' + agentCollectionId + '/tokens');
            var tokencollectionRefm = firebase.database().ref('agents/' + agentCollectionId + '/tokens');

            // Retrieve the subcollection data
            tokencollectionRef.once('value')
            .then(function(snapshot) {

                snapshot.forEach(function(childSnapshot){
                    var tokenData = childSnapshot.val();

                    var row = document.createElement("tr");

                    // Create table data cells and populate with data
                    tokenId = document.createElement("td");
                    tokenId.textContent = childSnapshot.key;
                    row.appendChild(tokenId);

                    token = document.createElement("td");
                    token.textContent = tokenData.token;
                    row.appendChild(token);

                    link = document.createElement("td"); 
                    link.textContent = tokenData.linkWithToken  + "?agentID=" + agentID + "&" + "tokenID=" + childSnapshot.key;
                    link.setAttribute("class", "hide-column");       
                    row.appendChild(link);

                    candidateName =  document.createElement("td");
                    candidateName.textContent = tokenData.candidateName;
                    row.appendChild(candidateName);

                    linkStatus =  document.createElement("td");
                    linkStatus.textContent = tokenData.linkStatus;
                    row.appendChild(linkStatus);

                    tokenStatus = document.createElement("td");
                    tokenStatus.textContent = tokenData.tokenStatus;
                    row.appendChild(tokenStatus);

                    createdAt = document.createElement("td");
                    createdAt.textContent = tokenData.createdAt;
                    row.appendChild(createdAt);

                    // Append the row to the table body
                    tbody.appendChild(row);

                })
            })
            .catch(function(error) {
                console.error('Error retrieving subcollection data:', error);
            });
            
                tokencollectionRefm.once('value')
            .then(function(snapshot) {

                snapshot.forEach(function(childSnapshot){
                    var tokenData = childSnapshot.val();

                    var row = document.createElement("tr");

                    // Create table data cells and populate with data
                    token = document.createElement("td");
                    token.textContent = tokenData.token;
                    row.appendChild(token);

                    candidateName =  document.createElement("td");
                    candidateName.textContent = tokenData.candidateName;
                    row.appendChild(candidateName);
                  
                    tokenStatus = document.createElement("td");
                    tokenStatus.textContent = tokenData.tokenStatus;
                    row.appendChild(tokenStatus);

                    // Append the row to the table body
                    rbody.appendChild(row);

                })
            })
            .catch(function(error) {
                console.error('Error retrieving subcollection data:', error);
            });
        }
      });  
}

window.onload = readData;
