const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');

const { upload } = require('../utils/cloudinary');

const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        phone: true,
        line_id: true,
        address: true,
        profile_picture: true,
        status: true,
        role: { select: { role_name: true } },
        department: { select: { department_name: true } }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, password, full_name, email, role_name, phone, line_id, address } = req.body;

    let role = await prisma.role.findUnique({ where: { role_name } });
    if (!role) {
      role = await prisma.role.create({ data: { role_name } });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        password_hash,
        full_name,
        email,
        phone,
        line_id,
        address,
        role_id: role.id
      },
      select: { id: true, username: true, full_name: true, role: true }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating user' });
  }
});

// Update user
router.put('/:id', upload.single('profile_picture'), async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, status, role_name, password, phone, line_id, address } = req.body;
    
    let updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;
    if (status !== undefined) updateData.status = status;
    if (phone !== undefined) updateData.phone = phone;
    if (line_id !== undefined) updateData.line_id = line_id;
    if (address !== undefined) updateData.address = address;
    if (req.file) updateData.profile_picture = req.file.path.replace(/\\/g, '/');

    if (role_name) {
      let role = await prisma.role.findUnique({ where: { role_name } });
      if (!role) {
        role = await prisma.role.create({ data: { role_name } });
      }
      updateData.role_id = role.id;
    }

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, username: true, full_name: true, email: true, role: true, profile_picture: true }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

module.exports = router;
