const express = require('express');
const router  = express.Router();
const ctrl    = require('./orders.controller');
const { protect, adminOnly } = require('../../middleware/auth');

// All order routes require authentication — no guest checkout
router.post('/checkout',    protect,      ctrl.createOrderFromCart);
router.get('/my-orders',    protect,      ctrl.getMyOrders);
router.get('/stats',        protect, adminOnly, ctrl.getStats);
router.get('/',             protect, adminOnly, ctrl.getAllOrders);
router.get('/:id',          protect,      ctrl.getOrderById);
router.put('/:id/status',   protect, adminOnly, ctrl.updateOrderStatus);

module.exports = router;
