const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('css'));
app.use(express.static('img'));

app.get("/",function(req,res){
	res.sendFile(__dirname +"/loginPage.html");
});

app.get("/register_student", function (req, res) {
    res.sendFile(__dirname + '/registration_student.html');
});
app.get("/register_warden", function (req, res) {
    res.sendFile(__dirname + '/registration_warden.html');
});

app.get("/studentHome",function(req,res){
	res.sendFile(__dirname + "/studentHome.html");
});

app.get("/adminHome",function(req,res){
	res.sendFile(__dirname + "/adminHome.html");
});

app.get("/wardenHome",function(req,res){
    res.sendFile(__dirname + "/wardenHome.html")
});

// DATABASE connection
const {Client} = require("pg");
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"Abhisql",
    database:"Hosteldb"
})
client.connect();

app.post('/',function(req,res){
    var p = req.body.whoami;
    var p_id = req.body.stdid;
    var p_passwd = req.body.passwd;
    
    if(p=='std'){
        client.query(`select student_passwd from student where student_id = '${p_id}'`, (err, res2) => {
            console.log(res2);
            if(err) console.log(err.message);
            else if (res2.rowCount == 0){
                console.log("Student not registered");
                res.send("Student not registered");
            }
            else if(p_passwd==res2.rows[0].student_passwd){
                res.redirect('/studentHome');
            }
            else{
                console.log("Password Not Matched.");
                res.send("Password Not Matched.");
            }
        })
        
    }
    else if(p=='adm'){
        client.query(`select admin_passwd from admin where admin_id = '${p_id}'`, (err, res2) => {
            console.log(res2);
            if (err) console.log(err.message);
            else if (res2.rowCount == 0) {
                console.log("Admin not found");
                res.send("Admin not found");
            }
            else if (p_passwd == res2.rows[0].admin_passwd) {
                res.redirect('/adminHome');
            }
            else {
                console.log("Password Not Matched.");
                res.send("Password Not Matched.");
            }
        })
    }
    else{
        client.query(`select warden_passwd from warden where warden_id = '${p_id}'`, (err, res2) => {
            console.log(res2);
            if (err) console.log(err.message);
            else if (res2.rowCount == 0) {
                console.log("warden not registered");
                res.send("warden not registered");
            }
            else if (p_passwd == res2.rows[0].student_passwd) {
                res.redirect('/wardenHome');
            }
            else {
                console.log("Password Not Matched.");
                res.send("Password Not Matched.");
            }
        })
    }
})


app.listen(3000, function () {
    console.log('server running on port 3000')
});