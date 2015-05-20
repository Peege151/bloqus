var express = require('express');
var router = require('express').Router();

var port = process.env.PORT || 3000;
var app = express();


app.get("/", function(req, res, next){
	console.log("In route")
	res.sendFile(__dirname + "/index.html")
})
app.listen(port);