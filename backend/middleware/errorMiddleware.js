const notFound = (req, res, next) => {
    const error = new Error('Resource not found');
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = `Resource not found`;
        statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map((val) => val.message).join(', ');
        statusCode = 400;
    }

    if (process.env.NODE_ENV === 'production' && statusCode >= 500) message = 'The request could not be completed. Please retry.';
    res.status(statusCode);
    res.json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
