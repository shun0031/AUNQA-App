const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial admin user...');
  
  let adminRole = await prisma.role.findUnique({ where: { role_name: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { role_name: 'admin' } });
  }

  const existingUser = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    await prisma.user.create({
      data: {
        username: 'admin',
        password_hash: password_hash,
        full_name: 'System Administrator',
        email: 'admin@aunqa.local',
        role_id: adminRole.id
      }
    });
    console.log('Admin user created: username "admin", password "admin123"');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
