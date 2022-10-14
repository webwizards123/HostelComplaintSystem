const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('css'));
app.use(express.static('img'));

//ejs

app.set('views', './views');
app.set('view engine', 'ejs');

//
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
	// res.sendFile(__dirname + "/studentHome.html");
    client.query(`select student_name,hostel_ref_id,room_no from student where student_id='${globalid}'`,function(err,res2){
        if(err){
            res.send("<h1>" + err.message +"</h1>");
        }
        else{
            res.render("studentHome", { name:res2.rows[0].student_name, roomno:res2.rows[0].room_no , hname:res2.rows[0].hostel_ref_id });
        }
    })
    
});

app.get("/adminHome",function(req,res){
    client.query(`select admin_name from admin where admin_id='${globalid}'`, function (err, res2) {
        if (err) {
            res.send("<h1>" + err.message + "</h1>");
        }
        else {
            res.render("adminHome", { name: res2.rows[0].admin_name });
        }
    })
});

app.get("/wardenHome",function(req,res){
    client.query(`select warden_name from warden where warden_id='${globalid}'`, function (err2, res2) {
        if (err2) {
            res.send("<h1>" + err2.message + "</h1>");
        }
        else {
            client.query(`select hostel_id from hostel where warden_ref_id='${globalid}'`, function (err3, res3) {
                if (err3) {
                    res.send("<h1>" + err3.message + "</h1>");
                }
                else {
                    res.render("wardenHome", { name: res2.rows[0].warden_name, hname:res3.rows[0].hostel_id });
                }
            })
            
        }
    })
});

app.get('/generate_complaint', function (req, res) {
    res.sendFile(__dirname + "/generateComplaint.html");
})



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

var globalid;

app.post('/',function(req,res){
    var p = req.body.whoami;
    var p_id = req.body.stdid;
    var p_passwd = req.body.passwd;
    globalid=p_id;
    if(p=='std'){
        client.query(`select student_passwd from student where student_id = '${p_id}'`, (err, res2) => {
            // console.log(res2);
            if(err) console.log(err.message);
            else if (res2.rowCount == 0){
                console.log("Student not registered");
                res.send("<h1>Student not registered</h1>");
            }
            else if(p_passwd==res2.rows[0].student_passwd){
                res.redirect('/studentHome');
            }
            else{
                console.log("Password Not Matched.");
                res.send("<h1>Password Not Matched.</h1>");
            }
        })
        
    }
    else if(p=='adm'){
        client.query(`select admin_passwd from admin where admin_id = '${p_id}'`, (err, res2) => {
            // console.log(res2);
            if (err) console.log(err.message);
            else if (res2.rowCount == 0) {
                console.log("Admin not found");
                res.send("<h1>Admin not found</h1>");
            }
            else if (p_passwd == res2.rows[0].admin_passwd) {
                res.redirect('/adminHome');
            }
            else {
                console.log("Password Not Matched.");
                res.send("<h1>Password Not Matched.</h1>");
            }
        })
    }
    else if(p=='wrd'){
        client.query(`select warden_passwd from warden where warden_id = '${p_id}'`, (err, res2) => {
            // console.log(res2);
            if (err) console.log(err.message);
            else if (res2.rowCount == 0) {
                console.log("warden not registered");
                res.send("<h1>warden not registered</h1>");
            }
            else if (p_passwd == res2.rows[0].warden_passwd) {
                res.redirect('/wardenHome');
            }
            else {
                console.log("Password Not Matched.");
                res.send("<h1>Password Not Matched.<h1>");
            }
        })
    }
    else{
        res.send("<h1>Please select a user</h1>");
    }
})



app.post("/register_student", function (req, res) {
    let s_id = req.body.stdid;
    let s_name = req.body.fname +' '+ req.body.lname;
    let s_gender = req.body.gender;
    let s_hostelid = req.body.hostelid;
    let s_contno = req.body.contno;
    let s_roomno = req.body.roomno;
    let s_passwd = req.body.passwd;
    let s_cpasswd = req.body.cpasswd;
    if(s_passwd==s_cpasswd){
        client.query(`insert into student values('${s_id}','${s_name}','${s_passwd}','${s_gender}','${s_contno}','${s_hostelid}','${s_roomno}')`,(err,res2)=>{
            if(err) console.log(err.message);
            else{
                console.log("Successfully added.");
                res.redirect("/");
            }
        });
    }
    
});


