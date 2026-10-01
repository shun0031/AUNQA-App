const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all courses with criteria
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: true,
        criteria: {
          orderBy: {
            criteria_no: 'asc'
          }
        }
      }
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const { course_name, department_id } = req.body;
    
    // For simplicity, if department_id is not provided, use/create a default one
    let depId = department_id;
    if (!depId) {
      let defaultDep = await prisma.department.findFirst();
      if (!defaultDep) {
        defaultDep = await prisma.department.create({ data: { department_name: 'ภาควิชาทั่วไป' } });
      }
      depId = defaultDep.id;
    }

    const course = await prisma.course.create({
      data: {
        course_name,
        department_id: depId
      },
      include: { department: true }
    });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate default AUN-QA v4 criteria for a course
router.post('/:id/generate-criteria', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    // Check if course already has criteria
    const existing = await prisma.criteria.count({ where: { course_id: courseId } });
    if (existing > 0) {
      return res.status(400).json({ error: 'Course already has criteria' });
    }

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

    const createManyData = criteriaData.map(c => ({
      criteria_no: c.no,
      criteria_name: c.name,
      description: c.th,
      academic_year: '2568', // default year
      course_id: courseId
    }));

    await prisma.criteria.createMany({ data: createManyData });
    
    res.json({ message: 'Criteria generated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating criteria' });
  }
});

// Add a new criteria
router.post('/:id/criteria', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { criteria_no, criteria_name, description, academic_year } = req.body;
    const criteria = await prisma.criteria.create({
      data: {
        criteria_no,
        criteria_name,
        description,
        academic_year: academic_year || '2568',
        course_id: courseId
      }
    });
    res.status(201).json(criteria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding criteria' });
  }
});

// Update an existing criteria
router.put('/criteria/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { criteria_no, criteria_name, description, academic_year } = req.body;
    const criteria = await prisma.criteria.update({
      where: { id },
      data: { criteria_no, criteria_name, description, academic_year }
    });
    res.json(criteria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating criteria' });
  }
});

// Delete a criteria
router.delete('/criteria/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.criteria.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting criteria' });
  }
});

module.exports = router;
