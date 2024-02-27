import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  jwt.verify(access_token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user
    next();
  });
};
