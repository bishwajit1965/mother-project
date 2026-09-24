// swagger-jsdoc does not ship TypeScript declarations.
// @ts-expect-error Missing declaration file for the JavaScript package.
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Mother Project API",
      version: "1.0.0",
      description: "Production-ready API documentation",
    },

    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
