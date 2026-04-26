const { Content, ContentSlot, ContentSchedule } = require('../models');

const getActiveContentForTeacher = async (teacherId) => {
  try {
    // Get all approved content for the teacher
    const contents = await Content.findAll({
      where: {
        uploaded_by: teacherId,
        status: 'approved',
      },
      include: [
        {
          model: ContentSchedule,
          include: [ContentSlot],
        },
      ],
    });

    if (contents.length === 0) {
      return null;
    }

    const now = new Date();

    // Group by subject
    const subjectGroups = {};
    contents.forEach(content => {
      if (!subjectGroups[content.subject]) {
        subjectGroups[content.subject] = [];
      }
      subjectGroups[content.subject].push(content);
    });

    // For each subject, find active content
    for (const subject in subjectGroups) {
      const subjectContents = subjectGroups[subject].filter(c => {
        // Check time window
        if (c.start_time && c.end_time) {
          if (now < c.start_time || now > c.end_time) {
            return false;
          }
        }
        return true;
      });

      if (subjectContents.length === 0) continue;

      // Get schedules for this subject
      const schedules = [];
      subjectContents.forEach(c => {
        if (c.ContentSchedules && c.ContentSchedules.length > 0) {
          schedules.push(...c.ContentSchedules);
        }
      });

      if (schedules.length === 0) continue;

      // Sort by rotation_order
      schedules.sort((a, b) => a.rotation_order - b.rotation_order);

      // Calculate total cycle time
      const totalDuration = schedules.reduce((sum, s) => sum + s.duration, 0);

      // Find start of current cycle
      const cycleStart = new Date(now);
      cycleStart.setMinutes(cycleStart.getMinutes() - (cycleStart.getMinutes() % totalDuration));

      let elapsed = 0;
      for (const schedule of schedules) {
        if (elapsed + schedule.duration > (now - cycleStart) / (1000 * 60)) {
          // This is the active one
          const activeContent = subjectContents.find(c => c.id === schedule.content_id);
          if (activeContent) {
            return activeContent;
          }
        }
        elapsed += schedule.duration;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting active content:', error);
    return null;
  }
};

module.exports = {
  getActiveContentForTeacher,
};