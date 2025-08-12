/**
 * Middleware to protect routes that require authentication.
 * It checks if a user is authenticated using Passport's req.isAuthenticated() method.
 */
export const protect = (req, res, next) => {
  // Passport adds the isAuthenticated() method to the request object after login.
  // If the user is authenticated, the request is allowed to proceed to the next middleware or route handler.
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not authenticated, send a 401 Unauthorized response.
  res.status(401).json({ message: 'Not authorized, please log in to continue.' });
};
