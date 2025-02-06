// producto.test.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Producto from "../models/Producto.js"; 



describe("Producto Model Test", () => {
  let mongoServer;

  // Antes de todas las pruebas, iniciamos la base de datos en memoria
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Después de cada prueba, limpiamos la colección
  afterEach(async () => {
    await Producto.deleteMany({});
  });

  // Al finalizar todas las pruebas, cerramos la conexión y detenemos el servidor
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("debe crear y guardar un producto correctamente", async () => {
    const productoData = {
      nombre: "Producto Test",
      descripcion: "Este es un producto de prueba",
      precio: 49.99,
      categoria: new mongoose.Types.ObjectId(), // Simulamos una categoría existente
      imagen: ["http://example.com/imagen.jpg"],
      stock: 20,
      sku: "SKU-TEST-001"
      // La fecha se asigna por defecto con Date.now()
    };

    const producto = new Producto(productoData);
    const productoGuardado = await producto.save();

    // Verificamos que se haya generado el _id y que los campos sean los esperados
    expect(productoGuardado._id).toBeDefined();
    expect(productoGuardado.nombre).toBe(productoData.nombre);
    expect(productoGuardado.descripcion).toBe(productoData.descripcion);
    expect(productoGuardado.precio).toBe(productoData.precio);
    expect(productoGuardado.categoria.toString()).toBe(productoData.categoria.toString());
    expect(productoGuardado.imagen).toEqual(expect.arrayContaining(productoData.imagen));
    expect(productoGuardado.stock).toBe(productoData.stock);
    expect(productoGuardado.sku).toBe(productoData.sku);
  });

  it("debe fallar al intentar guardar un producto sin el campo requerido 'nombre'", async () => {
    const productoIncompleto = new Producto({
      // nombre omitido
      descripcion: "Producto sin nombre",
      precio: 29.99,
      categoria: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await productoIncompleto.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.nombre).toBeDefined();
  });
});
