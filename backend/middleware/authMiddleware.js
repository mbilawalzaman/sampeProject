// authMiddleware.js

export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized, please log in." });
  }
  next(); // Proceed to the next middleware if authenticated
};

export const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next(); // Proceed to the next middleware if the user is an admin
};
