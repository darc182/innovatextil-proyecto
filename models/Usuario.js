import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarId.js";

const usuarioSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true
    },

    password: { 
        type: String, 
        required: true 
    },

    nombre: { 
        type: String, 
        required: true,
        trim: true 
    },
        

    direccion: { 
        type: String,
        default: null,
        trim: true 
    },
    
    telefono: {
        type: String,
        default: null,
        trim: true
    },

    role: { 
        type: String,
         enum: ['user', 'admin'], 
         default: 'user' 
        },

    token: {
        type: String,
        default: generarId()
    },

    confirmado: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}


const Usuario = mongoose.model('Usuario', usuarioSchema);


export default Usuario;