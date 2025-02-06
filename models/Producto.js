import mongoose from "mongoose";

const productoSchema = mongoose.Schema({
    nombre: { 
        type: String, 
        required: true
     }, // Ej: "Tela de algodón estampada"

    descripcion: {
         type: String,
         required: true
    },


    precio: { 
        type: Number, 
        required: true 
    },


    categoria: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Categoria', 
         required: true 
        },

    imagen: [{ type: String }], // URLs de imágenes (puedes usar Cloudinary o almacenamiento local)

    stock: { 
        type: Number,
         default: 0
        },

    sku: { 
        type: String, 
        unique: true 
    }, // Código único identificador (opcional)

    fecha: { 
        type: Date, 
        required: true,
        default: Date.now()
    },

    
  },

    {
    timestamp: true
    }
);


const Producto = mongoose.model('Producto', productoSchema);


export default Producto;