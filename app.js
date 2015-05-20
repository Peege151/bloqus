var express = require('express');
var router = require('express').Router();
var path = require('path');

var port = process.env.PORT || 3000;
var app = express();

var root = __dirname
var bower = "../" + __dirname



app.use(express.static(__dirname + "/bower_components"));
app.use(express.static(bower + "/bower_components"));

app.use(express.static(__dirname + "/app"));
app.use(express.static(__dirname));

console.log("Most of the stuff: ", __dirname + "/app")
console.log("Bower stuff:", __dirname + "/bower_components" )
console.log("Bower stuff:", __dirname + "../bower_components" )
console.log("__dirname", __dirname)


app.get("/", function(req, res, next){
	console.log("In route")
	res.sendFile(__dirname + "/app/index.html")
})
app.listen(port);