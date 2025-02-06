import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';
import swaggerDocs from './swagger/swaggerConfig.js';


const app =  express();

app.use(express.json());
dotenv.config();

conectarDB();


// const dominiosPermitidos = [process.env.FRONTEND_URL]
// const corsOptions = {
//     origin: function(origin, callback){
//         if (dominiosPermitidos.indexOf(origin) !== -1) {
//             //El origen del request esta permitido
//             callback(null,true)
//         }else{
//             callback(new Error('No permitido por CORS'))
//         }
//     }
// }

// app.use(cors(corsOptions))

app.get('/',(req,res)=>{
    res.send("InnovaTextil online 🐱‍🏍")})

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/carrito', carritoRoutes);

swaggerDocs(app);

const PORT = process.env.PORT || 4000


app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`);
    
})


export default app