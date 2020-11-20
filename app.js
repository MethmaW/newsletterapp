//requiring
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");



//app express setup
const app = express();

dotenv.config();

//using the public folder
app.use(express.static("public"));

//using bodyParser
app.use(bodyParser.urlencoded({extended:true}));


//setting up the home route
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

//setting up the post request
app.post("/", function(req, res){

  var firstName = req.body.fName;
  var secondName = req.body.lName;
  var eMail = req.body.email;

  var data = {
    members: [
      {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secondName
        }
      }
    ]
  };


//converting js to json
var jsonData = JSON.stringify(data);

const url = "https://us17.api.mailchimp.com/3.0/lists/process.env.API_ID";
const options = {
  method: "POST",
  auth: process.env.API_KEY
}

const request = https.request(url, options, function(response){

  if(response.statusCode === 200){
    res.sendFile( __dirname + "/success.html");
  }
  else{
    res.sendFile( __dirname + "/failure.html");
  }

  response.on("data", function(data){
    console.log(JSON.parse(data));
  });
});

request.write(jsonData);
request.end();
});


app.post("/failure.html", function(req, res){
  res.redirect("/")
});




//listening to the server
app.listen(process.env.PORT || 3000, function(){
  console.log("Server 3000 is running");
});


