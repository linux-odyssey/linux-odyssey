import csrf from 'csurf'

const CSRF = csrf({ cookie: true })
function csrfProtection(req, res, next) {
  if (req.method === 'POST') {
    CSRF(req, res, next)
  } else {
    next()
  }
}

export default csrfProtection
