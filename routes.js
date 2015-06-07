var router = require('express').Router();
var sqlFunctions = require('./sqlfunctions');

router.post('/user', function (req, res, next) {

    sqlFunctions.checkUserLogin(req.body, function (user) {
        console.log('user login', user)
        if (user) res.send(400);
        else {
            var newUser = {
                id: Math.floor((Math.random() + 1) * 100000),
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                password: req.body.password
            };

            sqlFunctions.createUser(newUser, function () {
                req.session.user = newUser;
                res.send(newUser);

            });
        }
    });

});

router.get('/user', function (req, res, next) {
    console.log('Req Session', req.session)
    res.send(req.session)
});

router.delete('/login', function (req, res, next) {
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

router.post('/stats', function (req, res, next) {

    sqlFunctions.saveStats(req.body, function (data){
        console.log('stats saved in backend routes.', data)
        res.send(data);
    })

});


module.exports = router;

