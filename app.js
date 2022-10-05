const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('css'));

app.get("/",function(req,res){
	res.sendFile(__dirname +"/loginPage.html");
});

app.get("/register", function (req, res) {
    res.sendFile(__dirname + '/registration.html');
});

app.get("/studentHome",function(req,res){
	res.sendFile(__dirname + "/studentHome.html");
});

app.get("/adminHome",function(req,res){
	res.sendFile(__dirname + "/adminHome.html");
});

app.get("/wardentHome",function(req,res){
    res.sendFile(__dirname + "/wardenHome.html")
});

app.post('/',function(req,res){
    var p = req.body.whoami;
    if(p=='std')
	    res.redirect('/studentHome');
    else if(p=='adm')
	    res.redirect('/adminHome');
    else
        res.redirect('/wardenHome');
})


app.listen(3000, function () {
    console.log('server running on port 3000')
});