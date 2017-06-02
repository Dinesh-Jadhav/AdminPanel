    var express = require('express');
    var app = express(),
    mailer = require('express-mailer');; // create our app w/ express
    var path = require('path');
    var router = express.Router();
    var mongoose = require('mongodb');
    var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var crypto = require('crypto');
    var session = require('express-session');
    var formidable = require("formidable");
    var fs = require('fs-extra');
    var randomstring = require("randomstring");
    var Q = require('q');
    var step = require('step');
    var slug = require('slug');
    var moment = require("moment");
    var async = require('async');
    /*var db = require('./config/db');*/
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    app.use(bodyParser.json());
    app.set('views', path.join(__dirname, 'public'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
    app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));
/*    var pool = mongoose.connect(db.localUrl).then(() =>  console.log('connection succesful')).catch((err) => console.error(err));
*/
    mongoose.connect('mongodb://sentient:12345@ds133251.mlab.com:33251/sentient', function(err,database) {
  //  mongoose.connect('mongodb://sentient:12345@ds063186.mlab.com:63186/sentient', function(err,database) {
    if(err) {
        console.error(err);
     }
    db = database; // once connected, assign the connection to the global variable
    });

mailer.extend(app, {
  from: 'suyog.talekar@deltabee.com',
  host: '204.11.58.28', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'suyog.talekar@deltabee.com',
    pass: 'live85412'
  }
});

     app.post('/login',function(req,res){
     sess=req.session;
     var username= req.body.userName;
     var password = req.body.password;
     var result = {};
     var resultArray = [];

     if((username!=null) &&(password!=null)){
         var cursor =db.collection('admin').find({"email":username,"password":password});
         cursor.forEach(function(doc, err) {
         assert.equal(null, err);
         result=doc;
     }, function() {
            if ((result==null)||(Object.keys(result).length === 0)){
             console.log("no user found");
             result.error="Please Try Again";
             res.send(JSON.stringify(result));
             return;
            }
            else {
                sess.userID = result["_id"];
                sess.userPrivilege = 1;
                sess.userLevel = "admin";
                result.success = result;
                result.success = "admin login successfully";
                res.send(JSON.stringify(result));
                return;
                    }
            });
        }
    });


app.get('/view_user_profile',function(req,res){
console.log("view_user_profile");
    var userLevel = req.params.access;
    sess=req.session;
});

app.get('/authentication/:access',function(req,res){
    var userLevel = req.params.access;
    sess=req.session;
    var result = {};
    if(typeof sess.userID !=='undefined' && sess.userID!='' && sess.userLevel==userLevel){
      result.status = 'success';
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    }else{
      result.status = 'fail';
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
  }
});

     app.post('/userlogin',function(req,res){
     console.log("in userlogin api")
     sess=req.session;
     var username= req.body.username;
     var password = req.body.password;
     var result = {};
     var resultArray = [];

     if((username!=null) &&(password!=null)){
         var cursor =db.collection('users').find({"email":username,"password":password});
         cursor.forEach(function(doc, err) {
         assert.equal(null, err);
         result=doc;
     }, function() {
            if ((result==null)||(Object.keys(result).length === 0)){
             console.log("no user found");
             result.error="Please Try Again";
             res.send(JSON.stringify(result));
             return;
            }
            else {
                sess.userID = result["_id"];
                sess.userPrivilege = 1;
                sess.userLevel = "user";
                result.status = 'success';
                result.success = result;
                result.success = "user login successful";
                res.send(JSON.stringify(result));
                return;
                    }
            });
        }
    });

 app.post('/add_user', function(req, res, next) {
 console.log(JSON.stringify(req.body));
    console.log(req.body.user.name)
    var name = req.body.user.name;
    var username = req.body.user.username;
    var password = req.body.user.password;
    var email= req.body.user.email;
    var team = req.body.user.team;
    var postalcode = req.body.user.postalcode;
    if(team == null){
      team = "";
    }
    var address=req.body.user.address;
    var city=req.body.user.city;
    var country=req.body.user.country;
    var teamc = req.body.user.teamc;
    var indivisualc = req.body.user.indivisualc
    if(teamc ==null){
      teamc=2;
    }if(indivisualc!=null){
      teamc=1;
    }


    var result = {};
    var resultArray = [];

      if((email!="")){
         var cursor =db.collection('users').find({"email":email});
         cursor.forEach(function(doc, err) {
           assert.equal(null, err);
           result=doc;
           // console.log("Result is ");
           // console.log(doc);
     }, function() {
            if (Object.keys(result).length > 0){
                result.error="user already exist";
                res.send(JSON.stringify({"error":result.error}));
            }else{
              console.log("user not exists");
               if((team!="")){
                   var cursor =db.collection('teams').find({"team_name":team});
                   cursor.forEach(function(doc, err) {
                   assert.equal(null, err);
                   result=doc;
               }, function() {
                      if (Object.keys(result).length === 0){
                       result.error="Team not exists";
                       res.send(JSON.stringify(result));
                      }else {
                        
                                console.log("team found");
                                db.collection('users').insertOne({"name" : name, "email" : email, "password" : password, "team" : team,"address" : address,"city":city,"country" : country,"teamc" : teamc,"postalcode":postalcode }
                                , function(err, result) {
                                console.log("user created successfully")
                                assert.equal(null, err);
                                result.status = 'success';
                                result.success = result;
                                result.success = "user created successfully";
                                res.send(JSON.stringify(result));
                              });
                          }
                      }
                    );
                  }
                  else {
                    console.log("here2");
                      db.collection('users').insertOne({"name" : name, "email" : email, "password" : password, "team" : team,"address" : address,"city":city,"country" : country,"teamc" : teamc,"postalcode":postalcode}
                      ,function(err, result) {
                      console.log("creating user");
                      assert.equal(null, err);
                      result.status = 'success';
                      result.success = result;
                      result.success = "user created successfully";
                      console.log("user created successfully");
                      res.send(JSON.stringify(result));
                    }
                    );
                }
              }
            }
          );
        }
return;
});

 app.post('/reset_pswd/:_id', function(req, res, next) {
  console.log(req.body.password);
  console.log(req.params._id);
    var password = req.body.password;
    var _id = req.params._id;

    var result = {};
    var resultArray = [];
    var executeQuery=-1;

     if((_id!="")){
         var cursor =db.collection('users').find({"_id":ObjectId(_id)});
         cursor.forEach(function(doc, err) {
         assert.equal(null, err);
         result=doc;
     }, function() {
            if (Object.keys(result).length === 0){
             result.error="user not found";
             executeQuery=0;
             res.send(JSON.stringify(result));
            }else {console.log("user found");
        db.collection('users').update({_id: ObjectId(_id)},{$set:{password : password}} ,function(err, result) {
          assert.equal(null, err);
          console.log('user updated');
          result.status = 'success';
          result.success = result;
          result.success = "user password updated successfully";
          res.send(JSON.stringify(result));
          });
        }
      }
          );
        }
  return;

});

