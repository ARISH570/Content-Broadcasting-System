const User = require('./User');
const Content = require('./Content');
const ContentSlot = require('./ContentSlot');
const ContentSchedule = require('./ContentSchedule');

// Associations
User.hasMany(Content, { foreignKey: 'uploaded_by', as: 'uploadedContent' });
Content.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploadedBy' });

User.hasMany(Content, { foreignKey: 'approved_by', as: 'approvedContent' });
Content.belongsTo(User, { foreignKey: 'approved_by', as: 'approvedBy' });

ContentSlot.hasMany(ContentSchedule, { foreignKey: 'slot_id' });
ContentSchedule.belongsTo(ContentSlot, { foreignKey: 'slot_id' });

Content.hasMany(ContentSchedule, { foreignKey: 'content_id' });
ContentSchedule.belongsTo(Content, { foreignKey: 'content_id' });

module.exports = {
  User,
  Content,
  ContentSlot,
  ContentSchedule,
};