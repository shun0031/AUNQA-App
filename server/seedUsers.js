const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test users for all roles...');

  const roles = [
    { role_name: 'admin', username: 'admin', pass: 'admin123', full_name: 'ผู้ดูแลระบบ (Admin)' },
    { role_name: 'teacher', username: 'teacher', pass: 'teacher123', full_name: 'อาจารย์ผู้รับผิดชอบหลักสูตร' },
    { role_name: 'aun-qa', username: 'aunqa', pass: 'aunqa123', full_name: 'คณะกรรมการประเมิน AUN-QA' }
  ];

  for (const r of roles) {
    let role = await prisma.role.findUnique({ where: { role_name: r.role_name } });
    if (!role) {
      role = await prisma.role.create({ data: { role_name: r.role_name } });
    }

    const exists = await prisma.user.findUnique({ where: { username: r.username } });
    if (!exists) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(r.pass, salt);

      await prisma.user.create({
        data: {
          username: r.username,
          password_hash,
          full_name: r.full_name,
          email: `${r.username}@example.com`,
          role_id: role.id
        }
      });
      console.log(`Created user: ${r.username} with password: ${r.pass}`);
    } else {
      console.log(`User ${r.username} already exists.`);
    }
  }

  console.log('Seed complete.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
