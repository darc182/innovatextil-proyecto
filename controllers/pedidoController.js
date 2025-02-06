import Pedido from "../models/Pedido.js";

const crearPedido = async (req,res)=>{
    const pedido = new Pedido(req.body);

    pedido.usuario  = req.usuario._id;

    
    try {
        const nuevoPedido = await pedido.save();
        res.json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};


const obtenerPedidosUsuario = async (req, res)=>{
    try {
        const pedidos = await Pedido.find({ usuario: req.usuario._id }).populate("productos.producto");
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos" });
    }
};


const obtenerPedidoPorId =async (req, res)=>{
    try {
        const pedido = await Pedido.findById(req.params.id).populate("productos.producto").populate("usuario");
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};


const actualizarEstadoPedido = async (req, res)=>{
    try {
        const { estado } = req.body;
        const pedido = await Pedido.findById(req.params.id);

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        // Verificar si el estado es válido
        const estadosValidos = ["pendiente", "pagado", "enviado", "entregado"];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        pedido.estado = estado;
        await pedido.save();
        res.json({ message: "Estado actualizado correctamente", pedido });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado" });
    }
};


export {
    crearPedido,
    obtenerPedidoPorId,
    obtenerPedidosUsuario,
    actualizarEstadoPedido
}

