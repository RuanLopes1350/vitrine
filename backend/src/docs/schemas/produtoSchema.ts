// src/docs/schemas/produtoSchema.ts

import mongoose from "mongoose";
import mongooseSchemaJsonSchema from "mongoose-schema-jsonschema";
import removeFieldsRecursively from "../../utils/scalar_utils/removeFields.js";
import Produto from "../../models/modelProduto.js";
import { deepCopy, generateExample } from "../utils/schemaGenerate.js";
import { JSONSchema } from "./usuarioSchema.js"; // reutiliza o tipo JSONSchema

// Registra o plugin
mongooseSchemaJsonSchema(mongoose);

// Gera schema base a partir da model
const produtoJsonSchema = Produto.schema.toJSONSchema() as JSONSchema;

// Remove __v do schema base
delete produtoJsonSchema.properties?.__v;

// Criação dos schemas
const produtoSchemas: Record<string, JSONSchema> = {
  ProdutoFiltro: {
    type: "object",
    properties: {
      nome_produto: produtoJsonSchema.properties?.nome_produto ?? { type: "string" },
      ativo: produtoJsonSchema.properties?.ativo ?? { type: "boolean" },
      preco: produtoJsonSchema.properties?.preco ?? { type: "number" },
    },
  },
  ProdutoPaginado: {
    type: "object",
    properties: {
      docs: {
        type: "array",
        items: {
          type: "object",
          properties: produtoJsonSchema.properties,
          description: "Produto com dados do criador populado"
        },
        description: "Array de produtos"
      },
      totalDocs: {
        type: "integer",
        description: "Total de documentos encontrados",
        example: 25
      },
      limit: {
        type: "integer",
        description: "Limite de produtos por página",
        example: 10
      },
      totalPages: {
        type: "integer",
        description: "Total de páginas disponíveis",
        example: 3
      },
      page: {
        type: "integer",
        description: "Página atual",
        example: 1
      },
      pagingCounter: {
        type: "integer",
        description: "Contador de paginação",
        example: 1
      },
      hasPrevPage: {
        type: "boolean",
        description: "Indica se há página anterior",
        example: false
      },
      hasNextPage: {
        type: "boolean",
        description: "Indica se há próxima página",
        example: true
      },
      prevPage: {
        oneOf: [
          { type: "integer" },
          { type: "null" }
        ],
        description: "Número da página anterior ou null",
        example: null
      },
      nextPage: {
        oneOf: [
          { type: "integer" },
          { type: "null" }
        ],
        description: "Número da próxima página ou null",
        example: 2
      }
    },
    description: "Schema para resposta paginada de produtos de um usuário"
  },
  ProdutoListagem: {
    ...deepCopy(produtoJsonSchema),
    description: "Schema para listagem de produtos",
  },
  ProdutoDetalhes: {
    ...deepCopy(produtoJsonSchema),
    description: "Schema para detalhes de um produto",
  },
  ProdutoPost: {
    ...deepCopy(produtoJsonSchema),
    required: ["nome_produto", "descricao", "preco", "mensagem"],
    description: "Schema para criação de um produto",
    example: {
      criador: "687466f04c27d5dd5911bedb",
      nome_produto: "Notebook Gamer",
      descricao: "Notebook potente para jogos e trabalho",
      preco: 5999.99,
      imagem: "http://exemplo.com/imagem.jpg",
      ativo: true,
      mensagem: "Produto disponível!"
    },
  },
  ProdutoPatch: {
    ...deepCopy(produtoJsonSchema),
    required: [],
    description: "Schema para atualização parcial de um produto",
    example: {
      nome_produto: "Notebook Gamer Plus",
      preco: 6199.99,
      ativo: false
    },
  },
};

// Campos a remover em cada schema
const removalMapping: Record<string, string[]> = {
  ProdutoListagem: ["__v"],
  ProdutoDetalhes: ["__v"],
  ProdutoPost: ["__v", "_id"],
  ProdutoPatch: ["__v", "_id"],
  ProdutoPaginado: ["__v"],
};

// Aplica remoção de campos
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (produtoSchemas[schemaKey]) {
    removeFieldsRecursively(produtoSchemas[schemaKey], fields);
  }
});

// Gera exemplos automaticamente
const produtoMongooseSchema = Produto.schema;

async function generateExamples() {
  for (const [key, schema] of Object.entries(produtoSchemas)) {
    schema.example ??= await generateExample(schema, null, produtoMongooseSchema);
  }
}

await generateExamples();

export default produtoSchemas;