// warden
app.post('/register_warden',function(req,res1){
    
    var w_id = req.body.wardid;
    var w_first = req.body.fname;
    var w_last = req.body.lname;
    var w_name = w_first + w_last;
    var w_cont = req.body.warcont;
    var w_pass = req.body.passwd;
    var w_cpass = req.body.cpasswd;
    var w_hid = req.body.hid;
    var w_hname = req.body.hname;
    var w_hcont = req.body.hcont;


    if(w_cpass == w_pass){
        client.query(`insert into warden (warden_id,warden_name,warden_passwd,warden_cont) values('${w_id}' ,'${w_name}','${w_pass}','${w_cont}')`,function(err,res2){
            if(err){
                console.log(err.message);
            }
            else{
                console.log("inserted");
            }
        })
        client.query(`insert into hostel values('${w_hid}','${w_hname}','${w_hcont}','${w_id}')`,function(err,res3){
            if(err){
                console.log(err.message);
            }
            else{
                console.log("inserted into hostel");
                res1.redirect('/');
            }
        })
    }


})

app.post("/generate_complaint",function(req,res){
    let cat = req.body.cat;
    let title = req.body.title;
    let desc = req.body.desc;
    let hid;
    let rno;
    client.query(`select hostel_ref_id,room_no from student where student_id = '${globalid}'`,(err1,res1)=>{
        if(err1) console.log(err1.message);
        else{
            hid = res1.rows[0].hostel_ref_id;
            rno= res1.rows[0].room_no;
            client.query(`insert into complaints(category,description,student_ref_id,hostel_ref_id,status,title,room_no) values('${cat}','${desc}','${globalid}','${hid}','Pending','${title}',${rno})`, function (err2, res2) {
                if (err2) {
                    console.log(err2.message);
                }
                else {
                    console.log("inserted");
                    res.redirect("/studentHome");
                }
            })
        } 
    })
})

//view my complaints


// var myid = 'satvik12';
app.get('/view_my_complaints', function(req,res){
    client.query(`select * from complaints where student_ref_id = '${globalid}'`,function(err2,res2){
        if(err2){
            console.log(err2.message);
        }
        else{
            res.render("list", {arr:res2.rows});    
        }
    })
})


app.get('/view_complaints_warden',function(req,res){
    client.query(`select * from Complaints where auth='Warden' and hostel_ref_id = (select hostel_id from hostel where warden_ref_id = '${globalid}')`, function(err,res2){
        if(err){
            console.log(err.message);
            res.send(err.message);
        }
        else{
            res.render("viewWarden",{arr:res2.rows})
        }
    })
})
app.get('/view_complaints_admin',function(req,res){
    client.query(`select * from Complaints where auth='Admin'`, function(err,res2){
        if(err){
            console.log(err.message);
            res.send("<h1>" + err.message + "</h1>");
        }
        else{
            res.render("viewAdmin",{arr:res2.rows})
        }
    })
})

app.post('/view_complaints_warden',function(req,res){
    if(req.body.submit=='sort'){
        let cat = req.body.cat;
        let type = req.body.type;
        client.query(`select * from Complaints where auth='Warden' and hostel_ref_id = (select hostel_id from hostel where warden_ref_id = '${globalid}') ORDER BY ${cat} ${type}`, function (err, res2) {
            if (err) {
                console.log(err.message);
                res.send(err.message);
            }
            else {
                res.render("viewWarden", { arr: res2.rows })
            }
        })
    }
    else if(req.body.submit=='filter'){
        let cat = req.body.cat;
        client.query(`select * from Complaints where auth='Warden' and hostel_ref_id = (select hostel_id from hostel where warden_ref_id = '${globalid}' and category='${cat}')`, function (err, res2) {
            if (err) {
                console.log(err.message);
                res.send(err.message);
            }
            else {
                res.render("viewWarden", { arr: res2.rows })
            }
        })
    }
    else{
        var cid = req.body.submit;
        client.query(`update complaints set auth='Admin' where complaint_id = '${cid}'`,function(err,res2){
            if(err){
                console.log(err.message);
                res.send("<h1>" + err.message + "</h1>");
            }
            else{
                res.redirect('/view_complaints_warden');
            }
        })
    }
})

app.post("/view_my_complaints", function(req,res){
    let id = req.body.ack;
    client.query(`delete from complaints where complaint_id = '${id}'`, function(err,res2){
        if(err){
            res.send("<h1>"+err.message+"</h1>");
        }
        else{
            res.redirect("/view_my_complaints");
        }
    })
})
app.post("/view_complaints_warden2", function(req,res){
    id = req.body.submit;
    st = req.body.status;

    client.query(`update complaints set status = '${st}' where complaint_id = '${id}'`, function(err,res2){
        if(err){
            res.send("<h1>"+err.message+"</h1>");
        }
        else{
            res.redirect("/view_complaints_warden");
        }
    })
})

app.listen(3000, function () {
    console.log('server running on port 3000')
});