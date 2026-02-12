// Role Authorization Middleware
// Checks if the user has one of the permitted roles

export function authorizeRoles(...allowedRoles) { 
  return (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userRole = req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have the required role(s)"
      });
    }

    next();
  };
}
