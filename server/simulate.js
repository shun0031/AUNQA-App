const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- Simulating Teacher Uploading Evidence ---');
  
  // Get teacher
  const teacher = await prisma.user.findFirst({ where: { username: 'teacher' } });
  const aunqa = await prisma.user.findFirst({ where: { username: 'aunqa' } });
  
  // Get a course & criteria
  const criteria = await prisma.criteria.findFirst({ include: { course: true } });
  
  if (!criteria) {
    console.log('No criteria found to upload against.');
    return;
  }

  // Teacher creates a record
  let record = await prisma.aunqaRecord.create({
    data: {
      academic_year: '2568',
      description: 'นี่คือเอกสารหลักฐานสมมติที่อาจารย์ทดลองส่งเข้ามาในระบบครับ (มคอ.3)',
      status: 'draft',
      course_id: criteria.course_id,
      criteria_id: criteria.id,
      created_by_id: teacher.id
    }
  });

  await prisma.evidence.create({
    data: {
      evidence_type: 'text',
      text_content: 'ลิงก์ Google Drive ไปยังโฟลเดอร์เก็บเอกสาร มคอ.3',
      record_id: record.id
    }
  });

  console.log(`Teacher (ID: ${teacher.id}) uploaded Record #${record.id}`);

  console.log('--- Simulating AUN-QA Reviewing Evidence ---');
  
  // AUN-QA reviews and approves
  record = await prisma.aunqaRecord.update({
    where: { id: record.id },
    data: {
      status: 'approved',
      review_comment: 'เอกสารครบถ้วน สมบูรณ์แบบมากครับ อนุมัติให้ผ่านเกณฑ์นี้ได้',
      reviewed_by_id: aunqa.id,
      reviewed_date: new Date()
    }
  });

  console.log(`AUN-QA (ID: ${aunqa.id}) reviewed Record #${record.id} -> Status: ${record.status}`);
  console.log('Simulation complete!');
}

run().finally(() => prisma.$disconnect());
