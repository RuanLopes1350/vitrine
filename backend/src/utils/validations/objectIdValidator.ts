import { ObjectId } from 'mongodb';

export class ObjectIdValidator {
    /**
     * Valida se uma string é um ObjectId válido do MongoDB
     * @param id - String a ser validada
     * @returns boolean - true se válido, false caso contrário
     */
    static isValid(id: string): boolean {
        if (!id || typeof id !== 'string') {
            return false;
        }

        // Verifica se tem 24 caracteres hexadecimais
        if (id.length !== 24) {
            return false;
        }

        // Verifica se contém apenas caracteres hexadecimais
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return false;
        }

        // Validação adicional usando ObjectId do MongoDB
        try {
            new ObjectId(id);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Converte string para ObjectId se válida
     * @param id - String a ser convertida
     * @returns ObjectId ou null se inválida
     */
    static toObjectId(id: string): ObjectId | null {
        if (!this.isValid(id)) {
            return null;
        }
        return new ObjectId(id);
    }
}