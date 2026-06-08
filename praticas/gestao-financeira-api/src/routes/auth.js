import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { authMiddleware } from "../middlewares/auth.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

const router = Router();

/**
 * Remove o hash de senha antes de devolver o usuário ao cliente.
 */
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /auth/register - cria um novo usuário e já devolve o token
router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const email = data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name.trim(), email, passwordHash },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /auth/login - valida credenciais e devolve token + usuário
router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const email = data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// GET /auth/me - retorna o usuário autenticado (valida o token armazenado)
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

export default router;
