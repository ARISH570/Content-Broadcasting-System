const app = require('./src/app');
const sequelize = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced');
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();