// src/docs/config/head.ts
import { OpenAPIV3 } from "openapi-types";

// Função para obter as opções do OpenAPI
const getServersInCorrectOrder = (): OpenAPIV3.ServerObject[] => {
    const devUrl: OpenAPIV3.ServerObject = {
        url: process.env.SCALAR_DEV_URL || `https://scalar1350.vps-kinghost.net`
    };
    const prodUrl1: OpenAPIV3.ServerObject = {
        url: process.env.SCALAR_PROD_URL || "http://localhost:1350"
    };

    if (process.env.NODE_ENV === "production") return [prodUrl1, devUrl];
    else return [devUrl, prodUrl1];
};


const getOpenAPIOptions = async (): Promise<OpenAPIV3.Document> => {
    const t = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';

    const usuarioPaths = (await import(new URL("../paths/usuario.ts",
        import.meta.url).href + t)).default;
    const usuarioSchemas = (await import(new URL("../schemas/usuarioSchema.ts",
        import.meta.url).href + t)).default;
    const authPaths = (await import(new URL("../paths/auth.ts",
        import.meta.url).href + t)).default;
    const authSchemas = (await import(new URL("../schemas/authSchema.ts",
        import.meta.url).href + t)).default;
    const produtoPaths = (await import(new URL("../paths/produto.ts",
        import.meta.url).href + t)).default;
    const produtoSchemas = (await import(new URL("../schemas/produtoSchema.ts",
        import.meta.url).href + t)).default;

    const scalarOpptions: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: {
            title: "API Vitrine",
            version: "1.0.0",
            description: "Documentação da API para gerenciamento de usuários e produtos.",
            contact: {
                name: "Vitrine",
                email: "vitrine.support@gmail.com",
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
            }
        },
        security: [{
            bearerAuth: []
        }]
    };

    return scalarOpptions;
};

export default getOpenAPIOptions;