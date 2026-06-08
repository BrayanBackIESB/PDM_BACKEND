import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

/**
 * Gera um token JWT assinado para o usuário informado.
 *
 * @param {{ id: string, email: string }} user
 * @returns {string} token assinado
 */
export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Valida e decodifica um token JWT.
 *
 * @param {string} token
 * @returns {import("jsonwebtoken").JwtPayload}
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
