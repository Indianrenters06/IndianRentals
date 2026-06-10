const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getAll, getOne, create, update, remove, sendTest, importPresets } = require('../controllers/emailTemplateController');

router.use(protect, admin);

router.post('/test', sendTest);
router.post('/import', importPresets);
router.route('/').get(getAll).post(create);
router.route('/:id').get(getOne).put(update).delete(remove);

module.exports = router;
