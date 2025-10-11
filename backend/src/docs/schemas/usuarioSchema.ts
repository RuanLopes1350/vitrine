// src/docs/schemas/usuarioSchema.ts

import mongoose from "mongoose";
import mongooseSchemaJsonSchema from "mongoose-schema-jsonschema";
import removeFieldsRecursively from "../../utils/scalar_utils/removeFields.js";
import Usuario from "../../models/modelUsuario.js";
import { deepCopy, generateExample } from "../utils/schemaGenerate.js";

// Tipo simplificado de JSON Schema
export type JSONSchema = {
  type?: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  description?: string;
  example?: any;
  [key: string]: any;
};

// Registra o plugin
mongooseSchemaJsonSchema(mongoose);

// Gera schema base a partir da model
const usuarioJsonSchema = Usuario.schema.toJSONSchema() as JSONSchema;

delete usuarioJsonSchema.properties?.__v;

// Criação dos schemas
const usuarioSchemas: Record<string, JSONSchema> = {
  UsuarioFiltro: {
    type: "object",
    properties: {
      nome: usuarioJsonSchema.properties?.nome ?? { type: "string" },
      nomeLoja: usuarioJsonSchema.properties?.nomeLoja ?? { type: "string" },
      email: usuarioJsonSchema.properties?.email ?? { type: "string" },
      ativo: usuarioJsonSchema.properties?.ativo ?? { type: "boolean" },
    },
  },
  UsuarioListagem: {
    ...deepCopy(usuarioJsonSchema),
    description: "Schema para listagem dos usuários",
  },
  UsuarioDetalhes: {
    ...deepCopy(usuarioJsonSchema),
    description: "Schema para detalhes de um usuário",
  },
  UsuarioPost: {
    ...deepCopy(usuarioJsonSchema),
    required: ["nome", "nomeLoja", "email", "senha", "whatsapp"],
    description: "Schema para criação de um usuário",
    example: {
      nome: "João Silva",
      nomeLoja: "Loja do João",
      email: "joao@email.com",
      senha: "Senha@123",
      whatsapp: "55999999999",
      ativo: true,
    },
  },
  UsuarioPatch: {
    ...deepCopy(usuarioJsonSchema),
    required: [],
    description: "Schema para atualização parcial de um usuário",
    example: {
      nome: "Maria Oliveira",
      whatsapp: "55888888888",
    },
  },
  UsuarioLogin: {
    type: "object",
    required: ["email", "senha"],
    properties: {
      email: usuarioJsonSchema.properties?.email ?? { type: "string" },
      senha: usuarioJsonSchema.properties?.senha ?? { type: "string" },
    },
    description: "Schema para login de usuário",
    example: {
      email: "intel.spec.lopes@gmail.com",
      senha: "SenhaSuperSegur@123",
    },
  },
  UsuarioRespostaLogin: {
    type: "object",
    properties: {
      accessToken: usuarioJsonSchema.properties?.accessToken ?? { type: "string" },
    },
    description: "Schema para resposta do login de usuário",
    example: {
      accessToken: "jwt_token_aqui",
    },
  },
  RespostaValidacaoCodigo: {
    type: "object",
    properties: {
      codigoRecuperaSenha: {
        type: "string",
        description: "Código de recuperação de senha válido",
        example: "ABC123DEF"
      }
    },
    description: "Schema para resposta da validação de código de recuperação",
    example: {
      codigoRecuperaSenha: "ABC123DEF"
    }
  }
};

// Campos a remover em cada schema
const removalMapping: Record<string, string[]> = {
  UsuarioListagem: ["__v", "senha", "accessToken", "codigoRecuperaSenha", "expCodigoRecuperaSenha"],
  UsuarioDetalhes: ["__v", "senha", "accessToken", "codigoRecuperaSenha", "expCodigoRecuperaSenha"],
  UsuarioPost: ["__v", "_id", "accessToken", "codigoRecuperaSenha", "expCodigoRecuperaSenha"],
  UsuarioPatch: ["__v", "_id", "accessToken", "codigoRecuperaSenha", "expCodigoRecuperaSenha"],
  UsuarioLogin: ["__v", "_id", "accessToken", "codigoRecuperaSenha", "expCodigoRecuperaSenha"],
  UsuarioRespostaLogin: ["__v", "senha"],
  RespostaValidacaoCodigo: ["__v", "senha", "accessToken", "expCodigoRecuperaSenha"],
};

// Aplica remoção de campos
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (usuarioSchemas[schemaKey]) {
    removeFieldsRecursively(usuarioSchemas[schemaKey], fields);
  }
});

// Gera exemplos automaticamente
const usuarioMongooseSchema = Usuario.schema;

async function generateExamples() {
  for (const [key, schema] of Object.entries(usuarioSchemas)) {
    schema.example ??= await generateExample(schema, null, usuarioMongooseSchema);
  }
}

await generateExamples();

export default usuarioSchemas;