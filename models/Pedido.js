import mongoose from "mongoose";

const pedidoSchema = mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        },

    productos: [{
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      cantidad: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true } // Precio al momento de la compra
    }],


    montoTotal: { 
        type: Number, 
        required: true 
    },

    estado: { 
        type: String, 
        enum: ['pendiente', 'pagado', 'enviado', 'entregado'],
         default: 'pendiente' 
        },

    idPago: { 
        type: String
     }, // Si integras pasarela de pago (ej: Stripe)

    direccionEnvio: { 
        type: String
     },

    fecha: { 
        type: Date, 
        default: Date.now() 
    }
  });

  const Pedido = mongoose.model('Pedido', pedidoSchema);

  export default Pedido;