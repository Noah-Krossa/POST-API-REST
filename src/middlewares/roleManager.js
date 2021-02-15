/**
 * This middleware allow us config dababase permissons,
 * as default has client permissions
 */
const roleManager = (role = 'client') => {
  return function (req, res, next) {
    req.role = role
    return next()
  }
}
module.exports = roleManager
