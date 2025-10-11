// src/docs/schemas/authSchema.ts

import { OpenAPIV3 } from 'openapi-types';
import { generateExample } from '../utils/schemaGenerate.js';

type SchemaRecord = Record<string, OpenAPIV3.SchemaObject>;

const authSchemas: SchemaRecord = {
  RespostaRecuperaSenha: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem indicando o status da recuperação de senha",
        example: "Email enviado com sucesso para recuperação de senha"
      }
    },
  },
  RequisicaoRecuperaSenha: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Endereço de email do usuário para recuperação de senha",
        example: "usuario@exemplo.com"
      }
    },
    required: ["email"],
    example: {
      email: "usuario@exemplo.com"
    }
  },
  RequisicaoTrocaSenha: {
    type: "object",
    properties: {
      senha: {
        type: "string",
        description: "Nova senha do usuário (mínimo 8 caracteres)",
        example: "NovaSenha@123"
      }
    },
    required: ["senha"],
    example: {
      senha: "NovaSenha@123"
    }
  },
  loginPost: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email do usuário"
      },
      senha: {
        type: "string",
        description: "Senha do usuário"
      }
    },
    required: ["email", "senha"],
    example: {
      email: "intel.spec.lopes@gmail.com",
      senha: "SenhaSuperSegur@123"
    }
  },
  RespostaPass: {
    type: "object",
    properties: {
      active: {
        type: "boolean",
        description: "Indica se o token ainda é válido (não expirado)",
        example: true
      },
      client_id: {
        type: "string",
        description: "ID do cliente OAuth",
        example: "1234567890abcdef"
      },
      token_type: {
        type: "string",
        description: "Tipo de token, conforme RFC 6749",
        example: "Bearer"
      },
      exp: {
        type: "string",
        description: "Timestamp UNIX de expiração do token",
        example: 1672531199
      },
      iat: {
        type: "string",
        description: "Timestamp UNIX de emissão do token",
        example: 1672527600
      },
      nbf: {
        type: "string",
        description: "Timestamp UNIX de início de validade do token",
        example: 1672527600
      }
    }
  },
  signupPost: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome do usuário"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário"
      },
      senha: {
        type: "string",
        description: "Senha do usuário"
      },
    },
    required: ["nome", "email", "senha"]
  }
  ,
  RespostaLogin: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Token JWT de autenticação'
      },
      usuario: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nome: { type: 'string' },
          nomeLoja: { type: 'string' },
          email: { type: 'string' },
          whatsapp: { type: 'string' },
          ativo: { type: 'boolean' }
        }
      }
    }
  }
};

const addExamples = async (): Promise<void> => {
  for (const key of Object.keys(authSchemas)) {
    const schema = authSchemas[key];
    if (schema.properties) {
      for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
        if (typeof propertySchema === "object" && propertySchema !== null && !("example" in propertySchema)) {
          (propertySchema as OpenAPIV3.SchemaObject).example = await generateExample(propertySchema, propKey);
        }
      }
    }
    if (!schema.example) {
      schema.example = await generateExample(schema);
    }
  }
};

await addExamples();

export default authSchemas;