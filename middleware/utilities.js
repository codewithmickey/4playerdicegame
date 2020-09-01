module.exports.deverrorstack = function (err, req, res, next){
	res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
	next();
};

module.exports.proderrorstack = function (err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
	next();
};

module.exports.setHeaders = function(req, res, next) {
  res.setHeader('cache-control','no-cache');
  next();
}

