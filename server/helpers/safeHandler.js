
/* utilize this function as a passthrough for async express
callbacks to catch any unhandled errors so server won't hang */
export default (cb) => {
  return function(req, res) {
    cb(req, res).catch(err => res.status(500).send(err.message));
  };
};
