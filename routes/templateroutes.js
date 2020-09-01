var express = require('express');
var router = express.Router();

function renderHomePage(req, res) {

    var user = req.session.user;

    req.session.regenerate(function (err) {
        req.session.user = user;
        console.log('req.session.user ' + req.session.user);
        res.render('index', { title:'Express', user:req.session.user,roomid:""});
    });
}


function renderJoinPage(req, res) {

    var user = req.session.user;
    var roomid = req.session.roomid;
    console.log(user,"asdasdasd")
    req.session.regenerate(function (err) {
        req.session.user = user;
        req.session.roomid = roomid;
        console.log('req.session.roomid ' + req.session.roomid);
        res.render('index', { title:'Express', user:req.session.user, roomid:req.session.roomid});
    });
}
router.get('/', renderHomePage);

router.get('/join/:id', function (req, res) {
    //req.session.user = req.body.user;
    req.session.roomid = req.params.id
    renderJoinPage(req, res);
});


router.post('/user', function (req, res) {
    req.session.user = req.body.user;
   	renderHomePage(req, res);
});

router.get('/logout', function(req, res) {
    console.log('w23e45r6t7y8 ',req.session.user)
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;