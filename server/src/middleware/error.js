export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  console.error(err.stack) // Log error stack trace to the console
  res.status(500).send({ message: 'Something broke!' }) // Send error response
}
