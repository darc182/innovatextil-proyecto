
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Carrito from "../models/Carrito.js"; // Asegúrate de poner la ruta correcta a tu modelo

describe("Carrito Model Test", () => {
  let mongoServer;

  // Inicia una instancia de MongoDB en memoria antes de ejecutar los tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Limpia la colección después de cada prueba para tener un entorno aislado
  afterEach(async () => {
    await Carrito.deleteMany({});
  });

  // Cierra la conexión y detiene el servidor en memoria una vez finalizadas todas las pruebas
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("debe crear y guardar un carrito correctamente", async () => {
    const carritoData = {
      usuario: new mongoose.Types.ObjectId(), // Simulamos un ID de usuario existente
      items: [
        {
          productoId: new mongoose.Types.ObjectId(), // Simulamos un ID de producto existente
          cantidad: 2,
        },
      ],
      precioTotal: 100,
      // La fecha se asigna por defecto con Date.now
    };

    const carrito = new Carrito(carritoData);
    const carritoGuardado = await carrito.save();

    // Verificamos que se haya generado el _id y que los campos sean los esperados
    expect(carritoGuardado._id).toBeDefined();
    expect(carritoGuardado.usuario.toString()).toBe(carritoData.usuario.toString());
    expect(carritoGuardado.items.length).toBe(1);
    expect(carritoGuardado.items[0].productoId.toString()).toBe(
      carritoData.items[0].productoId.toString()
    );
    expect(carritoGuardado.items[0].cantidad).toBe(carritoData.items[0].cantidad);
    expect(carritoGuardado.precioTotal).toBe(carritoData.precioTotal);
  });

  it("debe fallar al intentar guardar un carrito sin el campo requerido 'usuario'", async () => {
    const carritoData = {
      // usuario omitido intencionalmente
      items: [
        {
          productoId: new mongoose.Types.ObjectId(),
          cantidad: 2,
        },
      ],
      precioTotal: 100,
    };

    let error;
    try {
      const carrito = new Carrito(carritoData);
      await carrito.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.usuario).toBeDefined();
  });

  it("debe asignar un valor por defecto a 'fecha'", async () => {
    const carritoData = {
      usuario: new mongoose.Types.ObjectId(),
      items: [
        {
          productoId: new mongoose.Types.ObjectId(),
          cantidad: 2,
        },
      ],
      precioTotal: 100,
    };

    const carrito = new Carrito(carritoData);
    const carritoGuardado = await carrito.save();

    expect(carritoGuardado.fecha).toBeDefined();
    // Verificamos que la fecha asignada esté cerca de la fecha actual
    const diferenciaEnMilisegundos = new Date() - carritoGuardado.fecha;
    expect(diferenciaEnMilisegundos).toBeLessThan(1000); // menos de 1 segundo de diferencia
  });
});
