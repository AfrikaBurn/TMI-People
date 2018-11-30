module.exports = function(logger) {

    return function(error, req, res, next) {

        if (error) {
            if (error instanceof SyntaxError) {
                res.status(400).json({
                    error: {
                        message: 'Invalid Json Body',
                        code: 'invalid_json'
                    }
                });
                return;
            } else {

                if (logger) {
                    logger.error(error);
                }

                res.status(500).json({
                    error: {
                        message: 'Server Error',
                        code: 'server_error'
                    }
                });

                return;
            }
        }

        next();
    };

};
