// /src/seeds/loadModels.ts

import fs from 'fs';
import path from 'path';
import {
    fileURLToPath
} from 'url';
import { Model } from 'mongoose';

// Tipagem para os modelos carregados
export interface LoadedModel {
  name: string;
  model: Model<any>;
}

// Obtém o diretório atual do arquivo
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Função para ler automaticamente os models da pasta "../models".
 * Retorna um array com objetos { model, name }.
 */
async function loadModels(): Promise<LoadedModel[]> {
    const models: LoadedModel[] = [];
    const modelsDir = path.join(__dirname, '../models');
    const files = fs.readdirSync(modelsDir);

    for (const file of files) {
        if (file.endsWith('.ts') && !file.startsWith('_') && file !== 'index.ts') {
            try {
                const modelPath = path.join(modelsDir, file);
                const module = await import(`file://${modelPath}`);
                const model: Model<any> = module.default || module;
                const modelName = path.basename(file, '.ts');
                models.push({
                    model,
                    name: modelName
                });
            } catch (error) {
                console.error(`Erro ao carregar model ${file}:`, error);
            }
        }
    }
    return models;
}

export default loadModels;