import express from 'express';
import { checkAuth,adminAuth } from '../middleware/authMiddleware.js';
import { 
    crearPedido,
    obtenerPedidosUsuario,
    obtenerPedidoPorId,
    actualizarEstadoPedido
} from '../controllers/pedidoController.js';


const router = express.Router();

router.post('/', checkAuth, crearPedido);
router.get('/mis-pedidos', checkAuth, obtenerPedidosUsuario);
router.get('/:id', checkAuth, obtenerPedidoPorId);
router.put('/:id/estado', checkAuth, adminAuth, actualizarEstadoPedido);

export default router;