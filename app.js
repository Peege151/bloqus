var express = require('express'),
	router = require('express').Router(),
	path = require('path'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	session = require('express-session'),
	app = express();

var port = process.env.PORT || 3000;
var root = __dirname;
var bower = "../" + __dirname;

app.use(logger('dev'));

app.use(express.static(__dirname + "/bower_components"));
app.use(express.static(bower + "/bower_components"));

app.use(express.static(__dirname + "/app"));
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'sweetbloqparty'
	//cookie: {
	//        secure: true
	//}
}));

app.use("/api", require('./routes'));

app.get("/", function(req, res, next){
	console.log("In route");
	res.sendFile(__dirname + "/app/index.html")
});

//app.use(function (err, req, res, next) {
//	err.status = err.status || 500;
//	res.status(err.status).render('error', {
//		error: err
//	});
//});

app.listen(port);