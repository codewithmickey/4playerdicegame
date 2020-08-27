exports.notFound = function notFound(req, res, next){
    res.status(404).send('You seem lost. ');
  };

  exports.error = function error(err, req, res, next){
    console.log(err);
    res.status(500).send('Something broke.');
  };