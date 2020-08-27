var express = require('express');
var router = express.Router();

function renderHomePage(req, res) {

    var user = req.session.user;

    req.session.regenerate(function (err) {
        req.session.user = user;
        console.log('req.session.user ' + req.session.user);
        res.render('index', { title:'Express', user:req.session.user});
    });
}

router.get('/', renderHomePage);

router.post('/user', function (req, res) {
    req.session.user = req.body.user;
   	renderHomePage(req, res);
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;