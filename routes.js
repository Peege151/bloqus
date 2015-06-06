var router = require('express').Router();
var sqlite3 = require('sqlite3').verbose();
var Promise = require("bluebird");
var sqlFunctions = Promise.promisifyAll(require('./sqlfunctions'));

router.post('/user', function (req, res, next) {

    var newUser = {
        id: Math.floor((Math.random() + 1) * 100000),
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        password: req.body.password
    };

    sqlFunctions.createUser(newUser);

    req.session.user = newUser;
    res.send(newUser);

});

router.get('/user', function (req, res, next) {
    console.log('Req Session', req.session)
    res.send(req.session)
});

router.delete('/login', function (req, res, next){
    req.session.destroy(function (err) {
        if (err) next(err);
        res.send(200);
    })
});

router.post('/login', function (req, res, next) {

    sqlFunctions.checkUserLogin(req.body, function (user){
        console.log('user login', user)
        if (!user) res.send(401);
        else {
            req.session.user = user;
            res.send(user);
        }
    });

});


module.exports = router;

