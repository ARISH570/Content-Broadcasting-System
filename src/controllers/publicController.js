const { getActiveContentForTeacher } = require('../services/schedulingService');

const getLiveContent = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Validate teacherId is a number
    const id = parseInt(teacherId);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const activeContent = await getActiveContentForTeacher(id);

    if (!activeContent) {
      return res.json({ message: 'No content available' });
    }

    res.json({
      id: activeContent.id,
      title: activeContent.title,
      description: activeContent.description,
      subject: activeContent.subject,
      file_url: activeContent.file_url,
      file_type: activeContent.file_type,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLiveContent,
};