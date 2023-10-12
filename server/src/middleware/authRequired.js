export default function authRequired(req, res, next) {
  if (req.isAuthenticated() && !req.session.newUser) {
    next()
    return
  }
  res.status(401).json({
    message: 'not authenticated',
  })
}
