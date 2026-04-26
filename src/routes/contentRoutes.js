const express = require('express');
const router = express.Router();
const multer = require('multer');
const contentController = require('../controllers/contentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', verifyToken, checkRole('teacher'), upload.single('file'), contentController.uploadContent);
router.get('/pending', verifyToken, checkRole('principal'), contentController.getPendingContent);
router.put('/:id/approve', verifyToken, checkRole('principal'), contentController.approveContent);
router.put('/:id/reject', verifyToken, checkRole('principal'), contentController.rejectContent);
router.get('/my', verifyToken, checkRole('teacher'), contentController.getTeacherContent);
router.get('/', verifyToken, checkRole('principal'), contentController.getAllContent);

module.exports = router;