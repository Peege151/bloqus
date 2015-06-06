var router = require('express').Router();
var sqlite3 = require('sqlite3').verbose();

router.post('/user', function (req, res, next) {
    var db = new sqlite3.Database('test.db');
    var newUser;

    db.serialize(function () {

        db.run("CREATE TABLE if not exists user_info (id TEXT, first TEXT, last TEXT, email TEXT, password TEXT)");

        var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?,?,?)");
        newUser = {
            id: Math.floor((Math.random() + 1) * 100000),
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            password: req.body.password
        };

        stmt.run(newUser.id, newUser.first, newUser.last, newUser.email, newUser.password);

        stmt.finalize();
        req.session.user = newUser;
        res.send(newUser);
        db.close();
    });
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
    var db = new sqlite3.Database('test.db');
    var user,
        email = req.body.email,
        password = req.body.password,
        stmt = "SELECT id, first, last, email, password FROM user_info WHERE email='" +  email + "'";

    db.all(stmt, function (err, row) {
        if (err) return next(err);
        else if (!row[0] || row[0].password !== password) res.send(401);
        else {
            user = {
                id: row[0].id,
                first: row[0].first,
                last: row[0].last,
                email: row[0].email
            };
            req.session.user = user;

            res.send(user);
        }

    });

    db.close();

});


module.exports = router;

