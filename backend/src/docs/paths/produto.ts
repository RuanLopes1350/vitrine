import { OpenAPIV3 } from 'openapi-types';
import commonResponses from './scalarCommonResponse.js';

const produtoPaths: OpenAPIV3.PathsObject = {
  '/produtos/validate': {
    post: {
      tags: ['Produtos'],
      summary: 'Valida dados de um produto (requer autenticação)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ProdutoPost' } }
        }
      },
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        401: commonResponses[401](),
        422: commonResponses[422](),
        500: commonResponses[500]()
      }
    }
  },
  '/produtos': {
    post: {
      tags: ['Produtos'],
      summary: 'Cria um novo produto (requer autenticação)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ProdutoPost' } }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/ProdutoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        422: commonResponses[422](),
        500: commonResponses[500]()
      }
    },
    get: {
      tags: ['Produtos'],
      summary: 'Lista produtos',
      responses: {
        200: commonResponses[200]("#/components/schemas/ProdutoListagem"),
        500: commonResponses[500]()
      }
    }
  },
  '/produtos/usuario/{id}': {
    get: {
      tags: ['Produtos'],
      summary: 'Busca todos os produtos de um usuário específico (com paginação)',
      parameters: [
        { 
          name: 'id', 
          in: 'path', 
          required: true, 
          schema: { type: 'string' }, 
          description: 'ID do usuário (ObjectId)' 
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 1, minimum: 1 },
          description: 'Número da página para paginação'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 1000 },
          description: 'Quantidade de produtos por página (máximo 1000)'
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/ProdutoPaginado"),
        400: commonResponses[400](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  '/produtos/{id}': {
    get: {
      tags: ['Produtos'],
      summary: 'Busca produto por ID',
      parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do produto (ObjectId)' } ],
      responses: {
        200: commonResponses[200]("#/components/schemas/ProdutoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    },
    patch: {
      tags: ['Produtos'],
      summary: 'Atualiza produto (requer autenticação)',
      security: [{ bearerAuth: [] }],
      parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' } } ],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoPatch' } } } },
      responses: {
        200: commonResponses[200]("#/components/schemas/ProdutoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        422: commonResponses[422](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ['Produtos'],
      summary: 'Deleta produto (requer autenticação)',
      security: [{ bearerAuth: [] }],
      parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' } } ],
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  }
};

export default produtoPaths;
