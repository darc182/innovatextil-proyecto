import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  productoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Producto", 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    default: 1 
  }
});

const carritoSchema = mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  items: [ itemSchema ],
  precioTotal: { 
    type: Number, 
    default: 0 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  }
});

const Carrito = mongoose.model("Carrito", carritoSchema);
export default Carrito;
