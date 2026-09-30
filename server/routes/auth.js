const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-aunqa-key';

// 1. API: Register (สำหรับเพิ่มข้อมูลจำลองเบื้องต้น เนื่องจากยังไม่มี User ในฐานข้อมูล)
router.post('/register', async (req, res) => {
  try {
    const { username, password, full_name, email, role_name } = req.body;

    // หา Role ในฐานข้อมูล หรือสร้างใหม่ถ้ายังไม่มี
    let role = await prisma.role.findUnique({ where: { role_name } });
    if (!role) {
      role = await prisma.role.create({ data: { role_name } });
    }

    // เข้ารหัส Password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // สร้าง User
    const user = await prisma.user.create({
      data: {
        username,
        password_hash,
        full_name,
        email,
        role_id: role.id
      }
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. API: Login (ใช้จริงในหน้าเว็บ)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // หา User ในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // ตรวจสอบ Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // สร้าง Token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role.role_name
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        // อัปเดตเวลาเข้าสู่ระบบล่าสุด
        prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() }
        }).then(() => {
          res.json({ token, user: payload.user });
        });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
