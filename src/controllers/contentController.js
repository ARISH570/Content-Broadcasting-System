const { Content, ContentSlot, ContentSchedule, User } = require('../models');
const path = require('path');
const fs = require('fs');

const uploadContent = async (req, res) => {
  try {
    const { title, description, subject, start_time, end_time, rotation_duration } = req.body;
    const file = req.file;

    if (!title || !subject || !file) {
      return res.status(400).json({ message: 'Title, subject, and file are required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, GIF allowed' });
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds 10MB' });
    }

    // Save file locally
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const content = await Content.create({
      title,
      description,
      subject,
      file_url: `/uploads/${fileName}`,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: req.user.id,
      status: 'pending',
      start_time: start_time ? new Date(start_time) : null,
      end_time: end_time ? new Date(end_time) : null,
      rotation_duration: rotation_duration ? parseInt(rotation_duration) : null,
    });

    // Create or find slot for subject
    let slot = await ContentSlot.findOne({ where: { subject } });
    if (!slot) {
      slot = await ContentSlot.create({ subject });
    }

    // Add to schedule if rotation_duration is provided
    if (rotation_duration) {
      const existingSchedules = await ContentSchedule.findAll({
        where: { slot_id: slot.id },
        order: [['rotation_order', 'ASC']],
      });
      const nextOrder = existingSchedules.length > 0 ? existingSchedules[existingSchedules.length - 1].rotation_order + 1 : 1;

      await ContentSchedule.create({
        content_id: content.id,
        slot_id: slot.id,
        rotation_order: nextOrder,
        duration: parseInt(rotation_duration),
      });
    }

    res.status(201).json({ message: 'Content uploaded successfully', contentId: content.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPendingContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'uploadedBy', attributes: ['name', 'email'] }],
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    content.status = 'approved';
    content.approved_by = req.user.id;
    content.approved_at = new Date();
    await content.save();
    res.json({ message: 'Content approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const rejectContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    if (!rejection_reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    content.status = 'rejected';
    content.rejection_reason = rejection_reason;
    await content.save();
    res.json({ message: 'Content rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTeacherContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { uploaded_by: req.user.id },
      include: [{ model: User, as: 'approvedBy', attributes: ['name'] }],
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      include: [
        { model: User, as: 'uploadedBy', attributes: ['name', 'email'] },
        { model: User, as: 'approvedBy', attributes: ['name'] },
      ],
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadContent,
  getPendingContent,
  approveContent,
  rejectContent,
  getTeacherContent,
  getAllContent,
};