exports.notFound = function notFound(req, res, next) {
  res.status(404).send('You seem lost. ');
};

exports.error = function error(err, req, res, next) {
  console.log(err);

  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ message: err });
  }


  res.status(500).send('Something broke.');
};


//   //module.exports = errorHandler;

//   exports.errorHandler = function(err, req, res, next) {
//     if (typeof (err) === 'string') {
//         // custom application error
//         return res.status(400).json({ message: err });
//     }

//     if (err.name === 'ValidationError') {
//         // mongoose validation error
//         return res.status(400).json({ message: err.message });
//     }

//     if (err.name === 'UnauthorizedError') {
//         // jwt authentication error
//         return res.status(401).json({ message: 'Invalid Token' });
//     }

//     // default to 500 server error
//     return res.status(500).json({ message: err.message });
// }