var express = require('express');
var router = require('express').Router();
var path = require('path');

var port = process.env.PORT || 3000;
var app = express();

var root = __dirname
var bowerPath = path.join(root, './bower_components/*');
var stylePath = path.join(root, './styles/*');
var browserPath = path.join(root, './browser/*');
var scripts = path.join(root, './scripts/*');

console.log("bowerPath: ", bowerPath)
app.use(express.static('bower_components'));
app.use(express.static('views'));
app.use(express.static('scripts'));
app.use(express.static('styles'));



app.get("/", function(req, res, next){
	console.log("In route")
	res.sendFile(__dirname + "/index.html")
})
app.listen(port);