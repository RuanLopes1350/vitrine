import { OpenAPIV3 } from 'openapi-types';
import commonResponses from './scalarCommonResponse.js';

const authPaths: OpenAPIV3.PathsObject = {
  '/login': {
    post: {
      tags: ['Auth'],
      summary: 'Realiza login do usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/loginPost' }
          }
        }
      },
      responses: {
        200: commonResponses[200]('#/components/schemas/RespostaLogin'),
        400: commonResponses[400](),
        401: commonResponses[401](),
        500: commonResponses[500]()
      }
    }
  },
  '/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Realiza logout (invalidação no frontend)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: commonResponses[200](),
        401: commonResponses[401]()
      }
    }
  }
};

export default authPaths;
