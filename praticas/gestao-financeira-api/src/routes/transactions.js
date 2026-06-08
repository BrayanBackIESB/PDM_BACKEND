import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js";

const router = Router();

// GET /transactions - lista as transações do usuário autenticado.
// Suporta filtros opcionais ?month=1-12 e ?year=YYYY.
router.get("/", async (req, res, next) => {
  try {
    const where = { userId: req.userId };

    const month = req.query.month ? Number(req.query.month) : null;
    const year = req.query.year ? Number(req.query.year) : null;

    if (year && month) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      where.date = { gte: start, lt: end };
    } else if (year) {
      const start = new Date(Date.UTC(year, 0, 1));
      const end = new Date(Date.UTC(year + 1, 0, 1));
      where.date = { gte: start, lt: end };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (e) { next(e); }
});

// POST /transactions - cria uma nova transação para o usuário autenticado
router.post("/", async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({
      data: { ...data, userId: req.userId },
      include: { category: true },
    });
    res.status(201).json(transaction);
  } catch (e) { next(e); }
});

// PUT /transactions/:id - atualiza apenas se pertencer ao usuário
router.put("/:id", async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    });
    res.json(transaction);
  } catch (e) { next(e); }
});

// DELETE /transactions/:id - remove apenas se pertencer ao usuário
router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
