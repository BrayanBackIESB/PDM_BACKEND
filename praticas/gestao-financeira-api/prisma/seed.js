// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "income",    displayName: "Renda",       icon: "work",                background: "#DE9AC3", isIncome: true,  isDefault: true },
  { name: "food",      displayName: "Alimentação", icon: "fastfood",            background: "#DEA17B", isIncome: false, isDefault: true },
  { name: "house",     displayName: "Casa",        icon: "home",                background: "#E6E088", isIncome: false, isDefault: true },
  { name: "education", displayName: "Educação",    icon: "book",                background: "#AB8FBE", isIncome: false, isDefault: true },
  { name: "travel",    displayName: "Viagens",     icon: "airplanemode-active", background: "#82C9DE", isIncome: false, isDefault: true },
];

// Usuário demo para facilitar o login durante os testes (Postman / app).
const demoUser = {
  name: "Usuário Demo",
  email: "demo@gestao.com",
  password: "demo123",
};

async function main() {
  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }

  const passwordHash = await bcrypt.hash(demoUser.password, 10);
  await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {},
    create: { name: demoUser.name, email: demoUser.email, passwordHash },
  });

  console.log("Seed concluído.");
  console.log(`Usuário demo: ${demoUser.email} / ${demoUser.password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());