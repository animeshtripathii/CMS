// roles.middleware.js
// Middleware to authorize user roles

export function aurthorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have the required role(s)"
      });
    }
    next();
  };
}
