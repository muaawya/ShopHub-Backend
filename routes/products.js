import express from 'express';
import { listProducts, createProduct, vendorProducts, updateProduct, getProduct } from '../controllers/productController.js';
const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.get('/vendor/:vendorId', vendorProducts);
router.post('/', createProduct); // in real app, protect route and check vendor ownership
router.put('/:id', updateProduct);

export default router;
