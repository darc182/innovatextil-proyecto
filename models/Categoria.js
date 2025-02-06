import mongoose from "mongoose";

const categoriaSchema = mongoose.Schema({
    nombre: { 
        type: String, required: true,
         unique: true 
        }, // Ej: "Telas", "Hilos", "Botones"


    slug: { 
        type: String, 
        unique: true,
        default: null } // URL amigable (ej: "telas-algodon")
  });


const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;