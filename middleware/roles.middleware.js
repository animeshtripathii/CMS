// Role Authorization ke liye Middleware
// Check karta hai ki user ke paas permitted roles mein se ek hai ya nahi

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
