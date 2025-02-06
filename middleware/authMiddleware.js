import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';


const checkAuth =async (req, res, next) =>{
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token =  req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario =  await Usuario.findById(decoded.id).select('-password -token -confirmado');
        
         
            return next();
            
        } catch (error) {
            error = new Error('Token no Valido');
            return res.status(403).json({msg: error.message});
        }
        
    }


    if (!token) {
        const error = new Error('Token no Valido o inexistente');
        res.status(403).json({msg: error.message});
    }
    
    
    next();
};


// 2. Verifica si el usuario es administrador
const adminAuth = (req, res, next) => {
    if (req.usuario && req.usuario.role === 'admin') {
      next(); // Permite continuar
    } else {
      res.status(403).json({ msg: 'Acceso restringido a administradores.' });
    }
  };

export{
    checkAuth,
    adminAuth
}