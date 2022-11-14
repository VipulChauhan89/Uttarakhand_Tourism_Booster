var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { response } = require("express");
const{ profanity } =require('@2toad/profanity');

var profanity1 = require('@2toad/profanity').profanity;


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));


//to start the app on index.html
app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
});
console.log("Listening on PORT 3000");


//database connection
mongoose.connect('mongodb://localhost:27017/Uttarakhand',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"));

//for uploading the experience in database for the reviewing to admin
app.post("/upload",async(req,res)=>{
    var district = req.body.dis;
    var name = req.body.name;
    var description = req.body.des;
    if(profanity1.exists(district+" "+name+" "+description))
    {
        res.send("Use of bad words is not allowed.");
        return ;
    }
    try
    {
        var data = {
                "district": district,
                "name": name,
                "description" : description,
                "status":"false"
            }
            db.collection("Place").insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully");
            });
            return res.redirect('index.html');
    }
    catch(error)
    {
        console.log(error);
    }
});


//to collect the email address for the newsletters
app.post("/newsletter",async(req,res)=>{
    var email = req.body.email;
    if(profanity1.exists(email))
    {
        res.send("Use of bad words is not allowed.");
        return ;
    }
    try
    {
        var data = {
                "email": email
            }
            db.collection("Newsletter").insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully");
            });
            return res.redirect('index.html');
    }
    catch(error)
    {
        console.log(error);
    }
});

//const path = require("path");
const server = require("http").createServer(app);
//app.use(express.static(path.join(__dirname,"../public/")));

server.listen(3000);