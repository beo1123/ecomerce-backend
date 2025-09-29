import fs from "fs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce Backend API",
            version: "1.0.0",
            description: "API documentation for your e-commerce backend",
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/modules/**/*.js"], // path tới file chứa comment OpenAPI
};

const specs = swaggerJsdoc(options);

// Xuất swagger.json ra file
// fs.writeFileSync("./swagger.json", JSON.stringify(specs, null, 2));

export function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
