var express = require('express'); // Builds express app (set of tools)
var http = require('http'); // To use http req & res
var path = require('path'); // To use path.join, etc.
var lib = require('./db.js'); // queries to db

var mysql = require('mysql');

// Creating connection to mysql server & db
var connection = mysql.createConnection({
    host    :'us-cdbr-iron-east-01.cleardb.net',
    user    :'b9c02ba6cf3ec9',
    password:'25c3e4cc',
    database:'heroku_7d08f208a1d0c14'
});

// Executes connection:
connection.connect(function(err) {
	if(err) return console.log(err);
	lib.setupDBAndTable(connection);
})

var app = express(); // Creates express app, executes it.

var bodyParser = require('body-parser'); // To parse post data thru req.body

app.use(bodyParser.urlencoded()); // Post data, get res in url (it has get req, but also has data encoded)
app.use(bodyParser.json()); // Handles json data

var methodOverride = require('method-override'); // To use put, patch, delete (http verbs)
app.use(methodOverride('X-HTTP-Method-Override'));

app.set('port', process.env.PORT || 1234);


app.post('/create_user', function (req,res){
    var user = {name:req.body.name};
    lib.createUser(user, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    });
});

app.post('/user_json', function (req,res){
    var userid = {id:req.body.id};
    lib.showUser(userid, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    });
});

app.post('/create_question', function (req,res){
    var question = {question:req.body.question, description:req.body.description, users_id:req.body.userinfo.idusers};
    lib.createQuestion(question, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    });
});

app.get('/question_json', function (req,res){
    lib.showQuestions(connection, function (err,questions){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(questions);
        }
    });
});

app.post('/create_answer', function (req,res){
    var answer = {answer:req.body.answer, questions_idquestions:req.body.questionid.id, users_idusers:req.body.userinfo.idusers};
    lib.createAnswer(answer, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(answer);
            lib.commentCounter(answer, connection); 
        }
    })
})

app.post('/show_answer', function (req,res){
    var questionid = {questions_id:req.body.id};
    lib.showAnswers(questionid, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    });
});

app.post('/create_like', function (req,res){
    var answerid = {id:req.body.id};
    lib.updateLike(answerid, connection, function (err, info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    })
})

app.post('/show_question', function (req,res){
    var questionid = {idquestions:req.body.id};
    lib.showTheQuestion(questionid, connection, function (err,info){
        if(err){
            return res.json({"error":"something went wrong" + err});
        }
        else{
            res.json(info);
        }
    });
});

app.use(express.static(path.join(__dirname))); // Points to directory that has whole angular app (static files) called public, sets up static file server that points to public directory. All in public folder, so pointing to public


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});