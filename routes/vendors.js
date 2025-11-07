import express from 'express';
import { listVendors, approveVendor, getVendor } from '../controllers/vendorController.js';
const router = express.Router();

router.get('/', listVendors);
router.get('/:id', getVendor);
router.put('/approve/:id', approveVendor);

export default router;
