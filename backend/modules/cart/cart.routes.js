const express = require('express');
const router  = express.Router();
const ctrl    = require('./cart.controller');
const { protect } = require('../../middleware/auth');

router.get('/',           protect, ctrl.getCart);
router.post('/',          protect, ctrl.addItem);
router.put('/:itemId',    protect, ctrl.updateItem);
router.delete('/:itemId', protect, ctrl.removeItem);
router.delete('/',        protect, ctrl.clearCart);

module.exports = router;
