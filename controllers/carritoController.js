import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Obtener el carrito del usuario autenticado
const getCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.usuario._id })
      .populate("items.productoId");
    return res.json(carrito);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
  }
};

// Agregar un item al carrito
const agregarItemCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    if (!productoId || !cantidad) {
      return res.status(400).json({ message: "Se requieren productoId y cantidad" });
    }

    // Buscar o crear el carrito para el usuario
    let carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      carrito = new Carrito({ usuario: req.usuario._id, items: [] });
    }

    // Verificar si el producto ya existe en el carrito
    const itemIndex = carrito.items.findIndex(item => item.productoId.toString() === productoId);
    if (itemIndex > -1) {
      // Actualizar la cantidad existente
      carrito.items[itemIndex].cantidad += Number(cantidad);
    } else {
      // Agregar nuevo item
      carrito.items.push({ productoId, cantidad });
    }

    // Recalcular precioTotal (opcional)
    carrito.precioTotal = await calcularPrecioTotal(carrito.items);
    await carrito.save();
    return res.status(201).json(carrito);
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar item al carrito", error: error.message });
  }
};

// Actualizar el carrito (reemplazar el array de items)
const actualizarCarrito = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ productoId, cantidad }]
    if (!items) {
      return res.status(400).json({ message: "Se requiere un array de items para actualizar" });
    }
    let carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    carrito.items = items;
    carrito.precioTotal = await calcularPrecioTotal(items);
    await carrito.save();
    return res.json(carrito);
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el carrito", error: error.message });
  }
};

// Vaciar el carrito (eliminar todos los items)
const eliminarCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    carrito.items = [];
    carrito.precioTotal = 0;
    await carrito.save();
    return res.json({ message: "Carrito vaciado" });
  } catch (error) {
    return res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
  }
};

// Función auxiliar para calcular el precio total del carrito
async function calcularPrecioTotal(items) {
  let total = 0;
  for (const item of items) {
    const producto = await Producto.findById(item.productoId);
    if (producto) {
      total += producto.precio * item.cantidad;
    }
  }
  return total;
}


export {
    getCarrito,
    agregarItemCarrito,
    actualizarCarrito,
    eliminarCarrito
}