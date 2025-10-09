import { faker } from '@faker-js/faker/locale/pt_BR'
import modelUsuario from '../models/modelUsuario.js';
import modelProduto from '../models/modelProduto.js';
import loadModels from './loadModels.js';

// Define os mapeamentos por model
const fakeMappings: Record<string, any> = {
  common: {
    ativo: () => faker.datatype.boolean(),
    data_cadastro: () => new Date().toISOString(),
    data_ultima_atualizacao: () => new Date().toISOString()
  },
    modelUsuario: {
        nome: () => faker.person.fullName(),
        nomeLoja: () => faker.company.name(),
        email: () => faker.internet.email(),
        senha: () => faker.internet.password(),
        whatsapp: () => faker.phone.number(),
        fotoPerfil: () => faker.image.avatar(),
        mensagem: () => faker.lorem.sentence(),
        accessToken: () => faker.string.alphanumeric(32),
        codigoRecuperaSenha: () =>"",
        expCodigoRecuperaSenha: () =>"",
        tokenUnico:() =>""
    },
    modelProduto: {
        criador: () => faker.person.fullName(),
        nome_produto: () => faker.commerce.productName(),
        descricao: () => faker.lorem.lines(3),
        preco: () => faker.commerce.price(),
        imagem: () => faker.image.urlPicsumPhotos(),
        mensagem: () => faker.lorem.lines(1)
    }
};

/**
 * Retorna o mapping global, consolidando os mappings comuns e específicos.
 * Nesta versão automatizada, carregamos os models e combinamos o mapping comum com o mapping específico de cada model.
 */
export async function getGlobalFakeMapping() {
  const models = await loadModels();
  let globalMapping = {
    ...fakeMappings.common
  };

  models.forEach(({
    name
  }) => {
    if (fakeMappings[name]) {
      globalMapping = {
        ...globalMapping,
        ...fakeMappings[name],
      };
    }
  });

  return globalMapping;
}

/**
 * Função auxiliar para extrair os nomes dos campos de um schema,
 * considerando apenas os níveis superiores (campos aninhados são verificados pela parte antes do ponto).
 */
function getSchemaFieldNames(schema: any): string[] {
  const fieldNames = new Set<string>();
  Object.keys(schema.paths).forEach((key) => {
    if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return;
    const topLevel = key.split(".")[0];
    fieldNames.add(topLevel);
  });
  return Array.from(fieldNames);
}

/**
 * Valida se o mapping fornecido cobre todos os campos do model.
 * Retorna um array com os nomes dos campos que estiverem faltando.
 */
function validateModelMapping(model: any, modelName: string, mapping: Record<string, any>): string[] {
  if (!model || !model.schema || !model.schema.paths) {
    console.warn(`Model ${modelName} é inválido ou sem schema.paths.`);
    return [];
  }

  const fields = getSchemaFieldNames(model.schema);
  const missing = fields.filter((field) => !(field in mapping));
  if (missing.length > 0) {
    console.error(
      `Model ${modelName} está faltando mapeamento para os campos: ${missing.join(
        ", "
      )}`
    );
  } else {
    console.log(`Model ${modelName} possui mapeamento para todos os campos.`);
  }
  return missing;
}

/**
 * Executa a validação para os models fornecidos, utilizando o mapping específico de cada um.
 */
async function validateAllMappings() {
  const models = await loadModels();
  let totalMissing: Record<string, string[]> = {};

  models.forEach(({
    model,
    name
  }) => {
    // Combina os campos comuns com os específicos de cada model
    const mapping = {
      ...fakeMappings.common,
      ...(fakeMappings[name] || {}),
    };
    const missing = validateModelMapping(model, name, mapping);
    if (missing.length > 0) {
      totalMissing[name] = missing;
    }
  });

  if (Object.keys(totalMissing).length === 0) {
    console.log("globalFakeMapping cobre todos os campos de todos os models.");
    return true;
  } else {
    console.warn("Faltam mapeamentos para os seguintes models:", totalMissing);
    return false;
  }
}

// Executa a validação antes de prosseguir com o seeding ou outras operações
validateAllMappings()
  .then((valid) => {
    if (valid) {
      console.log("Podemos acessar globalFakeMapping com segurança.");
      // Prossegue com o seeding ou outras operações
    } else {
      throw new Error(
        "globalFakeMapping não possui todos os mapeamentos necessários."
      );
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default getGlobalFakeMapping;