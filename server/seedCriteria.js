const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AUN-QA Version 4.0 Criteria...');

  // 1. Create a default department if none exists
  let dep = await prisma.department.findFirst();
  if (!dep) {
    dep = await prisma.department.create({ data: { department_name: 'คณะครุศาสตร์อุตสาหกรรม' } });
  }

  // 2. Create a default course if none exists
  let course = await prisma.course.findFirst();
  if (!course) {
    course = await prisma.course.create({ 
      data: { 
        course_name: 'วิศวกรรมคอมพิวเตอร์',
        department_id: dep.id
      } 
    });
  }

  // 3. AUN-QA v4.0 Criteria Data
  const criteriaData = [
    { no: '1', name: 'Expected Learning Outcomes', th: 'ผลการเรียนรู้ที่คาดหวัง' },
    { no: '2', name: 'Programme Structure and Content', th: 'โครงสร้างและเนื้อหาของหลักสูตร' },
    { no: '3', name: 'Teaching and Learning Approach', th: 'แนวทางการจัดการเรียนและการสอน' },
    { no: '4', name: 'Student Assessment', th: 'การวัดผลและประเมินผลนักศึกษา' },
    { no: '5', name: 'Academic Staff', th: 'คุณภาพของบุคลากรสายวิชาการ' },
    { no: '6', name: 'Student Support Services', th: 'การส่งเสริมและให้บริการแก่นักศึกษา' },
    { no: '7', name: 'Facilities and Infrastructure', th: 'โครงสร้างพื้นฐานและสิ่งอำนวยความสะดวกต่างๆ' },
    { no: '8', name: 'Output and Outcomes', th: 'ผลผลิตและผลลัพธ์' },
  ];

  for (const c of criteriaData) {
    const exists = await prisma.criteria.findFirst({
      where: { criteria_no: c.no, course_id: course.id }
    });

    if (!exists) {
      await prisma.criteria.create({
        data: {
          criteria_no: c.no,
          criteria_name: c.name,
          description: c.th,
          academic_year: '2567',
          course_id: course.id
        }
      });
      console.log(`Added Criteria ${c.no}: ${c.name}`);
    }
  }

  console.log('Done seeding Criteria.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
