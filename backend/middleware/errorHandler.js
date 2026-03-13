/**
 * Creates a structured API error object.
 */
function createError(statusCode, message, details = null) {
  const err = new Error(message)
  err.statusCode = statusCode
  if (details) err.details = details
  return err
}

/**
 * Global Express error handler. Must be registered last.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log server errors
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err)
  }

  const response = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.details && { details: err.details }),
  }

  res.status(statusCode).json(response)
}

module.exports = { errorHandler, createError }
