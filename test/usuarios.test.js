import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

describe('Modelo Usuario', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Usuario.deleteMany();
    });

    test('Debe crear un usuario y hashear la contraseña', async () => {
        const usuario = new Usuario({
            email: 'test@example.com',
            password: '123456',
            nombre: 'Usuario de prueba'
        });

        await usuario.save();
        
        const usuarioGuardado = await Usuario.findOne({ email: 'test@example.com' });
        expect(usuarioGuardado).toBeDefined();
        expect(usuarioGuardado.password).not.toBe('123456');
        expect(await bcrypt.compare('123456', usuarioGuardado.password)).toBe(true);
    });

    test('Debe comprobar la contraseña correctamente', async () => {
        const usuario = new Usuario({
            email: 'test2@example.com',
            password: 'securePass',
            nombre: 'Otro Usuario'
        });
        
        await usuario.save();
        const usuarioGuardado = await Usuario.findOne({ email: 'test2@example.com' });
        
        const esValida = await usuarioGuardado.comprobarPassword('securePass');
        expect(esValida).toBe(true);

        const esInvalida = await usuarioGuardado.comprobarPassword('wrongPass');
        expect(esInvalida).toBe(false);
    });
});
