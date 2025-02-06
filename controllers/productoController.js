import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import multer from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();



cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: "proyecto-producto",
        format: async (req, file) => "jpg", // o "jpeg"
        public_id: (req, file) => file.originalname
    }
});


const upload = multer({ storage });

const uploadMiddleware = upload.fields([{ name: "imagen", maxCount: 5 }]);



const crearProducto = async (req,res) =>{
    try {
       
        const { nombre, descripcion, precio, categoria, stock, sku } = req.body;

        if (!nombre || !descripcion || !precio || !categoria) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        let imagenes = [];
        if (req.files && req.files.imagen) {
            imagenes = req.files.imagen.map(file => file.path);
        }else if (req.file) {
            imagenes.push(req.file.path);
        }

        const nuevoProducto = new Producto({ 
            nombre, 
            descripcion, 
            precio, 
            categoria, 
            stock, 
            sku, 
            imagen: imagenes 
        });

        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ message: "Error al crear el producto", error: error.message });
    }
};


const getProductos = async (req,res)=>{
    try {
        const { page = 1, limit = 10, nombre } = req.query;
        const query = nombre ? { nombre: { $regex: nombre, $options: "i" } } : {};
        
        const productos = await Producto.find(query)
            .populate("categoria")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        const total = await Producto.countDocuments(query);
        
        res.json({ productos, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

const getProductoById = async (req,res)=>{
    try {
        const producto = await Producto.findById(req.params.id).populate("categoria");
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};



const actualizarProducto = async (req,res) =>{
    try {

        console.log(req.body);
        
        const { nombre, descripcion, precio, categoria, stock, sku } = req.body;
        let imagenes = [];

        const productoExistente = await Producto.findById(req.params.id);
        if (productoExistente && productoExistente.imagen.length > 0) {
            for (const img of productoExistente.imagen) {
            const publicId = img.split('/').pop().split('.')[0]; 
            await cloudinaryV2.uploader.destroy(publicId);
        }
}
        
        if (req.files) {
            imagenes = req.files.imagen.map(file => file.path);
        }else if (req.file) {
            imagenes.push(req.file.path);
        }
        console.log(req.files);
        

        const producto = await Producto.findByIdAndUpdate(req.params.id, { nombre, descripcion, precio, categoria, stock, sku, imagen: imagenes }, { new: true });

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

const  eliminarProducto = async (req,res) =>{
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};
 



const getProductosByCategoria = async (req, res) => {
  try {
    const { slug } = req.params;
    // Buscar la categoría por su slug
    const categoria = await Categoria.findOne({ slug });
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    // Encontrar los productos que pertenecen a esa categoría
    const productos = await Producto.find({ categoria: categoria._id }).populate("categoria");
    
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ message: "Error al obtener productos por categoría" });
  }
};


export {
    crearProducto,
    getProductos,
    getProductoById,
    actualizarProducto,
    eliminarProducto,
    uploadMiddleware,
    getProductosByCategoria
}