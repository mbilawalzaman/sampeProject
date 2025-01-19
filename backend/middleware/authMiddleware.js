// authMiddleware.js
export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized, please log in." });
  }
  next(); // Proceed to the next route handler if user is authenticated
};