//var url = req.protocol + '://' + req.get('host') + req.originalUrl;
app.post('/forgot_password',function(req,res){
console.log("in forgot password api")
var username= req.body.username;
var result = {};
var resultArray = [];
 if(username!=null){
    console.log("Reseting password");
    var cursor =db.collection('users').find({"email":username});
    cursor.forEach(function(doc, err) {
    assert.equal(null, err);
    console.log(doc);
    result=doc;
 }, function() {
        if ((result==null)||(Object.keys(result).length === 0)){
         console.log("no user found");
         result.error="Please Try Again";
         res.send(JSON.stringify(result));
         return;
        }
        else {
            console.log("user found");
            result.success = result;
            result.success = "user found";
            var _id = result._id;
            var url = req.protocol + '://' + req.get('host') + '/#/reset_password/' + _id;
            result.status = 'success';
            var email_body= 'Please follow the link to reset your password for sentient \n '+url;
            console.log(email_body);
app.mailer.send('email', {
    to: username, // REQUIRED. This can be a comma delimited stringifyg just like a normal email to field.  
    subject: 'Password Reset Link for Sentient', // REQUIRED.
    body: email_body, 
    // otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.header('Content-Type', 'text/plain');
    res.send(email_body);
    // res.send({body: email_body});
  });




            // res.send(JSON.stringify({link:url}));
            return;
           }
        });
    }
});

 app.post('/createTeam', function(req, res, next) {
          var team_name = req.body.team_name;
          var owner_id = req.body.owner_id;
          var active = 1;
          var result = {};

     if((team_name!="")){
         var cursor =db.collection('teams').find({"team_name":team_name});
         cursor.forEach(function(doc, err) {
           assert.equal(null, err);
           result=doc;
     }, function() {
            if (Object.keys(result).length > 0){
                result.error="team already exist";
                res.send(JSON.stringify({"error":result.error}));
            }else{
              console.log("team not exists");
              db.collection('teams').insertOne({ "team_name":team_name, "owner_id":owner_id, "active":active}, function(err, result) {
              assert.equal(null, err);
              result.status = 'success';
              result.success = result;
              result.success = "team created successfully";
              res.send(JSON.stringify(result));
            });
          }
        }
      );
    }
          return;
 });

app.get('/team_list', function(req, res, next) {
  var resultArray = [];
  var result = {};
    var cursor = db.collection('teams').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      result =  (resultArray);
      res.send( result);
    });
});

