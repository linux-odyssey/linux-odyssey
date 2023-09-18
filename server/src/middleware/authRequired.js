export default function authRequired(req, res, next) {
  if (req.isAuthenticated()) {
    next()
    return
  }
  res.status(401).json({
    message: 'not authenticated',
  })
}
