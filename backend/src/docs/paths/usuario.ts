import { OpenAPIV3 } from 'openapi-types';
import commonResponses from './scalarCommonResponse.js';

const usuarioPaths: OpenAPIV3.PathsObject = {
  '/usuarios': {
    post: {
      tags: ['Usuários'],
      summary: 'Cadastra um novo usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UsuarioPost' }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/UsuarioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        422: commonResponses[422](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    get: {
      tags: ['Usuários'],
      summary: 'Lista usuários (requer autenticação)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: commonResponses[200]("#/components/schemas/UsuarioListagem"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  '/usuarios/{id}': {
    get: {
      tags: ['Usuários'],
      summary: 'Buscar usuário por ID (requer autenticação)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID do usuário (ObjectId)'
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    patch: {
      tags: ['Usuários'],
      summary: 'Atualiza parcialmente um usuário (requer autenticação)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do usuário' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UsuarioPatch' } }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/UsuarioPatch"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        422: commonResponses[422](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ['Usuários'],
      summary: 'Deleta um usuário (requer autenticação)',
      security: [{ bearerAuth: [] }],
      parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do usuário' } ],
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default usuarioPaths;
