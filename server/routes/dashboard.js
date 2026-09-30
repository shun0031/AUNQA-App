const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
  try {
    const totalEvidence = await prisma.aunqaRecord.count();
    const pendingReview = await prisma.aunqaRecord.count({ where: { status: 'draft' } });
    const approvedRecords = await prisma.aunqaRecord.count({ where: { status: 'approved' } });
    const returnedRecords = await prisma.aunqaRecord.count({ where: { status: 'returned' } });
    const activeUsers = await prisma.user.count({ where: { status: 'active' } });

    const recentRecords = await prisma.aunqaRecord.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        course: { select: { course_name: true } },
        criteria: { select: { criteria_no: true } },
        created_by: { select: { full_name: true } }
      }
    });

    const formattedRecent = recentRecords.map(r => ({
      id: `EVD-${new Date(r.created_at).getFullYear()}-${r.id.toString().padStart(3, '0')}`,
      course: r.course?.course_name,
      user: r.created_by?.full_name,
      date: new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(r.created_at)),
      status: r.status === 'approved' ? 'ผ่าน' : r.status === 'returned' ? 'ส่งกลับ' : 'รอตรวจ'
    }));

    res.json({
      stats: {
        totalEvidence,
        pendingReview,
        approvedRecords,
        returnedRecords,
        activeUsers
      },
      recent: formattedRecent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

module.exports = router;
