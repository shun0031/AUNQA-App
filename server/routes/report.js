const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/progress', async (req, res) => {
  try {
    // Get all courses with their criteria
    const courses = await prisma.course.findMany({
      include: {
        criteria: true
      }
    });

    // Get all approved records
    const approvedRecords = await prisma.aunqaRecord.findMany({
      where: { status: 'approved' },
      select: { course_id: true, criteria_id: true }
    });

    // Calculate progress per course
    const progressData = courses.map(course => {
      const courseCriteria = course.criteria;
      const totalCriteria = courseCriteria.length;
      
      if (totalCriteria === 0) {
        return {
          course_id: course.id,
          course_name: course.course_name,
          progress: 0,
          completed: 0,
          total: 0,
          details: []
        };
      }

      // Group records by criteria
      let completedCriteria = 0;
      const details = courseCriteria.map(c => {
        const hasApprovedEvidence = approvedRecords.some(r => r.course_id === course.id && r.criteria_id === c.id);
        if (hasApprovedEvidence) completedCriteria++;
        return {
          criteria_no: c.criteria_no,
          criteria_name: c.criteria_name,
          is_completed: hasApprovedEvidence
        };
      });

      const progressPercent = Math.round((completedCriteria / totalCriteria) * 100);

      return {
        course_id: course.id,
        course_name: course.course_name,
        progress: progressPercent,
        completed: completedCriteria,
        total: totalCriteria,
        details: details
      };
    });

    res.json(progressData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating report' });
  }
});

module.exports = router;
