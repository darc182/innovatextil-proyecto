import express from 'express';
import { 
    crearProducto,
    getProductoById,
    getProductos,
    actualizarProducto,
    eliminarProducto,
    uploadMiddleware,
    getProductosByCategoria

} from '../controllers/productoController.js'; 
import { checkAuth, adminAuth } from '../middleware/authMiddleware.js'; 
import multer from "multer";

const router = express.Router();



// Rutas públicas
router.get('/', getProductos);
router.get('/categoria/:slug', getProductosByCategoria);
router.get('/:id', getProductoById);

// Rutas protegidas (admin)
router.post('/', checkAuth, adminAuth,uploadMiddleware, crearProducto);
router.put('/:id', checkAuth, adminAuth, uploadMiddleware,actualizarProducto);
router.delete('/:id', checkAuth, adminAuth, eliminarProducto);

export default router;