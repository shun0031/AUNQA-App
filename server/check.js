const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ include: { role: true } });
  console.log(users.map(u => ({ username: u.username, role: u.role.role_name, fullName: u.full_name })));
}
check().finally(() => prisma.$disconnect());
