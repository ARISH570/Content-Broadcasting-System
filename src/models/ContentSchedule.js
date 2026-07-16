const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContentSchedule = sequelize.define('ContentSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Contents',
      key: 'id',
    },
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ContentSlots',
      key: 'id',
    },
  },
  rotation_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ContentSchedule;