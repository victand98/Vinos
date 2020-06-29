var exports = module.exports = {};

exports.signup = function (req, res) {
    res.render('signup', {titulo: 'Registro'});
};

exports.signin = function (req, res) {
    res.render('signin', {titulo: 'Inicio de Sesión'});
};

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
};