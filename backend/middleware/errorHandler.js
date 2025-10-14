// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        ...err
    };
    error.message = err.message;

    // Log error
    console.error(err);

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export default errorHandler;