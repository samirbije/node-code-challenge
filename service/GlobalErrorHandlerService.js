const ERROR_MESSAGE = "API ERROR!!"

/*
  Function to handles api response for errors
  that bubble up to top layer of the application.
  Returns a proper formated error response on expected or
  unexpected errors
 */
const errorHandler = (err, req, res, next) => {
  // console.log("error middleware reached")
  let msg = ERROR_MESSAGE;
  let status = 500;
  if (err.status){
    status = err.status;
  }
  if (err.message){
    msg = err.message;
  }

  let data = {
    "status":"ERROR",
    "message":[msg]
  }
  console.log(err.stack);
  res.status(status).send(data);
}

/* 
 Helper method to catch error for routes using async calls.
 Next is applied after catching the asyncronous error
*/
const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}


module.exports = {
  errorHandler,
  wrapAsync
}