// /src/docs/routes/utils/routeGenerateparameters.ts
import { OpenAPIV3 } from 'openapi-types';

type JSONSchema = {
    type?: string;
    properties?: Record<string, JSONSchema>;
    [key: string]: any;
}

/**
 * Gera parâmetros de query automaticamente a partir de um schema JSON.
 * @param schema - Schema JSON usado como base.
 * @param baseRef - Referência base (opcional).
 * @param parentKey - Nome do campo pai (para objetos aninhados).
 */
export function generateParameters(schema: JSONSchema, baseRef = '', parentKey = ''): OpenAPIV3.ParameterObject[] {
    const params: OpenAPIV3.ParameterObject[] = [];
    const properties: Record<string, JSONSchema> = schema.properties || {};

    for (const [key, value] of Object.entries(properties)) {
        // Se value estiver indefinido, pula para o próximo
        if (!value) continue;

        const paramName = parentKey ? `${parentKey}.${key}` : key;

        if (value.type === 'object' && value.properties) {
            params.push(...generateParameters(value, baseRef, paramName));
        } else {
            params.push({
                name: paramName,
                in: 'query',
                required: false,
                schema: value as OpenAPIV3.SchemaObject, // Use o schema diretamente em vez de $ref
                description: `Filtro por ${paramName}`
            });
        }
    }
    return params;
}