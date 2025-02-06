import Categoria from "../models/Categoria.js";
import slugify from "slugify";

const getCategorias = async (req,res)=>{
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las categorías" });
    }
};

const crearCategoria = async (req,res)=>{
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }
        
        const slug = slugify(nombre, { lower: true, strict: true });
        const categoriaExistente = await Categoria.findOne({ slug });
        if (categoriaExistente) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }
        
        const nuevaCategoria = new Categoria({nombre, slug});
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);

    } catch (error) {
        res.status(500).json({ message: "Error al crear la categoría" });
    }
};


const actualizarCategoria =async (req,res)=>{
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }
        
        const slug = slugify(nombre, { lower: true, strict: true });
        const categoria = await Categoria.findByIdAndUpdate(
            id,
            { nombre, slug },
            { new: true }
        );
        
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la categoría" });
    }
};

const eliminarCategoria =async (req,res)=>{
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndDelete(id);
        
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        
        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría" });
    }
};


export {
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}