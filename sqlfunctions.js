var sqlite3 = require('sqlite3').verbose();

var sqlFunctions = {
    createUser:  function (newUser) {
        var db = new sqlite3.Database('test.db');
        db.serialize(function () {

            db.run("CREATE TABLE if not exists user_info (id TEXT, first TEXT, last TEXT, email TEXT, password TEXT)");

            var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?,?,?)");

            stmt.run(newUser.id, newUser.first, newUser.last, newUser.email, newUser.password);

            stmt.finalize();
            db.close();
            return newUser;
        })
    },

    checkUserLogin: function (loginInfo, cb) {
        var db = new sqlite3.Database('test.db'),
            email = loginInfo.email,
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
    }
};

module.exports = sqlFunctions;