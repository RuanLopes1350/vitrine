// utils/schemaUtils.ts

import mongoose from 'mongoose';
import { Schema, SchemaType, SchemaTypeOptions } from 'mongoose';
import getGlobalFakeMapping from '../../seeds/globalFakeMapping.js';

/**
 * Realiza uma cópia profunda do objeto.
 */
export function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Tipo auxiliar para verificar se o objeto possui a propriedade 'options'.
 * Usado para detectar arrays de referências no Mongoose.
 * @property {SchemaTypeOptions} [options] - Opções do schema.
 */
type CasterWithOptions = {
  options?: SchemaTypeOptions<unknown>;
};

/**
 * Verifica se o objeto é do tipo CasterWithOptions.
 * @param obj - Objeto a ser verificado.
 */
export function hasOptions(obj: unknown): obj is CasterWithOptions {
  return typeof obj === "object" && obj !== null && "options" in obj;
}

/**
 * Verifica se o campo é um array de referência com base no schema do Mongoose.
 * @param key - Nome do campo.
 * @param mongooseSchema - Schema do modelo do Mongoose.
 */
export function isRefField(key: string, mongooseSchema: Schema): boolean {
  const path: SchemaType | undefined = mongooseSchema.path(key);
  return !!(
    path &&
    path.instance === 'Array' &&
    "caster" in path &&
    path.caster &&
    hasOptions(path.caster) &&
    path.caster.options?.ref
  );
}

/**
 * Gera um exemplo recursivamente a partir do JSON Schema, utilizando o mapeamento global para campos específicos.
 * Esta versão é assíncrona para aguardar a resolução do mapping.
 * @param {object} schema - O JSON Schema.
 * @param {string|null} key - Nome do campo atual (opcional).
 * @param {mongoose.Schema|null} mongooseSchema - Schema do modelo do Mongoose para detectar referências (opcional).
 */
export async function generateExample(schema: any, key: string | null = null, mongooseSchema: mongoose.Schema | null = null): Promise<any> {
  // Se já houver um exemplo definido no schema, retorna-o
  if (schema.example !== undefined) {
    return schema.example;
  }

  // Obtém o mapping global resolvido
  const mapping: Record<string, any> = await getGlobalFakeMapping();

  // Se existir um gerador para o campo, utiliza-o para gerar um exemplo realista
  if (key && mapping[key]) {
    const generator = mapping[key];
    return typeof generator === 'function' ? generator() : generator;
  }

  // Se a propriedade for "_id", gera um ObjectId válido
  if (key === '_id') {
    return new mongoose.Types.ObjectId().toString();
  }

  // Se o schema for do tipo "object", gera exemplo para cada propriedade recursivamente
  if (schema.type === "object" && schema.properties) {
    const example: Record<string, any> = {};
    for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
      example[propKey] = await generateExample(propertySchema, propKey, mongooseSchema);
    }
    return example;
  }

  // Se for um array
  if (schema.type === "array" && schema.items) {
    // Se o campo for um array de referência, detectado automaticamente
    if (key && mongooseSchema && isRefField(key, mongooseSchema)) {
      return [{
          _id: new mongoose.Types.ObjectId().toString()
        },
        {
          _id: new mongoose.Types.ObjectId().toString()
        }
      ];
    }
    return [await generateExample(schema.items, null, mongooseSchema)];
  }

  // Valores padrão para tipos primitivos
  if (schema.type === "string") {
    return "exemplo string";
  }
  if (schema.type === "number" || schema.type === "integer") {
    return 0;
  }
  if (schema.type === "boolean") {
    return true;
  }
  return null;
}
