import express from "express";
import { 
    getCarrito, 
    agregarItemCarrito, 
    actualizarCarrito, 
    eliminarCarrito 
  } from "../controllers/carritoController.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();


// Obtener el carrito del usuario autenticado
router.get("/", checkAuth, getCarrito);

// Agregar un item al carrito (si ya existe, actualiza la cantidad)
router.post("/", checkAuth, agregarItemCarrito);

// Actualizar el carrito (reemplazar el array de items)
router.put("/", checkAuth, actualizarCarrito);

// Vaciar el carrito
router.delete("/", checkAuth, eliminarCarrito);

export default router;