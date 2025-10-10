import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import getOpenAPIOptions from "../docs/config/head.js";

const router = express.Router();

// Endpoint para servir o JSON do OpenAPI
router.get("/openapi.json", async (req, res) => {
    try {
        const openapiDoc = await getOpenAPIOptions();
        return res.json(openapiDoc);
    } catch (err) {
        console.error('Erro ao gerar OpenAPI:', err);
        return res.status(500).json({ message: 'Erro ao gerar documentação OpenAPI' });
    }
});

// Interface de documentação do Scalar na raiz de /docs
router.use(
    "/",
    apiReference({
        url: "/api/docs/openapi.json",
    })
);

export default router;