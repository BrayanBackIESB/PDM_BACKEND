import { verifyToken } from "../lib/jwt.js";

/**
 * Middleware de autenticação por Bearer token (JWT).
 *
 * Lê o header `Authorization: Bearer <token>`, valida o JWT e injeta
 * `req.userId` para os handlers seguintes. Sem token válido devolve 401.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token de autenticação ausente" });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
