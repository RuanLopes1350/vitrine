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