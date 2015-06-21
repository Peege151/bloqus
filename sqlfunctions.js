var sqlite3 = require('sqlite3').verbose();

var sqlFunctions = {
    createUser:  function (newUser, cb) {
        var db = new sqlite3.Database('database.db');

        db.serialize(function () {

            var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?,?,?)");

            stmt.run(newUser.id, newUser.first, newUser.last, newUser.email, newUser.password);

            stmt.finalize();
            db.close();
            cb(newUser);
        })
    },

    checkUserLogin: function (loginInfo, cb) {
        var db = new sqlite3.Database('database.db');
        db.run("CREATE TABLE if not exists user_info (id TEXT, first TEXT, last TEXT, email TEXT, password TEXT)");

        var email = loginInfo.email,
            password = loginInfo.password,
            stmt = "SELECT id, first, last, email, password FROM user_info WHERE email='" +  email + "'",
            user;

        db.all(stmt, function (err, row) {
            console.log('sql row', row)
            console.log('login error', err)
            if (err) cb(err);
            else if (!row[0] || row[0].password !== password) cb(user);
            else {
                user = {
                    id: row[0].id,
                    first: row[0].first,
                    last: row[0].last,
                    email: row[0].email
                };

                db.close();
                cb(user);
            }
        });
    },

    saveStats: function (statsObj, cb) {
        var db = new sqlite3.Database('database.db');
        db.run("CREATE TABLE if not exists user_stats (email TEXT, color TEXT, score TEXT, wins TEXT, losses TEXT)");

        var email = statsObj.email,
            userStmt = "SELECT color, score, wins, losses FROM user_stats WHERE email='" +  email + "'",
            stats;

        db.all(userStmt, function (err, row) {
            console.log('get stats  row', row)
            console.log('get stats error', err)
            if (err) cb(err);
            stats = row;
            db.close();
            cb(stats);

        });

            db.serialize(function () {

                var stmt = db.prepare("INSERT INTO user_stats VALUES (?,?,?,?,?)");

                stmt.run(statsObj.email, statsObj.color, statsObj.score, statsObj.wins, statsObj.losses);

                stmt.finalize();
                db.close();
                cb(statsObj);
        })
    },

    getStats: function (email, cb) {
        var db = new sqlite3.Database('database.db');
        console.log('email!?', email)
        var email = email.email,
            stmt = "SELECT color, score, wins, losses FROM user_stats WHERE email='" +  email + "'",
            stats;

        db.all(stmt, function (err, row) {
            console.log('get stats  row', row)
            console.log('get stats error', err)
            if (err) cb(err);
            stats = row;
            db.close();
            cb(stats);

        });
    }
};


module.exports = sqlFunctions;