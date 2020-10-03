function defaultErrorMiddleware (err, req, res, next) {
    res.status(500).json({ error: err });
}

module.exports = defaultErrorMiddleware;