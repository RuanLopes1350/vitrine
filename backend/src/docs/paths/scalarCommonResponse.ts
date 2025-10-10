// src/docs/swaggerCommonResponses.js

import HttpStatusCodes from "../../utils/helpers/httpStatusCodes.js";

type ResponseFactory = (schemaRef?: string | null, description?: string) => any;

const scalarCommonResponses: Record<number, ResponseFactory> = {};

// Percorre todas as chaves do HttpStatusCodes e cria dinamicamente
// um método para cada status code, no mesmo padrão que você já utiliza.
Object.entries(HttpStatusCodes).forEach(([key, value]) => {
  const { code, message } = value;

  scalarCommonResponses[code] = (schemaRef: string | null = null, description: string = message) => ({
      description,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        data: schemaRef ?
                            {
                                $ref: schemaRef
                            } :
                            {
                                type: "array",
                                items: {},
                                example: []
                            },
                        message: {
                            type: "string",
                            example: message
                        },
                        errors: {
                            type: "array",
                            // Para status de erro, retorna um array com um objeto contendo a mensagem
                            example: code >= 400 ? [{
                                message
                            }] : [],
                        },
                    },
                },
            },
        },
    });
});

export default scalarCommonResponses;