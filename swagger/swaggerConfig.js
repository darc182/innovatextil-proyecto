import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de InnovaTextil",
      version: "1.0.0",
      description: `Esta es la documentacion del proyecto InnovaTextil, es una app que permite 
        automatizar y dinamizar la venta de productos de la empresa
      `,
    },
    servers: [
      {
        url: process.env.BACKEND_URL || "http://localhost:4000",
      },
    ],
  },
  apis: ["./swagger/*.yml"], // Importa todas las rutas para documentarlas
};

const swaggerSpec = swaggerJSDoc(options);



const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log(`📄 Swagger UI disponible en: ${process.env.BACKEND_URL || "http://localhost:4000"}/api-docs`);
};

export default swaggerDocs;
