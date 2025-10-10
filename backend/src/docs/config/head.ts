// src/docs/config/head.ts
import { OpenAPIV3 } from "openapi-types";
import usuarioPaths from "../paths/usuario.js";
import usuarioSchemas from "../schemas/usuarioSchema.js";
import authPaths from "../paths/auth.js";
import authSchemas from "../schemas/authSchema.js";
import produtoPaths from "../paths/produto.js";
import produtoSchemas from "../schemas/produtoSchema.js";

// Função para obter as opções do OpenAPI
const getServersInCorrectOrder = (): OpenAPIV3.ServerObject[] => {
    const prodUrl: OpenAPIV3.ServerObject = {
        url: process.env.SCALAR_PROD_URL || `https://vitrine-fawn.vercel.app/api`
    };
    const devUrl: OpenAPIV3.ServerObject = {
        url: process.env.SCALAR_DEV_URL || "http://localhost:1350"
    };

    if (process.env.NODE_ENV === "development") return [devUrl, prodUrl];
    else return [prodUrl, devUrl];
};


const getOpenAPIOptions = async (): Promise<OpenAPIV3.Document> => {
    const scalarOpptions: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: {
            title: "API Vitrine",
            version: "1.0.0",
            description: "Documentação da API para gerenciamento de usuários e produtos.",
            contact: {
                name: "Vitrine",
                email: "contatoruanlopes1350@gmail.com",
            },
        },
        servers: getServersInCorrectOrder(),
        tags: [{
                name: "Auth",
                description: "Rotas para autenticação e autorização"
            },
            {
                name: "Usuários",
                description: "Rotas para o gerenciamento de usuarios"
            },
            {
                name: "Produtos",
                description: "Rotas para o gerenciamento de produtos"
            },
        ],
        paths: {
            ...authPaths,
            ...usuarioPaths,
            ...produtoPaths,
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                ...authSchemas,
                ...usuarioSchemas,
                ...produtoSchemas,
            } as Record<string, OpenAPIV3.SchemaObject>
        },
        security: [{
            bearerAuth: []
        }]
    };

    return scalarOpptions;
};

export default getOpenAPIOptions;