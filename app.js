var express = require('express');
var router = require('express').Router();
var path = require('path');

var port = process.env.PORT || 3000;
var app = express();

var root = __dirname;
var bower = "../" + __dirname;

app.use(express.static(__dirname + "/bower_components"));
app.use(express.static(bower + "/bower_components"));

app.use(express.static(__dirname + "/app"));
app.use(express.static(__dirname));


app.get("/*", function(req, res, next){
	res.sendFile("/app/index.html", {root: __dirname});
});

//app.get("/lobby/*", function(req, res, next){
//	res.sendFile(__dirname + "/app/index.html");
//});

app.listen(port);