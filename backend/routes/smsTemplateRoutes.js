const express = require('express');
const router = express.Router();
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const { getAll, getOne, create, update, remove } = require('../controllers/smsTemplateController');

router.use(protect, admin, hasPermission('settings'));

router.route('/').get(getAll).post(create);
router.route('/:id').get(getOne).put(update).delete(remove);

module.exports = router;
