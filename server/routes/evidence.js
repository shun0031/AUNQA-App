const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const { upload } = require('../utils/cloudinary');

// Get all records (Admin/AUN-QA sees all, Teacher sees theirs)
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let whereClause = {};
    if (user_id) {
      whereClause.created_by_id = parseInt(user_id);
    }

    const records = await prisma.aunqaRecord.findMany({
      where: whereClause,
      include: {
        course: true,
        criteria: true,
        created_by: { select: { full_name: true } },
        evidences: { include: { file: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload a new evidence record
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { academic_year, description, course_id, criteria_id, user_id, evidence_type } = req.body;
    
    // Create the Record first
    const record = await prisma.aunqaRecord.create({
      data: {
        academic_year,
        description,
        status: 'draft',
        course_id: parseInt(course_id),
        criteria_id: parseInt(criteria_id),
        created_by_id: parseInt(user_id)
      }
    });

    let savedFile = null;
    if (req.file) {
      savedFile = await prisma.file.create({
        data: {
          original_name: req.file.originalname,
          file_name: req.file.filename,
          file_path: req.file.path,
          file_type: path.extname(req.file.originalname).substring(1),
          mime_type: req.file.mimetype,
          file_size: req.file.size,
          uploaded_by_id: parseInt(user_id)
        }
      });
    }

    // Link Evidence to Record
    await prisma.evidence.create({
      data: {
        evidence_type: evidence_type || (req.file ? 'file' : 'text'),
        text_content: description,
        record_id: record.id,
        file_id: savedFile ? savedFile.id : null
      }
    });

    res.status(201).json({ message: 'Evidence uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error uploading evidence' });
  }
});

// Update record status (Approve, Return)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_comment, reviewer_id } = req.body;

    const record = await prisma.aunqaRecord.update({
      where: { id: parseInt(id) },
      data: {
        status,
        review_comment,
        reviewed_by_id: reviewer_id ? parseInt(reviewer_id) : null,
        reviewed_date: new Date()
      }
    });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

module.exports = router;
