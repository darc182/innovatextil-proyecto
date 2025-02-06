import express from 'express';
import { checkAuth, adminAuth } from '../middleware/authMiddleware.js';
import {
     getCategorias,
     crearCategoria,
     actualizarCategoria,
     eliminarCategoria 
    } from '../controllers/categoriaController.js';


const router = express.Router();


router.route('/')
    .get(getCategorias).post(checkAuth,adminAuth, crearCategoria);

router.route('/:id')
    .put(checkAuth, adminAuth, actualizarCategoria)
    .delete(checkAuth,adminAuth,eliminarCategoria);


export default router;