app.post('/team_delete', function(req, res, next) {
    console.log(req.body._id);
    var _id = req.body._id;
    var result = {};

     if((_id!="")){
         var cursor =db.collection('teams').find({"_id": ObjectId(_id)});
         cursor.forEach(function(doc, err) {
         assert.equal(null, err);
         result=doc;
     }, function() {
            if (Object.keys(result).length === 0){
             result.error="Team not exists";
             executeQuery=0;
             res.send(JSON.stringify(result));
            }else {
                console.log("team found");
                console.log(Object.keys(result).length);
                db.collection('teams').deleteOne({_id: ObjectId(_id)}, function(err, result) {
                assert.equal(null, err);
                console.log('team deleted');
                result.status = 'success';
                result.success = result;
                result.success = "team deleted successfully";
                res.send(JSON.stringify(result));
                return;
        });
              }
            }
          );
        }


});

 app.post('/addToTeam', function(req, res, next) {
    var team_id = req.body.team_id;
    var user_id = req.body.user_id;
    var flag = 1;

    var result = {};
    var result1 = {};

     if((team_id!="")){
         var cursor =db.collection('teams').find({"_id": ObjectId(team_id)});
         cursor.forEach(function(doc, err) {
         assert.equal(null, err);
         result=doc;
     }, function() {
            if (Object.keys(result).length === 0){
             result.error="Team not exists";
             res.send(JSON.stringify(result));
            }else {
                console.log("team found");
                if((user_id!="")){
                     var cursor1 = db.collection('userteams').find({"team_id":ObjectId(team_id),"user_id":ObjectId(user_id)});
                     cursor.forEach(function(doc1, err) {
                     assert.equal(null, err);
                     result1=doc1;
                 }, function() {
                        if (Object.keys(result1).length > 0){
                          result1.error="Team and user combination already exists";
                          res.send(JSON.stringify(result1));
                        }
                        else {
                                console.log("team found");
                                db.collection('userteams').insertOne({"flag":flag, "team_id":ObjectId(team_id),"user_id":ObjectId(user_id)}, function(err, result) {
                                assert.equal(null, err);
                                console.log('user added to team');
                                result.status = 'success';
                                result.success = result;
                                result.success = "user added to team successfully";
                                res.send(JSON.stringify(result));
                                return;
        });
                }
            }
          );
        }

              }
            }
          );
        }

 });

 app.post('/joinTeam', function(req, res, next) {
    var item = {
        team_id: req.body.team_id,
        user_id: req.body.user_id,
        flag:0
        };
      if (item!=null){
        db.collection('userteams').insertOne(item, function(err, result) {
          assert.equal(null, err);
          console.log('user added to team');
          return;
        });
    }
 });

app.get('/ticker_list', function(req, res, next) {
  var resultArray = [];
  var result = {};
    var cursor = db.collection('ticker_list').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      result =  (resultArray);
      res.send( result);
    });
});

 app.post('/addTicker', function(req, res, next) {
    var item = {
        ticker_name: req.body.ticker_name
        };
      if (item!=null){
        db.collection('ticker_list').insertOne(item, function(err, result) {
          assert.equal(null, err);
          console.log('ticker inserted');
          return;
        });
    }

 });


app.post('/ticker_delete', function(req, res, next) {
    console.log(req.body._id);
    var _id = req.body._id;
        db.collection('ticker_list').deleteOne({_id: ObjectId(_id)}, function(err, result) {
          assert.equal(null, err);
          console.log('Item deleted');
          return;
        });
});

 app.post('/add_competition', function(req, res, next) {
    var result = {};
    var item = {
        competition_name : req.body.comp_data.name, start_date : req.body.comp_data.start_date, end_date : req.body.comp_data.end_date,
        description : req.body.comp_data.description, dataset: req.body.comp_data.dataset,
        price : req.body.comp_data.price, file_name : "", file_location : "", isEnabled : "1"
    }
        if (item!=null){
        db.collection('competitions').insertOne(item, function(err, result) {
          if(assert.equal(null, err)){
            console.log(err);
          }else{
            result.success=item;
            res.send(JSON.stringify(result))
            console.log('competition inserted');
          return;
          }

          
        });
      }

 });


app.get('/competitions', function(req, res, next) {
  var resultArray = [];
  var result = {};
    var cursor = db.collection('competitions').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      result =  (resultArray);
      res.send( result);
    });
});


app.post('/add_blog', function(req, res, next) {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted_dt = dt.format('Y-m-d H:M:S');
    console.log(formatted_dt);
    console.log("add_blog");
    console.log(req.body.blog_name);
    console.log(req.body.blog_details);

    var item = {
              title : req.body.blog_name, body: req.body.blog_details,
              date : formatted_dt, userId : ""

    }
      if (item!=null){
        db.collection('blogs').insertOne(item, function(err, result) {
          assert.equal(null, err);
          console.log('blog inserted');
          return;
        });
      }
 });

app.get('/blog_list', function(req, res, next) {
  var resultArray = [];
  var result = {};
    var cursor = db.collection('blogs').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      result =  (resultArray);
      res.send( result);
    });
});

app.post('/blog_delete', function(req, res, next) {
    console.log(req.body._id);
    var _id = req.body._id;
        db.collection('blogs').deleteOne({_id: ObjectId(_id)}, function(err, result) {
          assert.equal(null, err);
          console.log('Blog deleted');
          return;
        });
});

    app.get('/logout',function(req,res){
        var result = {};
        sess = req.session;
        sess.userID ='' ;
        sess.userPrivilege = 0;
        sess.userLevel = '';
        result.success = 'Logged out successfully';
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });

    app.use(router);
    app.listen(process.env.PORT || 2001);
    console.log("App listening on port 2001");
