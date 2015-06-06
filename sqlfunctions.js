var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

var sqlFunctions = {
    createUser:  function (newUser) {
        db.serialize(function () {

            db.run("CREATE TABLE if not exists user_info (id TEXT, first TEXT, last TEXT, email TEXT, password TEXT)");

            var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?,?,?)");

            stmt.run(newUser.id, newUser.first, newUser.last, newUser.email, newUser.password);

            stmt.finalize();
            db.close();
            return newUser;
        })
    }

};

module.exports = sqlFunctions;