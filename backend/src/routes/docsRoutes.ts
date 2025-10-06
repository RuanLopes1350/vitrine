import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import getOpenAPIOptions from "../docs/config/head.js";

export const getDocsRouter = () => {
    const router = express.Router();

    router.get("/",(req, res) => {
        res.status(200).redirect("/reference");
	});

    router.get("/reference/openapi.json", async (req, res) => {
        try {
            // Gerar o documento OpenAPI dinamicamente a partir da configuração
            const openapiDoc = await getOpenAPIOptions();
            return res.json(openapiDoc);
        } catch (err) {
            console.error('Erro ao gerar OpenAPI:', err);
            return res.status(500).json({ message: 'Erro ao gerar documentação OpenAPI' });
        }
    });

    router.use(
        "/reference",
        apiReference({
            // Put your OpenAPI url here:
            url: "/reference/openapi.json",
        }),
    );

    return router;
};