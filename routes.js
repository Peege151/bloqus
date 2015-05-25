module.exports = function(app) {

  app.route('/lobby/*')
      .get(function(req, res) {
        res.sendfile('/index.html');
      });

  app.route('/*')
    .get(function(req, res) {
      res.sendfile('/index.html', {root: __dirname});
    });
};